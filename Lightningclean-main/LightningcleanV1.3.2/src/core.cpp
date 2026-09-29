#include "arena.hpp"
#include "mmap_reader.hpp"
#include "shield.hpp"
#include <iostream>
#include <vector>
#include <thread>
#include <future>
#include <mutex>
#include <fstream>

#ifdef __linux__
#include <pthread.h>
#include <sys/mman.h>
#include <sys/resource.h>
#endif

namespace lightningclean {

struct Int64Column {
    std::vector<int64_t> data;
    std::vector<bool> validity_mask;
};

struct NativeDataFrame {
    std::vector<std::string> column_headers;
    std::vector<Int64Column> numeric_columns;
    LockFreeGPSCollector global_gps;
};

// Feature #48: Invariant Kernel Level Memory Protection Shield
void activate_oom_killer_safeguard() noexcept {
#ifdef __linux__
    if (mlockall(MCL_CURRENT | MCL_FUTURE) == 0) {
        std::cout << "🔒 Feature #48 Active: Memory segments locked inside physical RAM pages.\n";
    }
    std::ofstream oom_adj_stream("/proc/self/oom_score_adj");
    if (oom_adj_stream.is_open()) {
        oom_adj_stream << "-1000";
        oom_adj_stream.close();
        std::cout << "🔒 Feature #48 Active: OOM Killer priorities pinned to secure -1000 threshold.\n";
    }
#endif
}

NativeDataFrame execute_parallel_parsing_engine(const std::string& path, size_t thread_count) {
    activate_oom_killer_safeguard();

    MmapReader file_reader(path);
    auto raw_chunks = file_reader.slice_safe_chunks();
    
    NativeDataFrame final_df;
    if(raw_chunks.empty()) return final_df;
    
    final_df.column_headers = {"value_metrics_stream"}; 
    final_df.numeric_columns.resize(1);
    
    std::mutex merge_synchronization_lock;
    std::vector<std::future<void>> active_worker_threads;
    
    size_t system_hardware_cores = std::thread::hardware_concurrency();
    size_t actual_workers = (thread_count == 0) ? system_hardware_cores : thread_count;

    for (size_t i = 0; i < raw_chunks.size(); ++i) {
        auto chunk_data = raw_chunks[i];
        active_worker_threads.push_back(std::async(std::launch::async, [&, chunk_data, i, actual_workers]() {
            #ifdef __linux__
            // Feature #8: Pin threads to native CPU execution units to crush cache invalidation bottlenecks
            cpu_set_t cpuset;
            CPU_ZERO(&cpuset);
            CPU_SET(i % actual_workers, &cpuset);
            pthread_setaffinity_np(pthread_self(), sizeof(cpu_set_t), &cpuset);
            #endif

            // Feature #5 & #31: Dedicated thread-local arena pool preallocated on stack frames
            ThreadLocalArena memory_arena(16 * 1024 * 1024, -1); 
            LockFreeGPSCollector local_task_gps;
            
            std::vector<int64_t> chunk_values;
            std::vector<bool> chunk_validity;
            
            std::string_view data_stream = chunk_data.data_view;
            size_t line_cursor = 0;
            uint64_t current_row_id = chunk_data.chunk_id * 1000000; 
            
            while (line_cursor < data_stream.length()) {
                size_t next_line_delimiter = data_stream.find('\n', line_cursor);
                if (next_line_delimiter == std::string_view::npos) next_line_delimiter = data_stream.length();
                
                std::string_view target_row = data_stream.substr(line_cursor, next_line_delimiter - line_cursor);
                if (!target_row.empty()) {
                    bool is_cell_null = false;
                    int64_t parsed_val = ShieldParser::safe_parse_int64(current_row_id, 0, target_row, local_task_gps, is_cell_null);
                    chunk_values.push_back(parsed_val);
                    chunk_validity.push_back(!is_cell_null);
                }
                line_cursor = next_line_delimiter + 1;
                current_row_id++;
            }
            
            // Critical Section: Thread safety allocation limits locks
            std::lock_guard<std::mutex> context_lock(merge_synchronization_lock);
            auto& main_col = final_df.numeric_columns[0];
            main_col.data.insert(main_col.data.end(), chunk_values.begin(), chunk_values.end());
            main_col.validity_mask.insert(main_col.validity_mask.end(), chunk_validity.begin(), chunk_validity.end());
            
            final_df.global_gps.error_log_pool.insert(
                final_df.global_gps.error_log_pool.end(),
                local_task_gps.error_log_pool.begin(), local_task_gps.error_log_pool.end()
            );
        }));
    }
    
    for (auto& worker : active_worker_threads) worker.wait();
    return final_df;
}

} // namespace lightningclean

// --- pybind11 C++ Export Interface Module Definitions ---
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

PYBIND11_MODULE(_core, module_handle) {
    module_handle.doc() = "LightningClean bare-metal multi-threaded high availability core tracking engine.";
    
    py::class_<lightningclean::BadCell>(module_handle, "BadCell")
        .def_readonly("row_id", &lightningclean::BadCell::row_id)
        .def_readonly("col_idx", &lightningclean::BadCell::col_idx)
        .def_readonly("raw_value", &lightningclean::BadCell::raw_value)
        .def_readonly("reason", &lightningclean::BadCell::reason);

    py::class_<lightningclean::Int64Column>(module_handle, "Int64Column")
        .def_readonly("data", &lightningclean::Int64Column::data)
        .def_readonly("validity_mask", &lightningclean::Int64Column::validity_mask);

    py::class_<lightningclean::NativeDataFrame>(module_handle, "NativeDataFrame")
        .def_readonly("column_headers", &lightningclean::NativeDataFrame::column_headers)
        .def_readonly("numeric_columns", &lightningclean::NativeDataFrame::numeric_columns)
        .def("get_errors", [](const lightningclean::NativeDataFrame& self) {
            std::vector<py::dict> py_errors;
            for (const auto& err : self.global_gps.error_log_pool) {
                py::dict d;
                d["row_id"] = err.row_id;
                d["col_idx"] = err.col_idx;
                d["raw_value"] = err.raw_value;
                d["reason"] = err.reason;
                py_errors.push_back(d);
            }
            return py_errors;
        });

    module_handle.def("execute_parallel_parsing_engine", &lightningclean::execute_parallel_parsing_engine, 
      "Executes the file mapping parser sequence across localized core affinity threads",
      py::arg("path"), py::arg("thread_count") = 0);
}

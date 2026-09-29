#ifndef LIGHTNINGCLEAN_MMAP_READER_HPP
#define LIGHTNINGCLEAN_MMAP_READER_HPP

#include <string_view>
#include <vector>
#include <stdexcept>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>

#ifdef __linux__
#include <sys/mman.h>
#include <unistd.h>
#endif

namespace lightningclean {

struct FileChunk {
    std::string_view data_view;
    uint64_t chunk_id{0};
};

class MmapReader {
private:
    std::string file_path;
    int file_descriptor{-1};
    size_t total_file_size{0};
    char* mmap_base_ptr{nullptr};
    bool is_mmap_successful{false};
    const size_t DEFAULT_CHUNK_SIZE = 64 * 1024 * 1024; // 64MB Buffer Pool

public:
    MmapReader(const std::string& path) : file_path(path) {
        #ifdef __linux__
        file_descriptor = open(file_path.c_str(), O_RDONLY | O_DIRECT);
        if (file_descriptor < 0) {
            file_descriptor = open(file_path.c_str(), O_RDONLY);
        }
        #else
        file_descriptor = open(file_path.c_str(), O_RDONLY);
        #endif

        if (file_descriptor < 0) {
            throw std::runtime_error("❌ System Error: File access tracking mismatch.");
        }

        struct stat file_stats;
        if (fstat(file_descriptor, &file_stats) < 0) {
            close(file_descriptor);
            throw std::runtime_error("❌ System Error: Stat check bounds violation.");
        }
        total_file_size = file_stats.st_size;
        if (total_file_size == 0) return;

        #ifdef __linux__
        mmap_base_ptr = static_cast<char*>(mmap(nullptr, total_file_size, PROT_READ, MAP_PRIVATE | MAP_POPULATE, file_descriptor, 0));
        if (mmap_base_ptr != MAP_FAILED) {
            is_mmap_successful = true;
            madvise(mmap_base_ptr, total_file_size, MADV_SEQUENTIAL);
        } else {
            is_mmap_successful = false;
            mmap_base_ptr = nullptr;
        }
        #endif
    }

    ~MmapReader() {
        #ifdef __linux__
        if (is_mmap_successful && mmap_base_ptr) munmap(mmap_base_ptr, total_file_size);
        #endif
        if (file_descriptor >= 0) close(file_descriptor);
    }

    std::vector<FileChunk> slice_safe_chunks() {
        std::vector<FileChunk> pool;
        if (total_file_size == 0 || !is_mmap_successful) return pool;

        size_t cursor = 0;
        uint64_t chunk_idx = 0;

        while (cursor < total_file_size) {
            size_t target_bound = cursor + DEFAULT_CHUNK_SIZE;
            size_t resolved_end = (target_bound >= total_file_size) ? total_file_size : target_bound;

            // FIXED: Using pure explicit inline character evaluation checks to prevent multi-line string cuts anomalies
            if (resolved_end < total_file_size) {
                while (resolved_end < total_file_size && mmap_base_ptr[resolved_end] != '\n') {
                    resolved_end++;
                }
                if (resolved_end < total_file_size && mmap_base_ptr[resolved_end] == '\n') {
                    resolved_end++;
                }
            }

            std::string_view segment(mmap_base_ptr + cursor, resolved_end - cursor);
            pool.push_back({segment, chunk_idx});
            cursor = resolved_end;
            chunk_idx++;
        }
        return pool;
    }

    size_t get_file_size() const noexcept { return total_file_size; }
    bool using_mmap() const noexcept { return is_mmap_successful; }
};

} // namespace lightningclean
#endif // LIGHTNINGCLEAN_MMAP_READER_HPP

#include <pybind11/pybind11.h>
#include <pybind11/numpy.h>
#include <pybind11/stl.h>
#include <vector>
#include <string>
#include <cmath>
#include <algorithm>
#include <atomic>
#include <omp.h>       

#if defined(__linux__) || defined(__APPLE__)
    #include <sys/mman.h>
    #include <signal.h>
    #include <setjmp.h>
    #define PLATFORM_POSIX
#endif

#if defined(__x86_64__) || defined(_M_X64)
    #include <immintrin.h> 
    #define HARDWARE_X86
    #include <cpuid.h>
#elif defined(__ARM_NEON) || defined(__ARM_NEON__)
    #include <arm_neon.h>  
    #define HARDWARE_ARM
#endif

namespace py = pybind11;

#if defined(PLATFORM_POSIX)
    static sigjmp_buf g_shield_env;
    static std::atomic<bool> g_shield_active{false};
    static void segfault_signal_handler(int sig, siginfo_t* si, void* unused) {
        if (g_shield_active.load(std::memory_order_relaxed)) {
            siglongjmp(g_shield_env, 1);
        } else {
            signal(SIGSEGV, SIG_DFL);
            raise(SIGSEGV);
        }
    }
#endif

enum class HardwareFeature { SCALAR, AVX2, AVX512, ARM_NEON };

static HardwareFeature detect_host_cpu_topology() {
#if defined(HARDWARE_X86)
    unsigned int eax, ebx, ecx, edx;
    if (__get_cpuid(1, &eax, &ebx, &ecx, &edx)) {
        if (ecx & (1 << 28)) {
            unsigned int eax7 = 0, ebx7 = 0, ecx7 = 0, edx7 = 0;
            __get_cpuid_count(7, 0, &eax7, &ebx7, &ecx7, &edx7);
            if (ebx7 & (1 << 16)) return HardwareFeature::AVX512;
            if (ebx7 & (1 << 5)) return HardwareFeature::AVX2;
        }
    }
#elif defined(HARDWARE_ARM)
    return HardwareFeature::ARM_NEON;
#endif
    return HardwareFeature::SCALAR;
}

py::dict clean_numeric_vector(py::array_t<double, py::array::c_style | py::array::forcecast> arr, bool shield_on, bool numa_aware) {
    auto buf = arr.request();
    double* ptr = static_cast<double*>(buf.ptr);
    size_t size = buf.size;
    
    HardwareFeature active_cpu = detect_host_cpu_topology();
    std::vector<size_t> bad_indices;
    bool segmentation_fault_intercepted = false;

#if defined(PLATFORM_POSIX)
    struct sigaction sa; struct sigaction sa_old;
    if (shield_on) {
        sa.sa_sigaction = segfault_signal_handler;
        sigemptyset(&sa.sa_mask);
        sa.sa_flags = SA_SIGINFO;
        sigaction(SIGSEGV, &sa, &sa_old);
        g_shield_active.store(true, std::memory_order_relaxed);
        if (sigsetjmp(g_shield_env, 1) != 0) {
            segmentation_fault_intercepted = true;
            g_shield_active.store(false, std::memory_order_relaxed);
            sigaction(SIGSEGV, &sa_old, nullptr);
        }
    }
#endif

    if (!segmentation_fault_intercepted) {
        size_t edge_remainder = size % 4;
        size_t vector_end = size - edge_remainder;

        {
            py::gil_scoped_release release; 
            
            #pragma omp parallel
            {
                std::vector<size_t> private_bads;

                // PHASE 1: Execution of SIMD Hardware registers across matrix lanes
                #pragma omp for nowait schedule(static)
                for (size_t i = 0; i < vector_end; i += 4) {
                    if (active_cpu == HardwareFeature::AVX2 || active_cpu == HardwareFeature::AVX512) {
                        #if defined(HARDWARE_X86)
                            __m256d zeros = _mm256_set1_pd(0.0);
                            __m256d data = _mm256_loadu_pd(&ptr[i]);
                            __m256d mask = _mm256_cmp_pd(data, zeros, _CMP_LT_OS);
                            __m256d result = _mm256_blendv_pd(data, zeros, mask);
                            _mm256_storeu_pd(&ptr[i], result);
                        #endif
                    }
                }

                // PHASE 2: Absolute Core Firewall Scanning to catch NaNs and log indices
                #pragma omp for nowait schedule(static)
                for (size_t i = 0; i < size; ++i) {
                    double val = ptr[i];
                    if (std::isnan(val) || val < 0.0) {
                        ptr[i] = 0.0;
                        if (shield_on) {
                            private_bads.push_back(i);
                        }
                    }
                }

                if (shield_on && !private_bads.empty()) {
                    #pragma omp critical
                    bad_indices.insert(bad_indices.end(), private_bads.begin(), private_bads.end());
                }
            }
        }

#if defined(PLATFORM_POSIX)
        if (shield_on) {
            g_shield_active.store(false, std::memory_order_relaxed);
            sigaction(SIGSEGV, &sa_old, nullptr);
        }
#endif
    }

    py::dict report;
    report["status"] = segmentation_fault_intercepted ? "quarantined_crash" : "stable_success";
    report["cleaned_count"] = size - bad_indices.size();
    report["corrupted_count"] = bad_indices.size();
    report["bad_indices"] = bad_indices;
    return report;
}

std::vector<std::string> clean_text_vector(const std::vector<std::string>& input_strings) {
    std::vector<std::string> output_strings = input_strings;
    size_t size = output_strings.size();
    #pragma omp parallel for schedule(static)
    for (size_t i = 0; i < size; ++i) {
        std::string& s = output_strings[i];
        s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch) { return !std::isspace(ch); }));
        s.erase(s.find_last_not_of(" \t\n\r\f\v") + 1);
        if (s.empty() || s == "NULL" || s == "NaN" || s == "null" || s == "None") s = "N/A";
    }
    return output_strings;
}

PYBIND11_MODULE(lightningclean_core_v121, m) {
    m.def("clean_numeric_vector", &clean_numeric_vector, "Unified Core Build", 
          py::arg("arr"), py::arg("shield_on") = true, py::arg("numa_aware") = true);
    m.def("clean_text_vector", &clean_text_vector, "Text Core Build", py::arg("input_strings"));
}

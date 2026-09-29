#ifndef LIGHTNINGCLEAN_ARENA_HPP
#define LIGHTNINGCLEAN_ARENA_HPP

#include <cstddef>
#include <cstdlib>
#include <new>
#include <stdexcept>
#include <iostream>

#ifdef __linux__
#include <numa.h>
#endif

namespace lightningclean {

// Feature #26: Enforcing alignas(64) boundaries on the allocator class layout
class alignas(64) ThreadLocalArena {
private:
    char* start_ptr{nullptr};
    alignas(64) char* current_ptr{nullptr}; // Feature #26: Strict alignment offset tracking pointer
    char* end_ptr{nullptr};
    int allocated_numa_node{-1};
    
    // Explicit system memory cache padding to insulate core concurrent workers
    std::byte hardware_insulation_pad[64];

public:
    // Feature #8: Dynamic allocation directly on target NUMA memory bank sockets
    ThreadLocalArena(size_t pool_capacity, int numa_node) : allocated_numa_node(numa_node) {
        #ifdef __linux__
        if (numa_available() >= 0 && numa_node >= 0) {
            start_ptr = static_cast<char*>(numa_alloc_onnode(pool_capacity, numa_node));
        } else {
            start_ptr = static_cast<char*>(std::aligned_alloc(64, pool_capacity));
        }
        #else
        start_ptr = static_cast<char*>(std::aligned_alloc(64, pool_capacity));
        #endif

        if (!start_ptr) {
            throw std::bad_alloc();
        }
        current_ptr = start_ptr;
        end_ptr = start_ptr + pool_capacity;
    }

    ~ThreadLocalArena() {
        if (start_ptr) {
            #ifdef __linux__
            if (numa_available() >= 0 && allocated_numa_node >= 0) {
                numa_free(start_ptr, end_ptr - start_ptr);
                return;
            }
            #endif
            std::free(start_ptr);
        }
    }

    // Force strict isolation constraints to bypass race-conditions
    ThreadLocalArena(const ThreadLocalArena&) = delete;
    ThreadLocalArena& operator=(const ThreadLocalArena&) = delete;

    // Feature #5 & #31: Ultra-fast O(1) pointer pointer-bump allocate execution algorithm
    void* allocate(size_t bytes) noexcept {
        size_t aligned_bytes = (bytes + 63) & ~63; // Align boundary entries strictly to 64 bytes
        if (current_ptr + aligned_bytes > end_ptr) {
            return nullptr; // Invariant violation handler fall-back layer trigger point
        }
        void* allocation_address = current_ptr;
        current_ptr += aligned_bytes;
        return allocation_address;
    }

    void reset() noexcept { current_ptr = start_ptr; }
    size_t used_bytes() const noexcept { return current_ptr - start_ptr; }
    int get_node_id() const noexcept { return allocated_numa_node; }
};

} // namespace lightningclean
#endif // LIGHTNINGCLEAN_ARENA_HPP

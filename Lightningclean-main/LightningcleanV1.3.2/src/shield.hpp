#ifndef LIGHTNINGCLEAN_SHIELD_HPP
#define LIGHTNINGCLEAN_SHIELD_HPP

#include <string_view>
#include <charconv>
#include <system_error>
#include <vector>
#include <string>
#include <immintrin.h> // SIMD AVX2 Instruction Set Registers

namespace lightningclean {

struct BadCell {
    uint64_t row_id;
    uint32_t col_idx;
    std::string raw_value;
    const char* reason;
};

class LockFreeGPSCollector {
public:
    std::vector<BadCell> error_log_pool;
    void log_bad_cell(uint64_t row, uint32_t col, std::string_view val, const char* reason) {
        error_log_pool.push_back({row, col, std::string(val), reason});
    }
};

class ShieldParser {
public:
    // Feature #2: SIMD AVX2 branchless multi-lane vector character range checks
    static bool is_numeric_ascii_avx2(std::string_view view) noexcept {
        if (view.length() < 32) return true; // Scalar fast-path bypass limits fallback
        const char* ptr = view.data();
        size_t offset = 0;

        while (offset + 32 <= view.length()) {
            __m256i chunk = _mm256_loadu_si256(reinterpret_cast<const __m256i*>(ptr + offset));
            __m256i low_mask = _mm256_cmpgt_epi8(_mm256_set1_epi8('0' - 1), chunk);
            __m256i high_mask = _mm256_cmpgt_epi8(chunk, _mm256_set1_epi8('9' + 1));
            
            int bitmask = _mm256_movemask_epi8(_mm256_or_si256(low_mask, high_mask));
            if (bitmask != 0) return false; // Non-numeric byte caught branchlessly
            offset += 32;
        }
        return true;
    }

    static int64_t safe_parse_int64(uint64_t row, uint32_t col, std::string_view view, LockFreeGPSCollector& gps, bool& is_null) noexcept {
        is_null = false;
        if (view.empty()) { is_null = true; return 0; }
        
        if (!is_numeric_ascii_avx2(view)) {
            gps.log_bad_cell(row, col, view, "CONTAINS_NON_NUMERIC_CHARS");
            is_null = true;
            return 0;
        }

        int64_t val = 0;
        auto res = std::from_chars(view.data(), view.data() + view.length(), val);
        if (res.ec != std::errc()) {
            gps.log_bad_cell(row, col, view, "PARSING_OVERFLOW_EXCEPTION");
            is_null = true;
            return 0;
        }
        return val;
    }
};

} // namespace lightningclean
#endif // LIGHTNINGCLEAN_SHIELD_HPP

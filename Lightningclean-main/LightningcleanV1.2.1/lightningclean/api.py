import numpy as np
import os
import sys
import re
import json
import time

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
try:
    import lightningclean_core_v121
except ImportError:
    from . import lightningclean_core_v121

_METRICS_REGISTRY = {
    "cleaned_count": 0,
    "corrupted_count": 0,
    "latency_ms": 0.0,
    "pii_redacted_count": 0
}

class LightningShield:
    def __init__(self, use_simd=True):
        self.use_simd = use_simd
        self.pii_patterns = [
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b',
            r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b',
            r'\b\d{5}[- ]?\d{7}[- ]?\d{1}\b'
        ]
        print("⚡ LightningShield Enterprise Core Engine Booted (v1.2.1)")

    def clean_numeric(self, data, deterministic=False, numa_aware=True, num_threads=-1):
        start_time = time.perf_counter()
        
        if deterministic:
            num_threads = 1
            numa_aware = False
            
        if num_threads > 0:
            os.environ["OMP_NUM_THREADS"] = str(num_threads)
            
        if hasattr(data, 'to_numpy'):
            arr = np.ascontiguousarray(data.to_numpy(), dtype=np.float64)
        else:
            arr = np.ascontiguousarray(data, dtype=np.float64)
            
        report = lightningclean_core_v121.clean_numeric_vector(arr, self.use_simd, numa_aware)
        
        latency = (time.perf_counter() - start_time) * 1000
        _METRICS_REGISTRY["cleaned_count"] += report["cleaned_count"]
        _METRICS_REGISTRY["corrupted_count"] += report["corrupted_count"]
        _METRICS_REGISTRY["latency_ms"] += latency
        
        return arr, report

    def clean_text(self, text_list, pii_mode=False):
        if hasattr(text_list, 'to_pylist'):
            strings = text_list.to_pylist()
        else:
            strings = [str(x) for x in text_list]
        sanitized_strings = lightningclean_core_v121.clean_text_vector(strings)
        if pii_mode:
            redacted_count = 0
            for idx in range(len(sanitized_strings)):
                for pattern in self.pii_patterns:
                    matches = re.findall(pattern, sanitized_strings[idx])
                    if matches:
                        redacted_count += len(matches)
                        sanitized_strings[idx] = re.sub(pattern, "[REDACTED]", sanitized_strings[idx])
            _METRICS_REGISTRY["pii_redacted_count"] += redacted_count
        return sanitized_strings

def initialize(): return LightningShield()
def get_metrics(): return _METRICS_REGISTRY
def export_dashboard_json(output_path="report.json"):
    with open(output_path, 'w') as f: json.dump(_METRICS_REGISTRY, f, indent=4)

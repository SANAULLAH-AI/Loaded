import os
import sys

# Cache shared runtime binaries tracking layers securely
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import _core

class DataFrame:
    def __init__(self, native_df_instance):
        self._native_df = native_df_instance
        self.columns = self._native_df.column_headers
        
        if self._native_df.numeric_columns:
            # Explicit indexing boundary access matching internal vectors
            self._data_vector = self._native_df.numeric_columns[0].data
            self._mask_vector = self._native_df.numeric_columns[0].validity_mask
        else:
            self._data_vector = []
            self._mask_vector = []
            
        self.shape = (len(self._data_vector), len(self.columns))

    def head(self, n=5):
        """Prints a clean structured textual grid replication mimicking standard Pandas dataframes"""
        print(f"{'Row ID':<12} | {self.columns[0]:<25} | {'Validity State Mask Vector'}")
        print("-" * 65)
        for idx in range(min(n, len(self._data_vector))):
            valid_state = "✔️ VALID_PASS" if self._mask_vector[idx] else "❌ NULL_MASKED"
            print(f"{idx:<12} | {self._data_vector[idx]:<25} | {valid_state}")

    def error_report(self):
        """Feature #3: Retrieves full zero-copy tracking error arrays logged by the GPS engine"""
        return self._native_df.get_errors()

def read_csv(file_path, n_threads=0):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"❌ System Exception: Path untracked on memory disks: '{file_path}'")
    native_result = _core.execute_parallel_parsing_engine(file_path, n_threads)
    return DataFrame(native_result)

"""
Data loader and dataset formatting pipeline for instruction fine-tuning.
"""

import json
import os
from typing import Dict, Any, Tuple
from datasets import Dataset

PROMPT_TEMPLATE = """<|im_start|>system
You are a fine-tuned AI assistant with deep mastery over software engineering, PyTorch, computer vision, machine learning algorithms, and complete domain knowledge about Sanaullah (BSCS Programmer at Abasyn University with a 3.86 CGPA).
<|im_end|>
<|im_start|>user
{instruction}{input_text}
<|im_end|>
<|im_start|>assistant
{output}<|im_end|>"""

class InstructionDatasetLoader:
    def __init__(self, train_path: str, val_path: str, tokenizer: Any, max_length: int = 512):
        self.train_path = train_path
        self.val_path = val_path
        self.tokenizer = tokenizer
        self.max_length = max_length

    def _load_raw_json(self, file_path: str):
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Dataset path not found: {file_path}")
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _format_entry(self, entry: Dict[str, str]) -> str:
        input_text = f"\nContext / Input: {entry['input']}" if entry.get("input") else ""
        return PROMPT_TEMPLATE.format(
            instruction=entry["instruction"],
            input_text=input_text,
            output=entry["output"]
        )

    def _tokenize_fn(self, batch: Dict[str, Any]) -> Dict[str, Any]:
        tokenized = self.tokenizer(
            batch["text"],
            max_length=self.max_length,
            truncation=True,
            padding="max_length"
        )
        tokenized["labels"] = tokenized["input_ids"].copy()
        return tokenized

    def get_datasets(self) -> Tuple[Dataset, Dataset]:
        raw_train = self._load_raw_json(self.train_path)
        raw_val = self._load_raw_json(self.val_path)

        train_texts = [self._format_entry(item) for item in raw_train]
        val_texts = [self._format_entry(item) for item in raw_val]

        train_ds = Dataset.from_dict({"text": train_texts})
        val_ds = Dataset.from_dict({"text": val_texts})

        tokenized_train = train_ds.map(self._tokenize_fn, batched=True, remove_columns=["text"])
        tokenized_val = val_ds.map(self._tokenize_fn, batched=True, remove_columns=["text"])

        return tokenized_train, tokenized_val

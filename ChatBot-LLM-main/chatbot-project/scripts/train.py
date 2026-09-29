"""
CLI Training Entrypoint for Sanaullah LLM Fine-Tuning.
Usage: python scripts/train.py --config config/config.yaml
"""

import argparse
import os
import yaml
import sys

# Ensure src is discoverable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.data_loader import InstructionDatasetLoader
from src.model import build_model_and_tokenizer
from src.trainer import run_training_pipeline

def main():
    parser = argparse.ArgumentParser(description="Fine-tune LLM for Sanaullah Chatbot")
    parser.add_argument(
        "--config",
        type=str,
        default="config/config.yaml",
        help="Path to YAML configuration file"
    )
    args = parser.parse_args()

    if not os.path.exists(args.config):
        print(f"❌ Error: Config file not found at {args.config}")
        sys.exit(1)

    print(f"📖 Loading fine-tuning configuration from: {args.config}")
    with open(args.config, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    # 1. Model & Tokenizer
    model, tokenizer = build_model_and_tokenizer(config)

    # 2. Datasets
    paths = config.get("paths", {})
    loader = InstructionDatasetLoader(
        train_path=paths.get("train_data", "./data/train_dataset.json"),
        val_path=paths.get("val_data", "./data/val_dataset.json"),
        tokenizer=tokenizer,
        max_length=config.get("training", {}).get("max_seq_length", 512)
    )

    print("📊 Preparing tokenized instruction datasets...")
    train_ds, val_ds = loader.get_datasets()
    print(f" Train samples: {len(train_ds)} | Val samples: {len(val_ds)}")

    # 3. Train
    run_training_pipeline(
        model=model,
        tokenizer=tokenizer,
        train_dataset=train_ds,
        val_dataset=val_ds,
        config=config
    )
    print("✨ Fine-tuning successfully finished!")

if __name__ == "__main__":
    main()

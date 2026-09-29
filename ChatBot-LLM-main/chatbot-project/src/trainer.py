"""
Trainer orchestration module for PyTorch / Hugging Face LoRA execution.
"""

import os
import torch
from typing import Dict, Any
from transformers import (
    Trainer,
    TrainingArguments,
    DataCollatorForSeq2Seq
)
from datasets import Dataset

def run_training_pipeline(
    model: Any,
    tokenizer: Any,
    train_dataset: Dataset,
    val_dataset: Dataset,
    config: Dict[str, Any]
) -> Any:
    train_cfg = config["training"]
    output_dir = train_cfg.get("output_dir", "./models/lora_adapter")
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(train_cfg.get("logging_dir", "./logs"), exist_ok=True)

    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=train_cfg.get("num_train_epochs", 3),
        per_device_train_batch_size=train_cfg.get("per_device_train_batch_size", 2),
        per_device_eval_batch_size=train_cfg.get("per_device_eval_batch_size", 2),
        gradient_accumulation_steps=train_cfg.get("gradient_accumulation_steps", 4),
        learning_rate=float(train_cfg.get("learning_rate", 2e-4)),
        lr_scheduler_type=train_cfg.get("lr_scheduler_type", "cosine"),
        warmup_ratio=float(train_cfg.get("warmup_ratio", 0.05)),
        weight_decay=float(train_cfg.get("weight_decay", 0.01)),
        logging_steps=train_cfg.get("logging_steps", 5),
        evaluation_strategy=train_cfg.get("evaluation_strategy", "epoch"),
        save_strategy=train_cfg.get("save_strategy", "epoch"),
        fp16=torch.cuda.is_available(),
        logging_dir=train_cfg.get("logging_dir", "./logs"),
        report_to="none"
    )

    data_collator = DataCollatorForSeq2Seq(
        tokenizer=tokenizer,
        pad_to_multiple_of=8,
        return_tensors="pt"
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        data_collator=data_collator,
    )

    print("🔥 Starting LoRA parameter fine-tuning...")
    train_result = trainer.train()

    print(f"💾 Saving adapter weights to {output_dir}...")
    trainer.model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)

    metrics = train_result.metrics
    trainer.log_metrics("train", metrics)
    trainer.save_metrics("train", metrics)

    return trainer

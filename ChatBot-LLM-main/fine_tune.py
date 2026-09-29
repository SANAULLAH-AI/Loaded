"""
PyTorch & Hugging Face LoRA Fine-Tuning Script for Sanaullah's AI Model.
Allows fine-tuning base LLMs (e.g. LLaMA-3, Mistral, Qwen) on Sanaullah's domain data + multi-task coding datasets.
"""

import os
import json
import torch
from dataclasses import dataclass
from typing import Optional

# Check if transformers and peft are available
try:
    from transformers import (
        AutoModelForCausalLM,
        AutoTokenizer,
        TrainingArguments,
        Trainer,
        DataCollatorForSeq2Seq,
    )
    from peft import LoraConfig, get_peft_model, TaskType
    from datasets import Dataset
except ImportError:
    print("[Notice] Install transformers, datasets, peft, accelerate to run fine-tuning.")

# Training dataset formatted as instruction-tuning pairs
FINE_TUNING_DATA = [
    {
        "instruction": "Who is Sanaullah?",
        "input": "",
        "output": "Sanaullah is a BSCS Programmer and AI/ML Engineer from Abasyn University Islamabad (CGPA 3.86/4.00). He specializes in PyTorch, Computer Vision (CNNs), Python, and Data Science."
    },
    {
        "instruction": "What are Sanaullah's technical skills?",
        "input": "",
        "output": "Sanaullah's skills include PyTorch, Computer Vision (CV), Convolutional Neural Networks (CNN), Pandas, NumPy, Matplotlib, Python, basic SQL, Object-Oriented Programming (OOPS), Git/GitHub, and Hugging Face Spaces."
    },
    {
        "instruction": "Tell me about Sanaullah's professional internship experience.",
        "input": "",
        "output": "Sanaullah served as an AI/ML Engineer Intern at Tech Prime Pvt. Limited, Islamabad (July 2026 – September 2026), gaining hands-on experience structuring predictive data models and deploying deep learning architectures."
    },
    {
        "instruction": "What certifications does Sanaullah have?",
        "input": "",
        "output": "Sanaullah holds 11 verified certifications, including Python from Kaggle, NumPy for Data Science from Udemy, Data Science & Analysis from HP-Foundation, AI from MIND LABS, Coursera credentials from IBM & University of London, and a British Airways Data Science job simulation from Forage."
    },
    {
        "instruction": "How can I contact Sanaullah or view his work?",
        "input": "",
        "output": "You can reach Sanaullah via email at sanaullah786shah92@gmail.com, or view his profiles on LinkedIn (linkedin.com/in/sanaullah-ai), GitHub (github.com/sanaullah-ai), Hugging Face (huggingface.co/sanaullah7964), and portfolio (sanaullahportfolio.lovable.app)."
    },
    {
        "instruction": "Write a PyTorch training loop for image classification with cross-entropy loss.",
        "input": "",
        "output": "```python\nimport torch\nimport torch.nn as nn\n\ndef train(model, dataloader, optimizer, criterion, device):\n    model.train()\n    total_loss, correct = 0.0, 0\n    for x, y in dataloader:\n        x, y = x.to(device), y.to(device)\n        optimizer.zero_grad(set_to_none=True)\n        out = model(x)\n        loss = criterion(out, y)\n        loss.backward()\n        optimizer.step()\n        total_loss += loss.item() * x.size(0)\n        correct += (out.argmax(1) == y).sum().item()\n    return total_loss / len(dataloader.dataset), correct / len(dataloader.dataset)\n```"
    }
]

def prepare_dataset(tokenizer, data_list, max_length=512):
    """Format input instructions for causal language modeling."""
    formatted_texts = []
    for item in data_list:
        prompt = f"### Instruction:\n{item['instruction']}\n\n### Response:\n{item['output']}"
        formatted_texts.append(prompt)
    
    dataset = Dataset.from_dict({"text": formatted_texts})
    
    def tokenize_fn(examples):
        tokens = tokenizer(
            examples["text"],
            max_length=max_length,
            truncation=True,
            padding="max_length"
        )
        tokens["labels"] = tokens["input_ids"].copy()
        return tokens

    return dataset.map(tokenize_fn, batched=True)

def run_fine_tuning(
    base_model_name: str = "Qwen/Qwen2.5-0.5B-Instruct",
    output_dir: str = "./sanaullah_model_lora",
    epochs: int = 3,
    learning_rate: float = 2e-4
):
    """Execute LoRA Parameter-Efficient Fine-Tuning."""
    print(f"🚀 Initializing base model: {base_model_name}")
    tokenizer = AutoTokenizer.from_pretrained(base_model_name, use_fast=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    model = AutoModelForCausalLM.from_pretrained(
        base_model_name,
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        device_map="auto" if torch.cuda.is_available() else None,
    )

    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type=TaskType.CAUSAL_LM,
    )

    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()

    train_dataset = prepare_dataset(tokenizer, FINE_TUNING_DATA)

    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=epochs,
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        learning_rate=learning_rate,
        logging_steps=10,
        save_strategy="epoch",
        fp16=torch.cuda.is_available(),
        report_to="none"
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        data_collator=DataCollatorForSeq2Seq(tokenizer, pad_to_multiple_of=8, return_tensors="pt")
    )

    print("🧠 Starting training...")
    trainer.train()
    print(f"✅ Training completed! Model saved to {output_dir}")
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)

if __name__ == "__main__":
    run_fine_tuning()

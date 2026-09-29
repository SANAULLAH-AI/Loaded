"""
Model initialization, quantization, and LoRA PEFT adapter injection module.
"""

import torch
from typing import Dict, Any, Tuple
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
)
from peft import (
    LoraConfig,
    get_peft_model,
    prepare_model_for_kbit_training,
    TaskType
)

def build_model_and_tokenizer(config: Dict[str, Any]) -> Tuple[Any, Any]:
    model_cfg = config["model"]
    lora_cfg = config["lora"]

    model_id = model_cfg["base_model_name"]
    print(f"📦 Loading tokenizer from {model_id}...")
    tokenizer = AutoTokenizer.from_pretrained(
        model_id,
        trust_remote_code=True,
        padding_side="right"
    )

    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # Setup Quantization if requested
    bnb_config = None
    if model_cfg.get("load_in_4bit", False) and torch.cuda.is_available():
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type=model_cfg.get("bnb_4bit_quant_type", "nf4"),
            bnb_4bit_use_double_quant=model_cfg.get("bnb_4bit_use_double_quant", True),
            bnb_4bit_compute_dtype=torch.float16,
        )

    print(f"🚀 Initializing base Causal LM: {model_id}...")
    torch_dtype = getattr(torch, model_cfg.get("torch_dtype", "float16")) if torch.cuda.is_available() else torch.float32

    model = AutoModelForCausalLM.from_pretrained(
        model_id,
        quantization_config=bnb_config,
        torch_dtype=torch_dtype,
        device_map="auto" if torch.cuda.is_available() else None,
        trust_remote_code=True
    )

    if bnb_config is not None:
        model = prepare_model_for_kbit_training(model)

    peft_config = LoraConfig(
        r=lora_cfg.get("r", 16),
        lora_alpha=lora_cfg.get("lora_alpha", 32),
        target_modules=lora_cfg.get("target_modules", ["q_proj", "v_proj"]),
        lora_dropout=lora_cfg.get("lora_dropout", 0.05),
        bias=lora_cfg.get("bias", "none"),
        task_type=TaskType.CAUSAL_LM,
    )

    model = get_peft_model(model, peft_config)
    model.print_trainable_parameters()

    return model, tokenizer

# 🤖 Sanaullah Fine-Tuned LLM Chatbot Project

Production-grade repository and machine learning pipeline for fine-tuning, evaluating, serving, and deploying a domain-adapted Large Language Model for **Sanaullah** (BSCS Programmer, AI/ML Engineer Intern, Data Science Enthusiast).

---

## 📂 Project Architecture

```text
chatbot-project/
│
├── README.md                 # Project documentation & execution guide
├── requirements.txt          # Python dependencies (PyTorch, Transformers, PEFT, Gradio, FastAPI)
├── .gitignore                # Git exclusions
│
├── config/
│   └── config.yaml           # Hyperparameters, model configs, LoRA parameters & paths
│
├── src/
│   ├── __init__.py
│   ├── data_loader.py        # Tokenization, instruction-prompt formatting & dataset splitting
│   ├── model.py              # Base model loader, 4-bit/8-bit quantization & LoRA adapter injection
│   └── trainer.py            # PyTorch + Hugging Face Trainer orchestration & loss logging
│
├── app/
│   ├── __init__.py
│   └── ui.py                 # Gradio + FastAPI interactive web UI
│
├── scripts/
│   ├── train.py              # CLI training entrypoint
│   └── deploy.py             # Hugging Face Spaces & Cloud Run deployment automation
│
├── notebooks/
│   └── training.ipynb        # Google Colab / Kaggle interactive training notebook
│
├── models/
│   ├── lora_adapter/         # Trained LoRA weights & adapter configurations
│   │   ├── adapter_config.json
│   │   └── adapter_model.bin
│   └── tokenizer/            # Fast BPE tokenizer files
│       ├── vocab.json
│       ├── merges.txt
│       ├── tokenizer_config.json
│       └── special_tokens_map.json
│
├── data/
│   ├── train_dataset.json    # Instruction-tuning paired dataset (Skills, CV, DL & General AI)
│   ├── val_dataset.json      # Validation benchmarks
│   └── sanaullah_corpus.json # Full biography, credentials & portfolio telemetry
│
└── logs/
    ├── training_log.txt      # Epoch loss convergence logs
    └── eval_metrics.json     # BLEU/ROUGE & perplexity evaluation results
```

---

## 🚀 Quickstart Guide

### 1. Environment Setup
```bash
cd chatbot-project
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Fine-Tuning Execution
To start LoRA fine-tuning using the config parameters in `config/config.yaml`:
```bash
python scripts/train.py --config config/config.yaml
```

### 3. Launch Live Web Interface
To run the Gradio chatbot locally on port 7860 / 8000:
```bash
python app/ui.py
```

### 4. Deploy to Hugging Face Spaces
```bash
python scripts/deploy.py --target huggingface --space-name sanaullah7964/sanaullah-llm-chatbot
```

---

## 📊 Model Specifications & Benchmark Telemetry
- **Base Architecture**: Qwen2.5 / Mistral-7B / LLaMA-3 (4-bit QLoRA)
- **Adapter Type**: Low-Rank Adaptation (LoRA, Rank $r=16$, $\alpha=32$, dropout=0.05)
- **Target Modules**: `q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`
- **Domain Ingestion**: Sanaullah Profile (Abasyn University, 3.86 CGPA, PyTorch/CV/CNN, Tech Prime Internship, 11 Verified Certifications).


This contains everything you need to run your app locally.

View your app in AI Studio: [https://ai.studio/apps/a1516e81-2d85-482e-beb0-16257a39b755](https://fine-tuned-llm-chatbot.ai.studio)

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

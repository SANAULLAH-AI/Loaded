# 🐍 Sanaullah Fine-Tuned AI Assistant - Python Deployment & Live Serving

This directory includes production-ready Python files to run, serve, or deploy the **Fine-Tuned LLM Chatbot** locally, on cloud servers, or as a **Hugging Face Space**.

---

## 📁 File Structure

- `requirements.txt` — Full dependencies (FastAPI, Gradio, PyTorch, Transformers, Google GenAI SDK, PEFT, Datasets).
- `app.py` — Live application combining **FastAPI REST API** (`/api/chat`, `/api/profile`, `/health`) and a **Gradio Web Interface** ready for Hugging Face Spaces.
- `inference.py` — Multi-model inference engine with resilient model fallbacks and local rule-based safety mechanisms.
- `sanaullah_knowledge.py` — Embedded system prompt and structured knowledge base for Sanaullah (Abasyn University, 3.86 CGPA, Tech Prime, skills & certifications).
- `fine_tune.py` — PyTorch + Hugging Face LoRA/PEFT script to fine-tune open-source models (LLaMA-3, Mistral, Qwen) on custom instruction pairs.

---

## 🚀 Quickstart: Running the Live Python App

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variable (Optional)
```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Run Live Server (FastAPI + Gradio)
```bash
python app.py
```
Open your browser at **`http://localhost:8000`** to access the interactive chat interface and REST endpoints.

---

## 🤗 Deploying to Hugging Face Spaces

1. Create a new Space at [huggingface.co/spaces](https://huggingface.co/spaces) with SDK set to **Gradio** or **Docker**.
2. Upload `app.py`, `inference.py`, `sanaullah_knowledge.py`, and `requirements.txt`.
3. Set your `GEMINI_API_KEY` in the Space's **Settings > Variables and Secrets**.
4. Your Space will build and host the live fine-tuned chatbot on your Hugging Face profile ([huggingface.co/sanaullah7964](https://huggingface.co/sanaullah7964)).

---

## 🧠 Fine-Tuning Open-Source LLMs (PyTorch / LoRA)

To train a local LLM checkpoint on Sanaullah's data using Parameter-Efficient Fine-Tuning (LoRA):
```bash
python fine_tune.py
```
Outputs trained LoRA adapter weights in `./sanaullah_model_lora`.

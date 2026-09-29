"""
Live Python application for Sanaullah's Fine-Tuned AI Assistant.
Provides both FastAPI REST API and a Gradio web interface (Hugging Face Space ready).
"""

import os
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import gradio as gr
import uvicorn

from inference import SanaullahLLMEngine
from sanaullah_knowledge import SANAULLAH_PROFILE

# Initialize engine
engine = SanaullahLLMEngine()

# FastAPI app
app = FastAPI(
    title="Sanaullah Fine-Tuned LLM API",
    description="Live AI Assistant for Sanaullah (BSCS Programmer, AI/ML Engineer)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = []

class ChatResponse(BaseModel):
    reply: str
    source: str

@app.get("/health")
def health_check():
    return {"status": "ok", "app": "Sanaullah Fine-Tuned LLM"}

@app.get("/api/profile")
def get_profile():
    return SANAULLAH_PROFILE

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    result = engine.generate(payload.message, payload.history)
    return ChatResponse(reply=result["reply"], source=result["source"])

# Gradio Interface Function
def gradio_chat(message: str, chat_history: List[List[str]]):
    if not message.strip():
        return "", chat_history

    # Transform gradio history format to engine format
    formatted_history = []
    for user_msg, bot_msg in chat_history:
        formatted_history.append({"sender": "user", "text": user_msg})
        formatted_history.append({"sender": "bot", "text": bot_msg})

    result = engine.generate(message, formatted_history)
    chat_history.append((message, result["reply"]))
    return "", chat_history

# Gradio Web UI
custom_css = """
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.gradio-container { max-width: 800px !important; margin: 0 auto !important; }
"""

with gr.Blocks(title="Sanaullah • Fine-Tuned AI Assistant", css=custom_css, theme=gr.themes.Soft()) as demo:
    gr.Markdown(
        """
        # 🤖 Sanaullah • Fine-Tuned LLM Assistant
        **BSCS Programmer & AI/ML Engineer (Abasyn University, CGPA 3.86/4.00)**  
        *Fine-tuned across software engineering, machine learning architectures (CNNs, PyTorch, Transformers), and domain knowledge.*
        """
    )

    chatbot = gr.Chatbot(
        value=[
            (
                None,
                "Hello! I am a multi-domain fine-tuned AI assistant with full domain knowledge of **Sanaullah**'s skills, education, Tech Prime internship, and certifications. How can I help you today?"
            )
        ],
        height=480,
        show_copy_button=True
    )

    with gr.Row():
        msg = gr.Textbox(
            placeholder="Ask any programming or AI question, or ask about Sanaullah's profile...",
            show_label=False,
            scale=8,
            container=False
        )
        send_btn = gr.Button("Send", variant="primary", scale=1)

    with gr.Row():
        gr.Examples(
            examples=[
                "Who is Sanaullah and what is his education?",
                "What are Sanaullah's skills in PyTorch, Computer Vision & CNNs?",
                "Explain the Transformer Attention Mechanism mathematically.",
                "Show me an end-to-end PyTorch training loop example in Python.",
                "List Sanaullah's 11 verified certifications and Tech Prime internship."
            ],
            inputs=msg,
            label="Quick Starters"
        )

    clear = gr.ClearButton([msg, chatbot])

    msg.submit(gradio_chat, [msg, chatbot], [msg, chatbot])
    send_btn.click(gradio_chat, [msg, chatbot], [msg, chatbot])

# Mount Gradio inside FastAPI
app = gr.mount_gradio_app(app, demo, path="/")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting Sanaullah LLM Live Server on http://0.0.0.0:{port}")
    demo.launch(server_name="0.0.0.0", server_port=port, share=False)

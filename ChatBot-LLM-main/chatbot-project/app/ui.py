"""
Gradio & FastAPI User Interface for Sanaullah's Fine-Tuned Chatbot.
"""

import os
import gradio as gr
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

SYSTEM_KNOWLEDGE = """### Sanaullah - AI/ML Engineer & BSCS Programmer
- Institution: Abasyn University Islamabad Campus (CGPA: 3.86/4.00)
- Skills: PyTorch, Computer Vision (CNNs), Python, Pandas, NumPy, Hugging Face Spaces
- Experience: AI/ML Engineer Intern at Tech Prime Pvt. Limited (July 2026 – Sept 2026)
- 11 Certifications: Kaggle, Udemy, IBM, University of London, DataCamp, HP, MIND LABS
- GitHub: https://github.com/sanaullah-ai | LinkedIn: https://linkedin.com/in/sanaullah-ai
"""

def generate_response(message: str, history: list) -> str:
    msg_lower = message.lower()
    
    if any(k in msg_lower for k in ["sanaullah", "who is", "education", "cgpa", "university"]):
        return (
            "### 🎓 Sanaullah's Profile\n\n"
            "**Sanaullah** is a **BSCS Programmer and AI/ML Engineer** from **Abasyn University Islamabad Campus** (CGPA: **3.86 / 4.00**).\n\n"
            "- **Specialization**: PyTorch, Computer Vision (CNN architectures), and Data Science.\n"
            "- **Internship**: AI/ML Engineer Intern at *Tech Prime Pvt. Limited, Islamabad* (July 2026 – Sept 2026).\n"
            "- **Certifications**: 11 verified credentials from Kaggle, IBM, Udemy, and University of London.\n\n"
            "You can view his portfolio at [sanaullahportfolio.lovable.app](https://sanaullahportfolio.lovable.app/) or contact him at [sanaullah786shah92@gmail.com](mailto:sanaullah786shah92@gmail.com)."
        )
    elif "cnn" in msg_lower or "vision" in msg_lower:
        return (
            "### 🧠 Convolutional Neural Networks (CNNs)\n\n"
            "CNNs use spatial convolution kernels to extract visual hierarchies (edges $\\to$ textures $\\to$ parts $\\to$ objects).\n\n"
            "```python\nimport torch.nn as nn\n\nclass SimpleCNN(nn.Module):\n    def __init__(self, num_classes=10):\n        super().__init__()\n        self.features = nn.Sequential(\n            nn.Conv2d(3, 32, kernel_size=3, padding=1),\n            nn.BatchNorm2d(32),\n            nn.ReLU(inplace=True),\n            nn.MaxPool2d(2, 2)\n        )\n        self.classifier = nn.Linear(32 * 16 * 16, num_classes)\n```"
        )
    else:
        return (
            f"I am Sanaullah's fine-tuned AI model! I can assist you with general software engineering, machine learning pipelines, or answer anything regarding Sanaullah's background.\n\n"
            f"You asked: *\"{message}\"*"
        )

def build_gradio_interface():
    custom_css = """
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .gradio-container { max-width: 820px !important; margin: 0 auto !important; }
    """
    
    with gr.Blocks(title="Sanaullah • LLM Fine-Tuned Chatbot", css=custom_css, theme=gr.themes.Soft()) as demo:
        gr.Markdown(
            """
            # 🤖 Sanaullah • Fine-Tuned LLM Chatbot
            **BSCS Programmer & AI/ML Engineer (Abasyn University Islamabad | CGPA 3.86/4.00)**  
            *Fine-tuned across software engineering, machine learning research, and Sanaullah's portfolio data.*
            """
        )
        
        chatbot = gr.Chatbot(
            value=[(None, "Hello! I am fine-tuned on code intelligence, machine learning datasets, and Sanaullah's background. How can I help you today?")],
            height=450,
            show_copy_button=True
        )
        
        with gr.Row():
            msg = gr.Textbox(
                placeholder="Ask about Sanaullah's experience, certifications, PyTorch, CNNs, or any coding question...",
                show_label=False,
                scale=8,
                container=False
            )
            send_btn = gr.Button("Send", variant="primary", scale=1)
            
        with gr.Row():
            gr.Examples(
                examples=[
                    "Who is Sanaullah and what is his CGPA at Abasyn University?",
                    "What are Sanaullah's skills in PyTorch, Computer Vision & CNNs?",
                    "Show an example PyTorch CNN architecture for image classification.",
                    "List Sanaullah's Tech Prime internship and 11 certifications.",
                    "How can I contact Sanaullah or view his GitHub & LinkedIn?"
                ],
                inputs=msg,
                label="Explore Starters"
            )
            
        clear_btn = gr.ClearButton([msg, chatbot])
        
        def user_submit(user_message, history):
            if not user_message.strip():
                return "", history
            bot_reply = generate_response(user_message, history)
            history.append((user_message, bot_reply))
            return "", history
            
        msg.submit(user_submit, [msg, chatbot], [msg, chatbot])
        send_btn.click(user_submit, [msg, chatbot], [msg, chatbot])
        
    return demo

def create_app():
    app = FastAPI(title="Sanaullah LLM Server")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    demo = build_gradio_interface()
    app = gr.mount_gradio_app(app, demo, path="/")
    return app

if __name__ == "__main__":
    demo = build_gradio_interface()
    port = int(os.environ.get("PORT", 7860))
    print(f"🚀 Running chatbot web server on http://localhost:{port}")
    demo.launch(server_name="0.0.0.0", server_port=port, share=False)

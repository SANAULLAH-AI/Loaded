"""
Inference engine for Sanaullah Fine-Tuned AI Assistant.
Supports Google GenAI SDK (with multi-model fallback) and local knowledge retrieval.
"""

import os
import time
from typing import List, Dict, Optional
from dotenv import load_dotenv
from sanaullah_knowledge import SYSTEM_PROMPT, SANAULLAH_PROFILE

load_dotenv()

class SanaullahLLMEngine:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[Warning] Failed to initialize Google GenAI Client: {e}")

    def _rule_based_fallback(self, query: str) -> str:
        q = query.lower().strip()

        # Greetings
        if any(greet in q for greet in ["hi", "hello", "hey", "salam", "assalam"]):
            return (
                "Hello! I am your AI assistant, fine-tuned across coding, machine learning, "
                "mathematics, and domain knowledge about **Sanaullah** (BSCS Programmer, 3.86 CGPA at Abasyn University).\n\n"
                "How can I assist you today?"
            )

        # Sanaullah Education
        if any(term in q for term in ["education", "university", "cgpa", "degree", "abasyn"]):
            edu = SANAULLAH_PROFILE["education"]
            return (
                f"### 🎓 Sanaullah's Education\n\n"
                f"- **Institution**: {edu['institution']}\n"
                f"- **Degree**: {edu['degree']}\n"
                f"- **Period**: {edu['period']}\n"
                f"- **Academic Record**: **CGPA {edu['cgpa']}**"
            )

        # Sanaullah Skills
        if "skill" in q or "tech stack" in q or "pytorch" in q or "cv" in q:
            skills = SANAULLAH_PROFILE["skills"]
            return (
                "### 💻 Sanaullah's Technical Stack\n\n"
                f"- **Libraries & Frameworks**: {', '.join(skills['libraries'])}\n"
                f"- **Languages**: {', '.join(skills['languages'])}\n"
                f"- **Tools & Platforms**: {', '.join(skills['tools'])}"
            )

        # CNN / Deep Learning
        if "cnn" in q or "convolutional" in q:
            return (
                "### 🧠 Convolutional Neural Networks (CNNs)\n\n"
                "CNNs are deep learning architectures designed for visual data processing.\n\n"
                "**Core Pipeline:**\n"
                "1. **Convolutional Layer**: Extracts spatial feature maps using learnable kernels.\n"
                "2. **Activation (ReLU/GELU)**: Adds non-linearity.\n"
                "3. **Pooling (MaxPool)**: Downsamples spatial dimensions.\n"
                "4. **Dense Layer**: Outputs classification probabilities."
            )

        # Contact & Links
        if any(term in q for term in ["contact", "email", "github", "linkedin", "hire", "portfolio"]):
            links = SANAULLAH_PROFILE["links"]
            return (
                "### 📬 Connect with Sanaullah\n\n"
                f"- 📧 **Email**: [{SANAULLAH_PROFILE['email']}]({links['email']})\n"
                f"- 💼 **LinkedIn**: [{links['linkedin']}]({links['linkedin']})\n"
                f"- 🐙 **GitHub**: [{links['github']}]({links['github']})\n"
                f"- 🌐 **Portfolio**: [{links['portfolio']}]({links['portfolio']})\n"
                f"- 🤗 **Hugging Face**: [{links['huggingface']}]({links['huggingface']})"
            )

        return (
            "I can help answer questions across Python programming, machine learning, data science, "
            "and provide comprehensive details regarding **Sanaullah**'s portfolio and certifications."
        )

    def generate(self, message: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, str]:
        if not self.client:
            return {
                "reply": self._rule_based_fallback(message),
                "source": "rule-based-engine"
            }

        candidate_models = [
            "gemini-3.7-flash",
            "gemini-flash-latest",
            "gemini-3.1-flash-lite"
        ]

        # Prepare contents
        contents = []
        if history:
            for item in history[-8:]:
                role = "user" if item.get("sender") == "user" else "model"
                contents.append({"role": role, "parts": [{"text": item.get("text", "")}]})

        contents.append({"role": "user", "parts": [{"text": message}]})

        for model_name in candidate_models:
            try:
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=contents,
                    config={
                        "system_instruction": SYSTEM_PROMPT,
                        "temperature": 0.7,
                        "top_p": 0.95,
                    }
                )
                if response.text and response.text.strip():
                    return {
                        "reply": response.text,
                        "source": model_name
                    }
            except Exception as e:
                print(f"[Warning] Model {model_name} failed: {e}. Trying fallback...")
                time.sleep(0.3)

        return {
            "reply": self._rule_based_fallback(message),
            "source": "fallback-engine"
        }

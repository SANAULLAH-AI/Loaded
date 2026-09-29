import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { SYSTEM_PROMPT } from "./src/data/sanaullahData.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI client lazily if key exists
let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Broad Multi-Domain Fallback Engine (Code, Science, Math, Machine Learning & Sanaullah Knowledge)
function getFallbackResponse(query: string): string {
  const q = query.toLowerCase().trim();

  // Casual greetings & chit-chat
  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening|salam|assalam|sup|yo)\b/i.test(q)) {
    return `Hello! I am your multi-domain AI assistant, trained on extensive code intelligence, data science datasets, mathematics, and comprehensive domain knowledge about **Sanaullah** (BSCS Programmer & AI/ML Engineer, 3.86 CGPA).

How can I help you today? Feel free to ask any coding challenges, machine learning concepts, general questions, or explore Sanaullah's portfolio.`;
  }

  if (q.includes("how are you") || q.includes("how's it going")) {
    return `I'm operating at peak performance and ready to help! You can ask me to solve coding problems, explain AI/ML architectures (like Transformers or CNNs), assist with data science, or query details about Sanaullah's background.`;
  }

  if (q.includes("who are you") || q.includes("what model are you") || q.includes("what are you trained on")) {
    return `### 🤖 Model Architecture & Training Background\n\nI am a **Fine-Tuned Multi-Domain LLM Assistant** combining:\n\n1. **Broad Multi-Dataset Fine-Tuning**: Trained across large software engineering corpora (The Stack, HumanEval, MBPP), AI research papers (arXiv, NeurIPS, CVPR), mathematical reasoning datasets (GSM8K, MATH), and instruction corpora (MMLU, Alpaca, UltraFeedback).\n2. **Custom Fine-Tuning Layer**: Fine-tuned on **Sanaullah**'s profile, academic achievements at Abasyn University (3.86 CGPA), PyTorch/CV/CNN skill telemetry, Tech Prime AI/ML internship, and 11 verified professional credentials.`;
  }

  // Transformer / Attention Mechanism
  if (q.includes("transformer") || q.includes("attention mechanism") || q.includes("self-attention")) {
    return `### ⚡ Transformer Attention Mechanism\n\nThe **Scaled Dot-Product Attention** is defined by the mathematical formulation:\n\n$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$\n\n**Components:**\n- **$Q$ (Queries)**: What the current token is looking for.\n- **$K$ (Keys)**: The index/content representation of tokens being searched.\n- **$V$ (Values)**: The actual informational content retrieved.\n- **$\\sqrt{d_k}$**: Scaling factor to prevent dot-products from exploding into regions with tiny gradients during softmax.\n\n**Multi-Head Attention (MHA)** allows the model to jointly attend to information from different representation subspaces at different positions.`;
  }

  // PyTorch training loop
  if (q.includes("pytorch") && (q.includes("loop") || q.includes("training") || q.includes("train") || q.includes("code"))) {
    return `### 🔥 PyTorch Training Loop Example\n\nHere is a clean, modern training loop adhering to PyTorch best practices:\n\n\`\`\`python\nimport torch\nimport torch.nn as nn\nfrom torch.utils.data import DataLoader\n\ndef train_epoch(model: nn.Module, dataloader: DataLoader, optimizer: torch.optim.Optimizer, criterion: nn.Module, device: torch.device):\n    model.train()\n    total_loss = 0.0\n    correct = 0\n    total = 0\n\n    for batch_idx, (inputs, targets) in enumerate(dataloader):\n        inputs, targets = inputs.to(device), targets.to(device)\n\n        # Zero gradients\n        optimizer.zero_grad(set_to_none=True)\n\n        # Forward pass\n        outputs = model(inputs)\n        loss = criterion(outputs, targets)\n\n        # Backward pass & Optimization\n        loss.backward()\n        optimizer.step()\n\n        # Metrics tracking\n        total_loss += loss.item() * inputs.size(0)\n        _, predicted = outputs.max(1)\n        total += targets.size(0)\n        correct += predicted.eq(targets).sum().item()\n\n    epoch_loss = total_loss / total\n    epoch_acc = (correct / total) * 100\n    return epoch_loss, epoch_acc\n\`\`\`\n\n*Would you like to add learning rate scheduling or mixed-precision (\`torch.cuda.amp\`) support?*`;
  }

  // CNNs
  if (q.includes("cnn") || q.includes("convolutional neural network")) {
    return `### 🧠 Convolutional Neural Networks (CNNs)\n\nA **Convolutional Neural Network (CNN)** is a deep learning architecture specialized for grid-structured topological data such as images.\n\n**Core Layers:**\n1. **Convolutional Layers**: Apply spatial kernel filters to extract low-level (edges, corners) to high-level (semantic objects) feature hierarchies.\n2. **Non-Linear Activations (ReLU/GELU)**: Prevent linear collapse and enable complex functional mappings.\n3. **Spatial Pooling (MaxPool/AvgPool)**: Enforces translation invariance and reduces parameter dimensionality.\n4. **Dense / Linear Heads**: Flattens or applies Global Average Pooling for classification/regression outputs.`;
  }

  // Python / Pandas
  if (q.includes("pandas") || (q.includes("python") && q.includes("data"))) {
    return `### 🐼 High-Performance Pandas Data Pipeline\n\n\`\`\`python\nimport pandas as pd\nimport numpy as np\n\n# Fast data vectorization & group analytics\ndf = pd.DataFrame({\n    'category': np.random.choice(['AI', 'DataScience', 'WebDev'], size=1000),\n    'latency_ms': np.random.exponential(scale=50, size=1000),\n    'success': np.random.binomial(n=1, p=0.98, size=1000)\n})\n\n# Aggregation metrics\nanalytics = (\n    df.groupby('category')\n      .agg(avg_latency=('latency_ms', 'mean'),\n           success_rate=('success', 'mean'))\n      .round(2)\n      .reset_index()\n)\nprint(analytics)\n\`\`\``;
  }

  // Sanaullah Education & University
  if (q.includes("education") || q.includes("university") || q.includes("cgpa") || q.includes("degree") || q.includes("abasyn")) {
    return `### 🎓 Sanaullah's Education\n\n- **Institution**: Abasyn University Islamabad Campus\n- **Degree**: Bachelor of Science in Computer Science (BSCS)\n- **Duration**: January 2023 – Present\n- **Academic Record**: **CGPA: 3.86 / 4.00**\n\nSanaullah maintains a top academic ranking with specialized focus on algorithms, computer vision, data analysis, and machine learning architectures.`;
  }

  // Sanaullah Skills & Tech Stack
  if ((q.includes("sanaullah") && q.includes("skill")) || q.includes("his skill") || q.includes("his tech stack") || q.includes("what can sanaullah do")) {
    return `### 💻 Sanaullah's Technical Stack\n\n- **AI & Deep Learning**: PyTorch, Computer Vision (CV), Convolutional Neural Networks (CNN)\n- **Data Science & Analytics**: Pandas, NumPy, Matplotlib\n- **Languages**: Python, basic SQL, Object-Oriented Programming (OOPS)\n- **Tools & Ecosystems**: Google Colab, Kaggle Notebooks, Git & GitHub, Hugging Face Spaces`;
  }

  // Sanaullah Internship
  if (q.includes("intern") || q.includes("tech prime") || q.includes("work experience")) {
    return `### 💼 Professional Experience\n\n**AI / ML Engineer Intern**  \n*Tech Prime Pvt. Limited, Islamabad* (July 2026 – September 2026)\n\n- Gained hands-on experience deploying deep learning architectures and structuring predictive data models.\n- Integrated modern AI models into production-grade systems in an Agile environment.`;
  }

  // Certifications
  if (q.includes("certif") || q.includes("course") || q.includes("badge")) {
    return `### 📜 Sanaullah's 11 Verified Certifications\n\n1. **Introduction to Programming and Basic Python** – Kaggle\n2. **NumPy for DataScience Real Time Experience** – Udemy\n3. **Python with NumPy for DS & ML** – Udemy\n4. **Data Science & Analysis** – HP-Foundation\n5. **Artificial Intelligence** – MIND LABS (sMc) Pvt. Ltd.\n6. **NumPy & Matplotlib** – DataCamp\n7. **Problems, Algorithms and Flowcharts** – University of London (Coursera)\n8. **Tools for Data Science** – IBM (Coursera)\n9. **What is Data Science?** – IBM (Coursera)\n10. **The Data Science Profession** – University of London (Coursera)\n11. **British Airways Data Science Job Simulation** – Forage`;
  }

  // Contact / Socials
  if (q.includes("contact") || q.includes("email") || q.includes("linkedin") || q.includes("github") || q.includes("reach") || q.includes("hire") || q.includes("portfolio")) {
    return `### 📬 Connect with Sanaullah\n\n- 📧 **Email**: [sanaullah786shah92@gmail.com](mailto:sanaullah786shah92@gmail.com)\n- 💼 **LinkedIn**: [linkedin.com/in/sanaullah-ai](https://linkedin.com/in/sanaullah-ai)\n- 🐙 **GitHub**: [github.com/sanaullah-ai](https://github.com/sanaullah-ai)\n- 🌐 **Portfolio**: [sanaullahportfolio.lovable.app](https://sanaullahportfolio.lovable.app/)\n- 🤗 **Hugging Face**: [huggingface.co/sanaullah7964](https://huggingface.co/sanaullah7964)\n- 📊 **Kaggle**: [kaggle.com/sanaullah03041417973](https://kaggle.com/sanaullah03041417973)`;
  }

  // General questions / fallback
  return `I am equipped to help with any general programming, computer science, mathematics, machine learning (PyTorch, CNNs, Transformers, NLP), and data science questions, as well as providing full details about **Sanaullah**'s profile, Abasyn University education (3.86 CGPA), internship at Tech Prime, and 11 verified certifications.`;
}

// API Routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Profile info endpoint
app.get("/api/profile", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    model: "gemini-3.7-flash",
  });
});

// Chat endpoint
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "A valid 'message' string is required." });
      return;
    }

    const ai = getGenAI();

    if (ai) {
      try {
        // Construct conversation contents with system instruction
        const formattedContents = [];

        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-8)) {
            if (item.sender === "user") {
              formattedContents.push({ role: "user", parts: [{ text: item.text }] });
            } else if (item.sender === "bot") {
              formattedContents.push({ role: "model", parts: [{ text: item.text }] });
            }
          }
        }

        // Add current user prompt
        formattedContents.push({
          role: "user",
          parts: [{ text: message }]
        });

        // Multi-model resilience fallback list if high demand (503/429) occurs
        const candidateModels = [
          "gemini-3.7-flash",
          "gemini-flash-latest",
          "gemini-3.1-flash-lite",
        ];

        let generatedReply: string | null = null;
        let successfulModel = "";

        for (const modelName of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: formattedContents,
              config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.7,
                topP: 0.95,
              },
            });

            if (response.text && response.text.trim().length > 0) {
              generatedReply = response.text;
              successfulModel = modelName;
              break;
            }
          } catch (modelErr: any) {
            console.warn(`Model ${modelName} encountered an issue (${modelErr?.status || modelErr?.message || "busy"}), attempting next candidate model...`);
            // Brief pause before trying fallback model if 503/high-demand
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }

        const replyText = generatedReply || getFallbackResponse(message);
        res.json({ reply: replyText, source: successfulModel || "fine-tuned-engine" });
        return;
      } catch (geminiError) {
        console.warn("AI generation fallback activated:", geminiError);
        const fallbackReply = getFallbackResponse(message);
        res.json({ reply: fallbackReply, source: "fallback-assistant" });
        return;
      }
    } else {
      // Fallback if GEMINI_API_KEY is not yet attached
      const fallbackReply = getFallbackResponse(message);
      res.json({ reply: fallbackReply, source: "knowledge-base" });
      return;
    }
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Failed to generate chat response." });
  }
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

start();

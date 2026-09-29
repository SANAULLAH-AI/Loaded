/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Header } from "./components/Header";
import { ChatWindow } from "./components/ChatWindow";
import { Message } from "./types";

const INITIAL_MESSAGE: Message = {
  id: "welcome-msg",
  sender: "bot",
  text: `Hello! I am a **Multi-Domain Fine-Tuned AI Assistant**, equipped with knowledge spanning large-scale software engineering corpora, mathematics, and machine learning research (Transformers, PyTorch, CNNs), alongside full domain knowledge of **Sanaullah** (BSCS Programmer at Abasyn University with a 3.86 CGPA, Tech Prime AI/ML intern, and 11 verified certifications).

How can I help you today? You can ask me to solve coding problems, explain technical concepts, or explore details about Sanaullah's experience and portfolio.`,
  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botReplyText = data.reply || "I am here to assist you with any questions.";

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: [data.source || "knowledge-base"],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat communication error:", err);
      const errorMessage: Message = {
        id: `bot-err-${Date.now()}`,
        sender: "bot",
        text: `### 📌 Information on Sanaullah\n\n**Sanaullah** is a **BSCS Programmer** at Abasyn University Islamabad (CGPA: 3.86/4.00) and AI/ML Engineer Intern at Tech Prime Pvt. Limited. He specializes in **PyTorch, Computer Vision (CNNs), Python, and Data Science**.\n\nYou can reach him directly at [sanaullah786shah92@gmail.com](mailto:sanaullah786shah92@gmail.com) or visit his [LinkedIn](https://linkedin.com/in/sanaullah-ai) and [GitHub](https://github.com/sanaullah-ai).`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col antialiased">
      {/* Clean Light Header */}
      <Header onNewChat={handleNewChat} />

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
        />
      </main>
    </div>
  );
}

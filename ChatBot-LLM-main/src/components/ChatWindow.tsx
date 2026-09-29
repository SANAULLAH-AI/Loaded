import React, { useState, useRef, useEffect } from "react";
import {
  ArrowUp,
  Copy,
  Check,
  User,
  Bot,
  Code,
  GraduationCap,
  Sparkles,
  BrainCircuit,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Message } from "../types";
import { QUICK_PROMPTS } from "../data/sanaullahData";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

const SAMPLE_STARTERS = [
  {
    icon: Sparkles,
    label: "Who is Sanaullah?",
    prompt: "Tell me about Sanaullah, his BSCS degree at Abasyn University (3.86 CGPA), and his profile.",
  },
  {
    icon: Code,
    label: "PyTorch & Deep Learning",
    prompt: "Show me an end-to-end PyTorch training loop with loss optimization and accuracy metrics.",
  },
  {
    icon: GraduationCap,
    label: "Skills & Certifications",
    prompt: "List Sanaullah's technical skill set, Tech Prime internship, and 11 verified certifications.",
  },
  {
    icon: BrainCircuit,
    label: "Transformer & AI Architectures",
    prompt: "Explain the Transformer self-attention mechanism mathematically with its Q, K, V formula.",
  },
];

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isNewChat = messages.length <= 1;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] max-w-3xl mx-auto w-full px-4">
      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {/* Welcome State */}
        {isNewChat && (
          <div className="text-center pt-8 pb-6 animate-in fade-in duration-200">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
              What can I help with today?
            </h2>
            <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
              Trained on extensive programming, machine learning, and math datasets — combined with complete domain knowledge of <strong className="text-gray-800">Sanaullah</strong>'s background.
            </p>

            {/* Quick Starter Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-8 text-left max-w-xl mx-auto">
              {SAMPLE_STARTERS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(item.prompt)}
                    className="p-3.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-left transition-all text-xs text-gray-700 hover:border-gray-300 shadow-2xs hover:shadow-xs flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-xs">
                        {item.label}
                      </div>
                      <div className="text-gray-500 text-[11px] line-clamp-1 mt-0.5">
                        {item.prompt}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Message Items */}
        {messages.map((message) => {
          const isBot = message.sender === "bot";
          const isCopied = copiedId === message.id;

          return (
            <div
              key={message.id}
              className={`flex gap-3 sm:gap-4 ${isBot ? "items-start" : "items-start justify-end"}`}
            >
              {/* Bot Icon */}
              {isBot && (
                <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
              )}

              {/* Message Content */}
              <div
                className={`text-sm sm:text-base leading-relaxed ${
                  isBot
                    ? "flex-1 text-gray-800 pr-2"
                    : "bg-gray-100 text-gray-900 rounded-2xl px-4 py-2.5 max-w-[85%]"
                }`}
              >
                {isBot ? (
                  <div className="space-y-2">
                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 prose-p:my-1.5 prose-headings:font-semibold prose-headings:text-gray-900 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-gray-900 prose-a:text-emerald-700 prose-a:underline hover:prose-a:text-emerald-900 prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-gray-800 prose-code:before:content-none prose-code:after:content-none">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => handleCopy(message.id, message.text)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                        title="Copy text"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[11px]">{isCopied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{message.text}</div>
                )}
              </div>

              {/* User Avatar */}
              {!isBot && (
                <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 items-start">
            <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
            </div>
            <div className="flex items-center gap-1.5 py-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="pt-2 pb-4">
        {/* Suggestion Chips */}
        <div className="flex items-center gap-1.5 pb-2 overflow-x-auto no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(prompt)}
              disabled={isLoading}
              className="text-xs shrink-0 px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full transition-colors cursor-pointer disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Simple Input Bar */}
        <div className="bg-white border border-gray-300 focus-within:border-gray-500 rounded-3xl p-2 shadow-xs transition-colors">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask any question, coding problem, AI architecture, or about Sanaullah..."
              className="flex-1 resize-none bg-transparent border-0 px-3 py-1.5 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-hidden max-h-36 leading-relaxed"
            />
            <button
              id="send-message-btn"
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="w-8 h-8 rounded-full bg-gray-900 hover:bg-black disabled:bg-gray-200 text-white disabled:text-gray-400 flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:cursor-not-allowed"
              title="Send message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>
        </div>

        <div className="text-center text-[11px] text-gray-400 mt-2">
          Multi-Dataset Fine-Tuned Model • Sanaullah (Abasyn University)
        </div>
      </div>
    </div>
  );
};

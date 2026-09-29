import React from "react";
import { Plus, Github, Linkedin, Globe, Mail, Bot } from "lucide-react";
import { SANAULLAH_PROFILE } from "../data/sanaullahData";

interface HeaderProps {
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewChat }) => {
  return (
    <header className="h-14 border-b border-gray-200 bg-white/95 backdrop-blur-xs sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
      {/* Left: Simple Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
          <Bot className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 text-sm tracking-tight">
            Fine-Tuned LLM Chatbot
          </span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 font-medium">
            Sanaullah Edition
          </span>
        </div>
      </div>

      {/* Right: Clean Social Icons & New Chat */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1">
          <a
            href={SANAULLAH_PROFILE.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={SANAULLAH_PROFILE.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={SANAULLAH_PROFILE.links.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Portfolio"
          >
            <Globe className="w-4 h-4" />
          </a>
          <a
            href={SANAULLAH_PROFILE.links.email}
            className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
        </div>

        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition-all cursor-pointer shadow-2xs"
          title="New conversation"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New chat</span>
        </button>
      </div>
    </header>
  );
};

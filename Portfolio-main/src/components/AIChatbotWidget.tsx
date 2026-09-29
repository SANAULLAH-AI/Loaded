import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageCircle,
  Phone,
  Mail,
  GraduationCap,
  Code2,
  Award,
  ChevronRight,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export const AIChatbotWidget: React.FC = () => {
  const { data, setShowResumeModal } = usePortfolio();
  const { profile, education, skills, projects, certifications, publications } = data;

  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: `Hello! 👋 I'm Sanaullah's AI Portfolio Assistant. Ask me anything about his 3.86/4.00 CGPA, Machine Learning & AI projects, skills, or contact info!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const generateAnswer = (query: string): string => {
    const q = query.toLowerCase().trim();

    if (q.includes('cgpa') || q.includes('gpa') || q.includes('grade') || q.includes('marks')) {
      return `Sanaullah maintains an outstanding academic standing with a CGPA of ${profile.cgpa} in BS Computer Science at ${profile.university}.`;
    }

    if (q.includes('university') || q.includes('degree') || q.includes('bscs') || q.includes('education') || q.includes('college')) {
      const topEdu = education[0];
      return `Sanaullah is pursuing a ${profile.degree} (${profile.academicYears}) at ${profile.university}. CGPA: ${profile.cgpa}. Top coursework includes Machine Learning, Deep Learning, Data Structures, Algorithms, and Software Engineering.`;
    }

    if (q.includes('contact') || q.includes('whatsapp') || q.includes('wechat') || q.includes('phone') || q.includes('email') || q.includes('number')) {
      return `You can reach Sanaullah directly via:\n- 📧 Email: ${profile.email}\n- 🟢 WhatsApp / WeChat: +92 325 1907930\n- 📍 Location: ${profile.location || 'Islamabad, Pakistan'}`;
    }

    if (q.includes('project') || q.includes('portfolio') || q.includes('sentiment') || q.includes('model') || q.includes('ai app')) {
      const projTitles = projects.slice(0, 4).map((p) => `• ${p.title} (${p.category})`).join('\n');
      return `Sanaullah has engineered multiple high-impact AI/ML projects:\n${projTitles}\n\nClick on any project card in the Projects section to open full case studies!`;
    }

    if (q.includes('skill') || q.includes('python') || q.includes('pytorch') || q.includes('tech') || q.includes('tool') || q.includes('framework')) {
      const skillCats = skills.map((s) => `• ${s.categoryName}: ${s.skills.map((sk) => sk.name).join(', ')}`).join('\n');
      return `Sanaullah's primary technical toolkit includes:\n${skillCats}`;
    }

    if (q.includes('certif') || q.includes('course') || q.includes('ibm') || q.includes('coursera') || q.includes('datacamp')) {
      const certs = certifications.slice(0, 4).map((c) => `• ${c.title} by ${c.issuer}`).join('\n');
      return `Sanaullah holds 10+ verified certifications including:\n${certs}`;
    }

    if (q.includes('resume') || q.includes('cv') || q.includes('download cv') || q.includes('pdf')) {
      return `You can preview and print/download Sanaullah's complete verified Curriculum Vitae by clicking the "Preview Resume" button in the Hero section!`;
    }

    if (q.includes('who') || q.includes('about') || q.includes('sanaullah') || q.includes('bio')) {
      return `${profile.name} is a ${profile.title} and ${profile.subtitle} based in ${profile.location || 'Islamabad, Pakistan'}. ${profile.bio}`;
    }

    // Default intelligent fallback
    return `Sanaullah is a high-achieving BSCS Scholar (${profile.cgpa} CGPA at ${profile.university}) specializing in Artificial Intelligence, Machine Learning, and Data Science. You can explore his projects, certifications, or reach him at +92 325 1907930 / ${profile.email}.`;
  };

  const handleSend = (userText?: string) => {
    const textToSend = userText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userText) setInputQuery('');

    // Simulate instant AI typing response
    setTimeout(() => {
      const botText = generateAnswer(textToSend);
      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: botText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 250);
  };

  const promptChips = [
    'What is Sanaullah\'s CGPA & University?',
    'Show his AI & Machine Learning Projects',
    'How can I contact him on WhatsApp?',
    'What are his key technical skills?',
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group px-4 py-3 rounded-full bg-slate-900 dark:bg-amber-400 text-white dark:text-black font-extrabold text-xs shadow-2xl flex items-center gap-2.5 hover:scale-105 transition-all cursor-pointer border border-slate-700 dark:border-amber-500/50"
          >
            <div className="w-7 h-7 rounded-full bg-amber-400 dark:bg-black text-black dark:text-amber-400 flex items-center justify-center font-black">
              <Bot className="w-4 h-4 text-red-600 dark:text-amber-400" />
            </div>
            <span className="uppercase tracking-wider">Ask AI Assistant</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        )}
      </div>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] sm:w-[400px] h-[520px] bg-white dark:bg-neutral-950 rounded-2xl border-2 border-slate-200 dark:border-amber-500/40 shadow-2xl flex flex-col overflow-hidden animate-fade-in">
          {/* Top Bar */}
          <div className="p-3.5 bg-slate-900 dark:bg-black border-b border-slate-800 dark:border-amber-500/20 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-black flex items-center justify-center font-black">
                <Bot className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                  <span>AI Portfolio Assistant</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-emerald-500 text-slate-950">
                    ONLINE
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  Trained on Sanaullah's CGPA, Projects & Skills
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-black text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-medium rounded-tr-none'
                      : 'bg-white dark:bg-neutral-900 text-slate-800 dark:text-zinc-100 border border-slate-200 dark:border-amber-500/20 rounded-tl-none shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1 px-1">
                  {m.time}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="p-2 bg-slate-100 dark:bg-neutral-900/80 border-t border-slate-200 dark:border-amber-500/20 overflow-x-auto no-scrollbar flex gap-1.5 shrink-0">
            {promptChips.map((chip, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white dark:bg-black text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-amber-500/30 hover:border-amber-400 shrink-0 transition cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white dark:bg-black border-t border-slate-200 dark:border-amber-500/20 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask AI about Sanaullah's CGPA, projects..."
              className="flex-1 p-2 text-xs rounded-xl border border-slate-200 dark:border-amber-500/20 dark:bg-neutral-900 dark:text-white focus:outline-none focus:border-amber-400 font-sans"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2 rounded-xl bg-slate-900 text-white dark:bg-amber-400 dark:text-black hover:opacity-90 disabled:opacity-40 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

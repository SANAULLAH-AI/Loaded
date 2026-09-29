import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { sendContactMessageToMongoDB } from '../lib/mongodb';
import {
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Linkedin,
  Github,
  Cpu,
  BarChart2,
  Globe,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Send,
  Sparkles,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { data } = usePortfolio();
  const { profile, sectionVisibility } = data;

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Direct Message Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ success: boolean; text: string } | null>(null);

  if (!sectionVisibility.contact) return null;

  const phoneNum = '+92 325 1907930';
  const whatsappUrl = 'https://wa.me/923251907930';

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setFormFeedback({ success: false, text: 'Please fill in Name, Email, and Message.' });
      return;
    }

    setIsSubmitting(true);
    setFormFeedback(null);

    const res = await sendContactMessageToMongoDB(formData);
    setIsSubmitting(false);

    if (res.success) {
      setFormFeedback({
        success: true,
        text: 'Thank you! Your message has been sent to Sanaullah.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } else {
      setFormFeedback({ success: false, text: res.message || 'Failed to send message.' });
    }
  };


  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2500);
  };

  const getSocialIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'mail':
        return <Mail className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'cpu':
      case 'hugging-face':
      case 'huggingface':
        return <Cpu className="w-4 h-4" />;
      case 'barchart2':
      case 'kaggle':
        return <BarChart2 className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <section id="contact" className="py-16 relative border-b border-slate-200 dark:border-amber-500/20 bg-slate-50/50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-10">
        {/* Section Header */}
        <div>
          <h2 className="text-[10px] font-bold text-slate-400 dark:text-amber-400/80 uppercase tracking-[0.2em] mb-2">
            Direct Communication & Collaboration
          </h2>
          <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Contact & Connect Profiles
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-2xl">
            Reach out directly via Email, WhatsApp, WeChat, or Phone Call. Open for Data Science, Machine Learning, and AI collaboration opportunities.
          </p>
        </div>

        {/* Primary Contact Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Direct Email */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 space-y-4 shadow-sm hover:border-amber-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white dark:bg-amber-400 dark:text-black flex items-center justify-center font-bold shadow-2xs">
                <Mail className="w-5 h-5 text-red-600" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-black text-slate-800 dark:text-amber-400 border dark:border-amber-500/30">
                Official Email
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-amber-400/80 block">
                Email Address
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="text-sm font-mono font-bold text-slate-900 dark:text-white hover:text-amber-400 transition break-all block mt-1"
              >
                {profile.email}
              </a>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={`mailto:${profile.email}`}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 text-white dark:bg-amber-400 dark:text-black text-xs font-extrabold uppercase tracking-wider text-center hover:opacity-90 transition"
              >
                Send Email
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(profile.email, 'email')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-amber-500/20 hover:border-amber-400 transition cursor-pointer"
                title="Copy Email"
              >
                {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 space-y-4 shadow-sm hover:border-amber-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black flex items-center justify-center font-bold shadow-2xs">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                WhatsApp
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-amber-400/80 block">
                WhatsApp Direct Number
              </span>
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-white block mt-1">
                {phoneNum}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black text-xs font-extrabold uppercase tracking-wider text-center hover:opacity-90 transition flex items-center justify-center gap-1.5"
              >
                <span>WhatsApp Chat</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => copyToClipboard(phoneNum, 'whatsapp')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-neutral-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-amber-500/20 hover:border-amber-400 transition cursor-pointer"
                title="Copy Number"
              >
                {copiedField === 'whatsapp' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 3: WeChat Contact */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 space-y-4 shadow-sm hover:border-amber-400/50 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white dark:bg-emerald-400 dark:text-black flex items-center justify-center font-bold shadow-2xs">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                WeChat
              </span>
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-amber-400/80 block">
                WeChat Contact / ID
              </span>
              <span className="text-sm font-mono font-bold text-slate-900 dark:text-white block mt-1">
                {phoneNum}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(phoneNum, 'wechat')}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 text-white dark:bg-emerald-400 dark:text-black text-xs font-extrabold uppercase tracking-wider text-center hover:opacity-90 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedField === 'wechat' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied WeChat ID</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy WeChat ID</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 4: Phone & Location */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 space-y-4 shadow-sm hover:border-amber-400/50 transition-all md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-black text-slate-900 dark:text-red-500 flex items-center justify-center font-bold border dark:border-red-500/30 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-amber-400/80 block">
                  Direct Phone Call
                </span>
                <a
                  href={`tel:${phoneNum.replace(/\s+/g, '')}`}
                  className="text-xs font-mono font-bold text-slate-900 dark:text-white hover:text-amber-400 transition"
                >
                  {phoneNum}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-black text-slate-900 dark:text-red-500 flex items-center justify-center font-bold border dark:border-red-500/30 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-amber-400/80 block">
                  Base Location
                </span>
                <span className="text-xs font-bold uppercase text-slate-900 dark:text-white">
                  {profile.location || 'Islamabad, Pakistan'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Online Connect Profiles */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-neutral-950 border border-slate-200 dark:border-amber-500/30 space-y-4 shadow-sm">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-amber-400/80">
            Online Connect & Social Profiles
          </h4>
          <div className="flex flex-wrap gap-3">
            {profile.socialLinks
              .filter((s) => s.visible)
              .map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-black border border-slate-200 dark:border-amber-500/20 text-slate-800 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-amber-400 hover:border-amber-400 text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition"
                >
                  <span className="text-slate-900 dark:text-amber-400">
                    {getSocialIcon(s.iconName)}
                  </span>
                  <span>{s.platform}</span>
                </a>
              ))}
          </div>
        </div>

        {/* Direct Contact Message Form (MongoDB Atlas Connected) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-neutral-950 dark:via-black dark:to-neutral-900 border border-slate-200 dark:border-amber-500/30 space-y-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-500" />
                <span>Send Direct Message to Sanaullah</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Your message is stored securely in <strong>MongoDB Atlas Cluster0</strong> and forwarded directly.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-amber-500/20 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                  Your Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-amber-500/20 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. AI / Machine Learning Collaboration"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-amber-500/20 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-zinc-300 mb-1">
                Your Message *
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Type your message, inquiry, or project proposal here..."
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-amber-500/20 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-amber-400 transition resize-none"
              />
            </div>

            {formFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  formFeedback.success
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                }`}
              >
                {formFeedback.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-white dark:bg-amber-400 dark:text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              {isSubmitting ? (
                <span>Saving to MongoDB Atlas...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message To MongoDB Atlas</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

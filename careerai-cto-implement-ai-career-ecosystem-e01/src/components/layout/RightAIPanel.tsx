'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  SparklesIcon,
  PaperAirplaneIcon,
  LightBulbIcon,
  ChartBarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AIInsight {
  id: string;
  type: 'tip' | 'suggestion' | 'alert' | 'opportunity';
  title: string;
  description: string;
  action?: string;
  actionHref?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function RightAIPanel() {
  const { data: session } = useSession();
  const role = session?.user?.role || 'student';
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI Career Assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const insights: AIInsight[] = {
    student: [
      {
        id: '1',
        type: 'opportunity',
        title: 'New Job Match!',
        description: '3 jobs match your skills with 85%+ compatibility',
        action: 'View Jobs',
        actionHref: '/student/jobs',
      },
      {
        id: '2',
        type: 'tip',
        title: 'Skill Gap Alert',
        description: 'Add TypeScript to your profile - 80% of target jobs require it',
        action: 'Update Skills',
        actionHref: '/student/skills',
      },
      {
        id: '3',
        type: 'suggestion',
        title: 'Interview Practice',
        description: 'You haven\'t practiced in 5 days. Keep your skills sharp!',
        action: 'Start Practice',
        actionHref: '/student/interview',
      },
    ],
    recruiter: [
      {
        id: '1',
        type: 'opportunity',
        title: 'Top Candidate Found',
        description: 'Sarah Johnson matches your Frontend role with 92% score',
        action: 'View Profile',
        actionHref: '/recruiter/search',
      },
      {
        id: '2',
        type: 'alert',
        title: 'Job Expiring Soon',
        description: 'Senior Developer position expires in 2 days',
        action: 'Renew',
        actionHref: '/recruiter/jobs',
      },
      {
        id: '3',
        type: 'tip',
        title: 'AI Suggestion',
        description: 'Add "React Native" to your requirements for better matches',
      },
    ],
    admin: [
      {
        id: '1',
        type: 'alert',
        title: 'Verification Pending',
        description: '12 GitHub verifications need review',
        action: 'Review',
        actionHref: '/admin/verification',
      },
      {
        id: '2',
        type: 'tip',
        title: 'System Health',
        description: 'All systems operational. API response time: 45ms',
        action: 'View Details',
        actionHref: '/admin/health',
      },
    ],
  }[role] || [];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(inputMessage, role),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (message: string, userRole: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (userRole === 'student') {
      if (lowerMsg.includes('job') || lowerMsg.includes('work')) {
        return 'I found 5 jobs matching your React and TypeScript skills. The Frontend Developer role at TechCorp has a 92% match score. Would you like me to help you prepare your application?';
      }
      if (lowerMsg.includes('skill') || lowerMsg.includes('learn')) {
        return 'Based on your career goals, I recommend focusing on Next.js and GraphQL. Here are some excellent resources: 1) Next.js official docs, 2) FullStackOpen course. Would you like a personalized learning roadmap?';
      }
      if (lowerMsg.includes('interview')) {
        return 'Great! I can help you practice. What type of position are you interviewing for? I can generate custom questions and provide feedback on your answers.';
      }
      return 'I\'m here to help with your career! I can assist with job searches, skill recommendations, interview preparation, and career roadmaps. What would you like to work on?';
    }
    
    if (userRole === 'recruiter') {
      if (lowerMsg.includes('candidate')) {
        return 'I found 3 strong candidates for your Senior Developer position. Alex Chen has 5 years of React experience and scored 95% on our technical assessment. Would you like to see their full profile?';
      }
      if (lowerMsg.includes('job') || lowerMsg.includes('post')) {
        return 'I can help you create an effective job posting. Would you like me to generate a job description based on your requirements, or suggest improvements to your current posting?';
      }
      return 'I\'m your AI recruiting assistant. I can help you find candidates, optimize job postings, analyze market trends, and screen applicants. What would you like assistance with?';
    }
    
    return 'How can I assist you today?';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return <LightBulbIcon className="h-5 w-5 text-amber-500" />;
      case 'suggestion':
        return <AcademicCapIcon className="h-5 w-5 text-primary-500" />;
      case 'alert':
        return <ChartBarIcon className="h-5 w-5 text-red-500" />;
      case 'opportunity':
        return <BriefcaseIcon className="h-5 w-5 text-green-500" />;
      default:
        return <SparklesIcon className="h-5 w-5 text-primary-500" />;
    }
  };

  return (
    <aside className="sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin space-y-4">
      {/* AI Assistant Card */}
      <Card padding="sm" className="ai-panel border-sky-200">
        <div className="ai-panel-header -mx-3 -mt-3 px-4 py-3 rounded-t-lg mb-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5" />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
        </div>

        {isChatOpen ? (
          <div className="space-y-3">
            <div className="h-48 overflow-y-auto space-y-2 bg-white/50 rounded-lg p-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'p-2 rounded-lg text-sm',
                    msg.role === 'user'
                      ? 'bg-primary-100 text-primary-900 ml-4'
                      : 'bg-dark-100 text-dark-700 mr-4'
                  )}
                >
                  {msg.content}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-1 p-2">
                  <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-dark-400 rounded-full animate-bounce delay-200" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask anything..."
                className="flex-1 px-3 py-2 text-sm border border-dark-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-xs text-dark-500 hover:text-dark-700"
            >
              Close chat
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-sky-600" />
            </div>
            <p className="text-sm text-dark-600 mb-3">
              Get personalized career advice, job recommendations, and skill suggestions
            </p>
            <button
              onClick={() => setIsChatOpen(true)}
              className="w-full py-2 bg-white text-primary-600 font-medium rounded-lg border border-primary-200 hover:bg-primary-50 transition-colors"
            >
              Start Chat
            </button>
          </div>
        )}
      </Card>

      {/* AI Insights */}
      <div>
        <h3 className="text-sm font-semibold text-dark-900 mb-3 px-1">AI Insights</h3>
        <div className="space-y-3">
          {insights.map((insight) => (
            <Card key={insight.id} padding="sm" className="hover:shadow-md transition-shadow">
              <div className="flex gap-3">
                <div className="flex-shrink-0">{getInsightIcon(insight.type)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-dark-900">{insight.title}</h4>
                  <p className="text-xs text-dark-500 mt-1">{insight.description}</p>
                  {insight.action && insight.actionHref && (
                    <a
                      href={insight.actionHref}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 mt-2"
                    >
                      {insight.action}
                      <ChevronRightIcon className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <Card padding="sm">
        <h3 className="text-sm font-semibold text-dark-900 mb-3">Quick Stats</h3>
        <div className="space-y-3">
          {role === 'student' && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-dark-600">Profile Views</span>
                <span className="text-sm font-semibold text-dark-900">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-dark-600">Applications</span>
                <span className="text-sm font-semibold text-dark-900">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-dark-600">Interview Score</span>
                <span className="text-sm font-semibold text-green-600">87%</span>
              </div>
            </>
          )}
          {role === 'recruiter' && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-dark-600">Active Jobs</span>
                <span className="text-sm font-semibold text-dark-900">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-dark-600">Total Applicants</span>
                <span className="text-sm font-semibold text-dark-900">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-dark-600">Avg Match Score</span>
                <span className="text-sm font-semibold text-green-600">78%</span>
              </div>
            </>
          )}
        </div>
      </Card>
    </aside>
  );
}

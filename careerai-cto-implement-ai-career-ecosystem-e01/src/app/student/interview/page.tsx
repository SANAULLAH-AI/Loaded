'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { LeftNav } from '@/components/layout/LeftNav';
import { RightAIPanel } from '@/components/layout/RightAIPanel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'react-hot-toast';
import {
  SparklesIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  TrophyIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

interface Question {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
  expectedPoints: string[];
}

interface InterviewSession {
  sessionId: string;
  jobTitle: string;
  level: string;
  questions: Question[];
}

export default function InterviewPage() {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    idealAnswer: string;
  } | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  // Setup form state
  const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [level, setLevel] = useState('mid');
  const [isStarting, setIsStarting] = useState(false);

  const startInterview = async () => {
    if (!jobTitle || !skills) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsStarting(true);
    try {
      const response = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          skills: skills.split(',').map(s => s.trim()),
          level,
          questionCount: 5,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setSession(data.data);
      toast.success('Interview started! Good luck!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start interview');
    } finally {
      setIsStarting(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !session) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ai/interview', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          questionId: session.questions[currentQuestionIndex].id,
          answer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setFeedback(data.data);
      setShowFeedback(true);

      if (data.data.completed) {
        setCompleted(true);
        setOverallScore(data.data.overallScore);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    setFeedback(null);
    setShowFeedback(false);
    setAnswer('');
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const resetInterview = () => {
    setSession(null);
    setCurrentQuestionIndex(0);
    setAnswer('');
    setFeedback(null);
    setShowFeedback(false);
    setCompleted(false);
    setOverallScore(0);
    setJobTitle('');
    setSkills('');
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-dark-50">
        <Header />
        <div className="dashboard-container">
          <LeftNav />
          <main className="max-w-2xl mx-auto">
            <Card className="text-center py-12">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SparklesIcon className="h-10 w-10 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-dark-900 mb-2">AI Interview Simulator</h1>
              <p className="text-dark-500 mb-8 max-w-md mx-auto">
                Practice with AI-generated interview questions tailored to your target role.
                Get real-time feedback and improve your responses.
              </p>

              <div className="space-y-4 max-w-md mx-auto text-left">
                <Input
                  label="Target Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Senior Frontend Developer"
                />
                <Input
                  label="Key Skills (comma separated)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., React, TypeScript, Node.js"
                />
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-1.5">Experience Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-lg border border-dark-300 px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="entry">Entry Level (0-2 years)</option>
                    <option value="mid">Mid Level (2-5 years)</option>
                    <option value="senior">Senior Level (5+ years)</option>
                    <option value="lead">Lead/Principal (8+ years)</option>
                  </select>
                </div>
                <Button
                  onClick={startInterview}
                  isLoading={isStarting}
                  className="w-full"
                  size="lg"
                  leftIcon={<SparklesIcon className="h-5 w-5" />}
                >
                  Start Interview
                </Button>
              </div>
            </Card>
          </main>
          <RightAIPanel />
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-dark-50">
        <Header />
        <div className="dashboard-container">
          <LeftNav />
          <main className="max-w-2xl mx-auto">
            <Card className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrophyIcon className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-dark-900 mb-2">Interview Completed!</h1>
              <p className="text-dark-500 mb-6">You've completed the interview for {session.jobTitle}</p>

              <div className="bg-primary-50 rounded-xl p-6 mb-8 max-w-sm mx-auto">
                <p className="text-sm text-dark-500 mb-2">Your Overall Score</p>
                <p className={`text-5xl font-bold ${overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {overallScore}%
                </p>
                <p className="text-sm text-dark-500 mt-2">
                  {overallScore >= 80 ? 'Excellent!' : overallScore >= 60 ? 'Good job!' : 'Keep practicing!'}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="secondary" onClick={resetInterview}>
                  Practice Again
                </Button>
                <Button onClick={() => window.location.href = '/student'}>
                  Back to Dashboard
                </Button>
              </div>
            </Card>
          </main>
          <RightAIPanel />
        </div>
      </div>
    );
  }

  const currentQuestion = session.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <div className="min-h-screen bg-dark-50">
      <Header />
      <div className="dashboard-container">
        <LeftNav />
        <main className="max-w-3xl mx-auto">
          <Card>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-500">
                  Question {currentQuestionIndex + 1} of {session.questions.length}
                </span>
                <span className="text-sm text-dark-500">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  currentQuestion.category === 'technical' ? 'bg-blue-100 text-blue-700' :
                  currentQuestion.category === 'behavioral' ? 'bg-purple-100 text-purple-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {currentQuestion.category}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  currentQuestion.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-dark-900 mb-4">
                {currentQuestion.question}
              </h2>
              <p className="text-sm text-dark-500">
                Key points to cover: {currentQuestion.expectedPoints.join(', ')}
              </p>
            </div>

            {/* Answer Input */}
            {!showFeedback && (
              <div className="space-y-4">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  rows={6}
                  className="w-full rounded-lg border border-dark-300 px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={submitAnswer}
                    isLoading={isSubmitting}
                    disabled={!answer.trim()}
                    rightIcon={<PaperAirplaneIcon className="h-4 w-4" />}
                  >
                    Submit Answer
                  </Button>
                </div>
              </div>
            )}

            {/* Feedback */}
            {showFeedback && feedback && (
              <div className="space-y-6 animate-fade-in">
                <div className={`p-4 rounded-lg ${feedback.score >= 80 ? 'bg-green-50' : feedback.score >= 60 ? 'bg-amber-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      feedback.score >= 80 ? 'bg-green-100' : feedback.score >= 60 ? 'bg-amber-100' : 'bg-red-100'
                    }`}>
                      <span className={`text-lg font-bold ${
                        feedback.score >= 80 ? 'text-green-700' : feedback.score >= 60 ? 'text-amber-700' : 'text-red-700'
                      }`}>
                        {feedback.score}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-dark-900">Score</p>
                      <p className="text-sm text-dark-500">
                        {feedback.score >= 80 ? 'Excellent!' : feedback.score >= 60 ? 'Good job!' : 'Keep practicing!'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {feedback.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-green-700">• {s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                      <LightBulbIcon className="h-4 w-4" />
                      Areas to Improve
                    </h4>
                    <ul className="space-y-1">
                      {feedback.weaknesses.map((w, i) => (
                        <li key={i} className="text-sm text-amber-700">• {w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-dark-50 rounded-lg">
                  <h4 className="font-medium text-dark-800 mb-2">Suggested Improvements</h4>
                  <ul className="space-y-1">
                    {feedback.suggestions.map((s, i) => (
                      <li key={i} className="text-sm text-dark-600">• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-primary-50 rounded-lg">
                  <h4 className="font-medium text-primary-800 mb-2">Example Answer</h4>
                  <p className="text-sm text-primary-700">{feedback.idealAnswer}</p>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={nextQuestion}
                    rightIcon={<ArrowRightIcon className="h-4 w-4" />}
                  >
                    {currentQuestionIndex < session.questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </main>
        <RightAIPanel />
      </div>
    </div>
  );
}

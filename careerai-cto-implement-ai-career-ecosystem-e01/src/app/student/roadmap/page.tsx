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
  RocketLaunchIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  TrophyIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface Milestone {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  skills: string[];
  projects: string[];
  certifications: string[];
  completed: boolean;
}

interface Roadmap {
  _id: string;
  title: string;
  currentRole?: string;
  targetRole: string;
  timeline: string;
  milestones: Milestone[];
  progress: number;
}

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [timeline, setTimeline] = useState('5-year');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const response = await fetch('/api/ai/roadmap');
      if (response.ok) {
        const data = await response.json();
        setRoadmap(data.data);
      } else if (response.status === 404) {
        setRoadmap(null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to load roadmap');
      }
    } catch {
      toast.error('Failed to load roadmap');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRoadmap = async () => {
    if (!targetRole.trim()) {
      toast.error('Please enter your target role');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, timeline }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Career roadmap generated!');
        setRoadmap(data.data);
        setShowGenerateModal(false);
      } else {
        toast.error(data.error || 'Failed to generate roadmap');
      }
    } catch {
      toast.error('Failed to generate roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMilestone = async (milestoneId: string, completed: boolean) => {
    try {
      const response = await fetch('/api/ai/roadmap', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, completed }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoadmap(data.data);
        toast.success(completed ? 'Milestone completed!' : 'Milestone unchecked');
      } else {
        toast.error('Failed to update milestone');
      }
    } catch {
      toast.error('Failed to update milestone');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-50">
        <Header />
        <div className="dashboard-container">
          <LeftNav />
          <main className="flex items-center justify-center">
            <Spinner size="xl" />
          </main>
          <RightAIPanel />
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-dark-50">
        <Header />
        <div className="dashboard-container">
          <LeftNav />
          <main className="max-w-2xl mx-auto">
            <Card className="text-center py-12">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <RocketLaunchIcon className="h-10 w-10 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-dark-900 mb-2">No Career Roadmap Yet</h1>
              <p className="text-dark-500 mb-8 max-w-md mx-auto">
                Generate a personalized AI career roadmap to guide your professional development journey.
              </p>
              <Button size="lg" leftIcon={<SparklesIcon className="h-5 w-5" />} onClick={() => setShowGenerateModal(true)}>
                Generate My Roadmap
              </Button>
            </Card>
          </main>
          <RightAIPanel />
        </div>

        <Modal
          isOpen={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          title="Generate Career Roadmap"
        >
          <div className="space-y-4">
            <Input
              label="Target Role"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
            />
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">Timeline</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full rounded-lg border border-dark-300 px-3 py-2 focus:ring-2 focus:ring-primary-500"
              >
                <option value="1-year">1 Year</option>
                <option value="3-year">3 Years</option>
                <option value="5-year">5 Years</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" className="flex-1" onClick={() => setShowGenerateModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={generateRoadmap} isLoading={isGenerating}>
                Generate
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50">
      <Header />
      <div className="dashboard-container">
        <LeftNav />
        <main className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-dark-900">{roadmap.title}</h1>
              <p className="text-dark-500">{roadmap.timeline} roadmap to becoming a {roadmap.targetRole}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-dark-500">Progress</p>
                <p className="text-2xl font-bold text-primary-600">{roadmap.progress}%</p>
              </div>
              <div className="w-16 h-16">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-dark-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-primary-600"
                    strokeDasharray={`${roadmap.progress}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-dark-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500"
              style={{ width: `${roadmap.progress}%` }}
            />
          </div>

          {/* Milestones */}
          <div className="space-y-4">
            {roadmap.milestones.map((milestone, index) => (
              <Card
                key={milestone.id}
                className={`transition-all ${milestone.completed ? 'border-green-300 bg-green-50/30' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleMilestone(milestone.id, !milestone.completed)}
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      milestone.completed
                        ? 'bg-green-500 text-white'
                        : 'bg-dark-200 text-dark-400 hover:bg-dark-300'
                    }`}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className={`font-semibold ${milestone.completed ? 'text-dark-500 line-through' : 'text-dark-900'}`}>
                          {milestone.title}
                        </h3>
                        <p className="text-sm text-dark-500 flex items-center gap-1 mt-1">
                          <ClockIcon className="h-3 w-3" />
                          {milestone.timeframe}
                        </p>
                      </div>
                      {index === 0 && !milestone.completed && (
                        <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-dark-600 mt-2">{milestone.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      {/* Skills */}
                      <div>
                        <h4 className="text-sm font-medium text-dark-700 flex items-center gap-1 mb-2">
                          <AcademicCapIcon className="h-4 w-4" />
                          Skills to Learn
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {milestone.skills.map((skill) => (
                            <span key={skill} className="px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Projects */}
                      <div>
                        <h4 className="text-sm font-medium text-dark-700 flex items-center gap-1 mb-2">
                          <BriefcaseIcon className="h-4 w-4" />
                          Projects
                        </h4>
                        <ul className="text-sm text-dark-600 space-y-1">
                          {milestone.projects.map((project, i) => (
                            <li key={i}>• {project}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Certifications */}
                      <div>
                        <h4 className="text-sm font-medium text-dark-700 flex items-center gap-1 mb-2">
                          <TrophyIcon className="h-4 w-4" />
                          Certifications
                        </h4>
                        <ul className="text-sm text-dark-600 space-y-1">
                          {milestone.certifications.map((cert, i) => (
                            <li key={i}>• {cert}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Regenerate Button */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={() => setShowGenerateModal(true)}>
              Generate New Roadmap
            </Button>
          </div>
        </main>
        <RightAIPanel />
      </div>
    </div>
  );
}

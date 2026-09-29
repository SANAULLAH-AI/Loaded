'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/Header';
import { LeftNav } from '@/components/layout/LeftNav';
import { RightAIPanel } from '@/components/layout/RightAIPanel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import {
  UsersIcon,
  BriefcaseIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  ArrowRightIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  href: string;
}

function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, href }: StatCardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-dark-500',
  };

  return (
    <Card padding="md" hover>
      <Link href={href} className="block">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-dark-500">{title}</p>
            <p className="text-2xl font-bold text-dark-900 mt-1">{value}</p>
            {change && <p className={`text-xs mt-1 ${changeColors[changeType]}`}>{change}</p>}
          </div>
          <div className="p-2 bg-primary-50 rounded-lg">
            <Icon className="h-5 w-5 text-primary-600" />
          </div>
        </div>
      </Link>
    </Card>
  );
}

interface Candidate {
  id: string;
  name: string;
  role: string;
  matchScore: number;
  skills: string[];
  experience: string;
}

function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-dark-200 hover:border-primary-300 hover:shadow-sm transition-all">
      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
        <span className="text-lg font-semibold text-primary-600">
          {candidate.name.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-dark-900 truncate">{candidate.name}</h4>
        <p className="text-sm text-dark-500">{candidate.role}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {candidate.skills.slice(0, 3).map(skill => (
            <span key={skill} className="px-2 py-0.5 text-xs bg-dark-100 text-dark-600 rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 text-green-600">
          <StarIcon className="h-4 w-4" />
          <span className="font-semibold">{candidate.matchScore}%</span>
        </div>
        <p className="text-xs text-dark-400">{candidate.experience}</p>
      </div>
    </div>
  );
}

export default function RecruiterDashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark-50">
        <Spinner size="xl" />
        <p className="text-dark-500 mt-4">Loading your dashboard...</p>
      </div>
    );
  }

  const stats = [
    { title: 'Active Jobs', value: '5', change: '+2 this month', changeType: 'positive' as const, icon: BriefcaseIcon, href: '/recruiter/jobs' },
    { title: 'Total Applicants', value: '47', change: '12 new today', changeType: 'positive' as const, icon: UsersIcon, href: '/recruiter/applications' },
    { title: 'Shortlisted', value: '8', change: '3 interviews scheduled', changeType: 'neutral' as const, icon: DocumentCheckIcon, href: '/recruiter/applications' },
    { title: 'Avg Match Score', value: '78%', change: '+5% from last month', changeType: 'positive' as const, icon: ChartBarIcon, href: '/recruiter/analytics' },
  ];

  const topCandidates: Candidate[] = [
    { id: '1', name: 'Sarah Johnson', role: 'Senior Frontend Developer', matchScore: 92, skills: ['React', 'TypeScript', 'Node.js'], experience: '5 years' },
    { id: '2', name: 'Michael Chen', role: 'Full Stack Engineer', matchScore: 88, skills: ['Python', 'Django', 'React'], experience: '4 years' },
    { id: '3', name: 'Emily Davis', role: 'UI/UX Developer', matchScore: 85, skills: ['Figma', 'React', 'CSS'], experience: '3 years' },
    { id: '4', name: 'James Wilson', role: 'Backend Developer', matchScore: 83, skills: ['Java', 'Spring', 'AWS'], experience: '6 years' },
  ];

  const recentJobs = [
    { id: '1', title: 'Senior Frontend Developer', applicants: 12, status: 'active', postedAt: '2 days ago' },
    { id: '2', title: 'Full Stack Engineer', applicants: 8, status: 'active', postedAt: '5 days ago' },
    { id: '3', title: 'DevOps Engineer', applicants: 5, status: 'active', postedAt: '1 week ago' },
  ];

  return (
    <div className="min-h-screen bg-dark-50">
      <Header />
      <div className="dashboard-container">
        <LeftNav />
        
        {/* Main Content */}
        <main className="space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-dark-900">
                Welcome back, {session?.user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-dark-500 mt-1">Here's your recruitment activity overview</p>
            </div>
            <Link href="/recruiter/jobs/new">
              <Button leftIcon={<BriefcaseIcon className="h-4 w-4" />}>
                Post New Job
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Candidates */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-dark-900">AI-Recommended Candidates</h2>
                  <p className="text-sm text-dark-500">Top matches for your active jobs</p>
                </div>
                <Link href="/recruiter/search" className="text-sm text-primary-600 hover:text-primary-700">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {topCandidates.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} />
                ))}
              </div>
            </Card>

            {/* Recent Jobs */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-900">Active Jobs</h2>
                <Link href="/recruiter/jobs" className="text-sm text-primary-600 hover:text-primary-700">
                  Manage Jobs
                </Link>
              </div>
              <div className="space-y-3">
                {recentJobs.map((job) => (
                  <Link key={job.id} href={`/recruiter/jobs/${job.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-dark-200 hover:border-primary-300 hover:shadow-sm transition-all">
                      <div>
                        <h3 className="font-medium text-dark-900">{job.title}</h3>
                        <p className="text-sm text-dark-500 flex items-center gap-2 mt-1">
                          <UserGroupIcon className="h-4 w-4" />
                          {job.applicants} applicants
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          {job.status}
                        </span>
                        <p className="text-xs text-dark-400 mt-1 flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          {job.postedAt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/recruiter/jobs">
                <Button variant="outline" className="w-full mt-4" rightIcon={<ArrowRightIcon className="h-4 w-4" />}>
                  View All Jobs
                </Button>
              </Link>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-dark-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/recruiter/search">
                <div className="p-4 rounded-xl bg-primary-50 text-center hover:bg-primary-100 transition-colors">
                  <UserGroupIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-primary-700">Search Talent</span>
                </div>
              </Link>
              <Link href="/recruiter/jobs/new">
                <div className="p-4 rounded-xl bg-amber-50 text-center hover:bg-amber-100 transition-colors">
                  <BriefcaseIcon className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-amber-700">Post Job</span>
                </div>
              </Link>
              <Link href="/recruiter/applications">
                <div className="p-4 rounded-xl bg-purple-50 text-center hover:bg-purple-100 transition-colors">
                  <DocumentCheckIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-purple-700">Review Applications</span>
                </div>
              </Link>
              <Link href="/recruiter/analytics">
                <div className="p-4 rounded-xl bg-green-50 text-center hover:bg-green-100 transition-colors">
                  <ChartBarIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-green-700">View Analytics</span>
                </div>
              </Link>
            </div>
          </Card>
        </main>

        <RightAIPanel />
      </div>
    </div>
  );
}

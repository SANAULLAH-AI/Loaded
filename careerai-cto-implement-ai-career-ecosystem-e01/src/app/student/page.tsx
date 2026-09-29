'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/Header';
import { LeftNav } from '@/components/layout/LeftNav';
import { RightAIPanel } from '@/components/layout/RightAIPanel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import {
  BriefcaseIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
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

interface ActivityItem {
  id: string;
  type: 'application' | 'view' | 'interview' | 'match';
  title: string;
  description: string;
  time: string;
}

function ActivityItem({ item }: { item: ActivityItem }) {
  const icons = {
    application: DocumentCheckIcon,
    view: ChartBarIcon,
    interview: SparklesIcon,
    match: BriefcaseIcon,
  };

  const colors = {
    application: 'bg-blue-100 text-blue-600',
    view: 'bg-purple-100 text-purple-600',
    interview: 'bg-amber-100 text-amber-600',
    match: 'bg-green-100 text-green-600',
  };

  const Icon = icons[item.type];

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-dark-50 transition-colors">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colors[item.type]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-dark-900">{item.title}</p>
        <p className="text-xs text-dark-500 mt-0.5">{item.description}</p>
        <p className="text-xs text-dark-400 mt-1 flex items-center gap-1">
          <ClockIcon className="h-3 w-3" />
          {item.time}
        </p>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  const stats = [
    { title: 'Profile Views', value: '24', change: '+12% this week', changeType: 'positive' as const, icon: ChartBarIcon, href: '/student/profile' },
    { title: 'Applications', value: '8', change: '3 pending', changeType: 'neutral' as const, icon: DocumentCheckIcon, href: '/student/applications' },
    { title: 'Job Matches', value: '15', change: '5 new today', changeType: 'positive' as const, icon: BriefcaseIcon, href: '/student/jobs' },
    { title: 'Interview Score', value: '87%', change: '+5% improvement', changeType: 'positive' as const, icon: RocketLaunchIcon, href: '/student/interview' },
  ];

  const recentActivity: ActivityItem[] = [
    { id: '1', type: 'match', title: 'New Job Match', description: 'Frontend Developer at TechCorp matches your profile with 92% score', time: '2 hours ago' },
    { id: '2', type: 'view', title: 'Profile Viewed', description: 'Your profile was viewed by 3 recruiters today', time: '5 hours ago' },
    { id: '3', type: 'application', title: 'Application Sent', description: 'Applied for Senior React Developer at StartupXYZ', time: '1 day ago' },
    { id: '4', type: 'interview', title: 'Interview Completed', description: 'Scored 87% on Frontend Technical Interview', time: '2 days ago' },
  ];

  const recommendedJobs = [
    { id: '1', title: 'Senior Frontend Developer', company: 'TechCorp', location: 'Remote', salary: '$120k - $150k', match: 92 },
    { id: '2', title: 'Full Stack Engineer', company: 'StartupXYZ', location: 'San Francisco', salary: '$100k - $130k', match: 88 },
    { id: '3', title: 'React Developer', company: 'Digital Agency', location: 'New York', salary: '$90k - $110k', match: 85 },
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
              <p className="text-dark-500 mt-1">Here's what's happening with your career journey</p>
            </div>
            <Link href="/student/interview">
              <Button leftIcon={<SparklesIcon className="h-4 w-4" />}>
                Practice Interview
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
            {/* Recent Activity */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-900">Recent Activity</h2>
                <Link href="/student/activity" className="text-sm text-primary-600 hover:text-primary-700">
                  View All
                </Link>
              </div>
              <div className="divide-y divide-dark-100">
                {recentActivity.map((item) => (
                  <ActivityItem key={item.id} item={item} />
                ))}
              </div>
            </Card>

            {/* Recommended Jobs */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-900">Recommended Jobs</h2>
                <Link href="/student/jobs" className="text-sm text-primary-600 hover:text-primary-700">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {recommendedJobs.map((job) => (
                  <Link key={job.id} href={`/student/jobs/${job.id}`}>
                    <div className="p-3 rounded-lg border border-dark-200 hover:border-primary-300 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-dark-900">{job.title}</h3>
                          <p className="text-sm text-dark-500">{job.company} • {job.location}</p>
                          <p className="text-sm text-dark-600 mt-1">{job.salary}</p>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                          <CheckCircleIcon className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-medium text-green-700">{job.match}%</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/student/jobs">
                <Button variant="outline" className="w-full mt-4" rightIcon={<ArrowRightIcon className="h-4 w-4" />}>
                  Browse All Jobs
                </Button>
              </Link>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-dark-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/student/profile">
                <div className="p-4 rounded-xl bg-primary-50 text-center hover:bg-primary-100 transition-colors">
                  <UserIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-primary-700">Update Profile</span>
                </div>
              </Link>
              <Link href="/student/roadmap">
                <div className="p-4 rounded-xl bg-amber-50 text-center hover:bg-amber-100 transition-colors">
                  <RocketLaunchIcon className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-amber-700">Career Roadmap</span>
                </div>
              </Link>
              <Link href="/student/skills">
                <div className="p-4 rounded-xl bg-purple-50 text-center hover:bg-purple-100 transition-colors">
                  <ChartBarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-purple-700">Skill Analysis</span>
                </div>
              </Link>
              <Link href="/student/resume">
                <div className="p-4 rounded-xl bg-green-50 text-center hover:bg-green-100 transition-colors">
                  <DocumentCheckIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-green-700">Upload Resume</span>
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

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-50">
      <Spinner size="xl" />
      <p className="text-dark-500 mt-4">{message}</p>
    </div>
  );
}

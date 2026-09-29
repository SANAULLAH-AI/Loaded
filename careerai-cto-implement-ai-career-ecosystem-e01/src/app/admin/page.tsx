'use client';

import { useSession } from 'next-auth/react';
import { Header } from '@/components/layout/Header';
import { LeftNav } from '@/components/layout/LeftNav';
import { RightAIPanel } from '@/components/layout/RightAIPanel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  UsersIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  ServerIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: 'blue' | 'green' | 'amber' | 'purple' | 'red';
  href: string;
}

function StatCard({ title, value, subtitle, icon: Icon, color, href }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <Card padding="md" hover>
      <Link href={href} className="block">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-dark-500">{title}</p>
            <p className="text-2xl font-bold text-dark-900 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-dark-400 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-2 rounded-lg ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </Link>
    </Card>
  );
}

interface SystemStatusProps {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  latency: string;
}

function SystemStatus({ name, status, latency }: SystemStatusProps) {
  const statusConfig = {
    operational: { icon: CheckCircleIcon, color: 'text-green-500', bg: 'bg-green-50', label: 'Operational' },
    degraded: { icon: ExclamationTriangleIcon, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Degraded' },
    down: { icon: XCircleIcon, color: 'text-red-500', bg: 'bg-red-50', label: 'Down' },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-50">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <Icon className={`h-4 w-4 ${config.color}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-dark-900">{name}</p>
          <p className={`text-xs ${config.color}`}>{config.label}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-dark-600">{latency}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session } = useSession();

  const stats = [
    { title: 'Total Users', value: '1,247', subtitle: '+56 this week', icon: UsersIcon, color: 'blue' as const, href: '/admin/users' },
    { title: 'Active Jobs', value: '89', subtitle: '23 pending review', icon: BriefcaseIcon, color: 'green' as const, href: '/admin/jobs' },
    { title: 'Verifications', value: '12', subtitle: 'Need approval', icon: ShieldCheckIcon, color: 'amber' as const, href: '/admin/verification' },
    { title: 'System Health', value: '99.9%', subtitle: 'Uptime last 30 days', icon: ServerIcon, color: 'purple' as const, href: '/admin/health' },
  ];

  const systemStatus: SystemStatusProps[] = [
    { name: 'API Server', status: 'operational', latency: '45ms' },
    { name: 'Database', status: 'operational', latency: '12ms' },
    { name: 'AI Service', status: 'operational', latency: '234ms' },
    { name: 'File Storage', status: 'operational', latency: '89ms' },
    { name: 'Email Service', status: 'degraded', latency: '1.2s' },
  ];

  const recentActivity = [
    { id: '1', action: 'User registered', user: 'john.doe@example.com', time: '2 minutes ago' },
    { id: '2', action: 'Job posted', user: 'TechCorp Recruiter', time: '5 minutes ago' },
    { id: '3', action: 'GitHub verification approved', user: 'sarah.dev', time: '12 minutes ago' },
    { id: '4', action: 'Broadcast sent', user: 'Admin', time: '1 hour ago' },
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
                Admin Dashboard
              </h1>
              <p className="text-dark-500 mt-1">System overview and management controls</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/broadcast">
                <Button variant="secondary">Send Broadcast</Button>
              </Link>
              <Link href="/admin/users/new">
                <Button>Add User</Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Status */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-900">System Status</h2>
                <Link href="/admin/health" className="text-sm text-primary-600 hover:text-primary-700">
                  View Details
                </Link>
              </div>
              <div className="divide-y divide-dark-100">
                {systemStatus.map((service) => (
                  <SystemStatus key={service.name} {...service} />
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark-900">Recent Activity</h2>
                <Link href="/admin/logs" className="text-sm text-primary-600 hover:text-primary-700">
                  View Logs
                </Link>
              </div>
              <div className="divide-y divide-dark-100">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-dark-900">{activity.action}</p>
                      <p className="text-xs text-dark-500">{activity.user}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-dark-400">
                      <ClockIcon className="h-3 w-3" />
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-lg font-semibold text-dark-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/users">
                <div className="p-4 rounded-xl bg-blue-50 text-center hover:bg-blue-100 transition-colors">
                  <UsersIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-blue-700">Manage Users</span>
                </div>
              </Link>
              <Link href="/admin/jobs">
                <div className="p-4 rounded-xl bg-green-50 text-center hover:bg-green-100 transition-colors">
                  <BriefcaseIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-green-700">Moderate Jobs</span>
                </div>
              </Link>
              <Link href="/admin/verification">
                <div className="p-4 rounded-xl bg-amber-50 text-center hover:bg-amber-100 transition-colors">
                  <ShieldCheckIcon className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-amber-700">Verifications</span>
                </div>
              </Link>
              <Link href="/admin/analytics">
                <div className="p-4 rounded-xl bg-purple-50 text-center hover:bg-purple-100 transition-colors">
                  <ChartBarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-purple-700">Analytics</span>
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

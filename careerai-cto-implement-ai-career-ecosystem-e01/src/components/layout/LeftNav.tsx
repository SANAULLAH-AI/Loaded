'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  SparklesIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  RocketLaunchIcon,
  BookmarkIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

export function LeftNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || 'student';

  const studentNav: NavItem[] = [
    { label: 'Dashboard', href: '/student', icon: HomeIcon },
    { label: 'My Profile', href: '/student/profile', icon: UserIcon },
    { label: 'Jobs', href: '/student/jobs', icon: BriefcaseIcon, badge: 12 },
    { label: 'Applications', href: '/student/applications', icon: ClipboardDocumentListIcon },
    { label: 'Career Roadmap', href: '/student/roadmap', icon: RocketLaunchIcon },
    { label: 'Interview Prep', href: '/student/interview', icon: ChatBubbleLeftRightIcon },
    { label: 'Skills Analysis', href: '/student/skills', icon: ChartBarIcon },
    { label: 'Saved Jobs', href: '/student/saved', icon: BookmarkIcon },
    { label: 'Learning', href: '/student/learning', icon: AcademicCapIcon },
  ];

  const recruiterNav: NavItem[] = [
    { label: 'Dashboard', href: '/recruiter', icon: HomeIcon },
    { label: 'Search Talent', href: '/recruiter/search', icon: MagnifyingGlassIcon },
    { label: 'My Jobs', href: '/recruiter/jobs', icon: BriefcaseIcon },
    { label: 'Applications', href: '/recruiter/applications', icon: ClipboardDocumentListIcon, badge: 8 },
    { label: 'Company Profile', href: '/recruiter/company', icon: BuildingOfficeIcon },
    { label: 'Saved Searches', href: '/recruiter/saved', icon: BookmarkIcon },
    { label: 'Analytics', href: '/recruiter/analytics', icon: ChartBarIcon },
  ];

  const adminNav: NavItem[] = [
    { label: 'Dashboard', href: '/admin', icon: HomeIcon },
    { label: 'Users', href: '/admin/users', icon: UsersIcon },
    { label: 'Jobs', href: '/admin/jobs', icon: BriefcaseIcon },
    { label: 'Applications', href: '/admin/applications', icon: ClipboardDocumentListIcon },
    { label: 'Broadcast', href: '/admin/broadcast', icon: SparklesIcon },
    { label: 'Verification Hub', href: '/admin/verification', icon: DocumentTextIcon },
    { label: 'System Health', href: '/admin/health', icon: ChartBarIcon },
    { label: 'Audit Logs', href: '/admin/logs', icon: Cog6ToothIcon },
  ];

  const navItems = {
    student: studentNav,
    recruiter: recruiterNav,
    admin: adminNav,
  };

  const currentNav = navItems[role as keyof typeof navItems] || studentNav;

  return (
    <nav className="sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto pr-2 scrollbar-thin">
      <div className="space-y-1">
        {currentNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-50 text-primary-600 shadow-sm'
                  : 'text-dark-600 hover:bg-dark-100 hover:text-dark-900'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-primary-600' : 'text-dark-400')} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    'px-2 py-0.5 text-xs font-semibold rounded-full',
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-dark-200 text-dark-600'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-dark-200">
        <h3 className="px-4 text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="space-y-1">
          {role === 'student' && (
            <Link
              href="/student/interview"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-dark-600 hover:bg-dark-100 transition-colors"
            >
              <SparklesIcon className="h-5 w-5 text-amber-500" />
              <span>Practice Interview</span>
            </Link>
          )}
          {role === 'recruiter' && (
            <Link
              href="/recruiter/jobs/new"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-dark-600 hover:bg-dark-100 transition-colors"
            >
              <SparklesIcon className="h-5 w-5 text-amber-500" />
              <span>Post New Job</span>
            </Link>
          )}
          <Link
            href={`/${role}/settings`}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-dark-600 hover:bg-dark-100 transition-colors"
          >
            <Cog6ToothIcon className="h-5 w-5 text-dark-400" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

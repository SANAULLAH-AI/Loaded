'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const role = session?.user?.role || 'student';

  const navItems = {
    student: [
      { label: 'Dashboard', href: '/student' },
      { label: 'Profile', href: '/student/profile' },
      { label: 'Jobs', href: '/student/jobs' },
      { label: 'Roadmap', href: '/student/roadmap' },
      { label: 'Interview', href: '/student/interview' },
    ],
    recruiter: [
      { label: 'Dashboard', href: '/recruiter' },
      { label: 'Search', href: '/recruiter/search' },
      { label: 'Jobs', href: '/recruiter/jobs' },
      { label: 'Applications', href: '/recruiter/applications' },
    ],
    admin: [
      { label: 'Dashboard', href: '/admin' },
      { label: 'Users', href: '/admin/users' },
      { label: 'Jobs', href: '/admin/jobs' },
      { label: 'Broadcast', href: '/admin/broadcast' },
    ],
  };

  const currentNav = navItems[role as keyof typeof navItems] || navItems.student;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-dark-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-xl text-dark-900 hidden sm:block">
              Career<span className="text-primary-600">Ecosystem</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search jobs, skills, people..."
                className="w-full pl-10 pr-4 py-2 bg-dark-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-dark-500 hover:bg-dark-100 rounded-full transition-colors">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-dark-100 transition-colors"
              >
                <img
                  src={session?.user?.image || '/default-avatar.png'}
                  alt={session?.user?.name || 'User'}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden sm:block text-sm font-medium text-dark-700">
                  {session?.user?.name?.split(' ')[0]}
                </span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-dark-200 py-1 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-dark-200">
                    <p className="text-sm font-medium text-dark-900">{session?.user?.name}</p>
                    <p className="text-xs text-dark-500">{session?.user?.email}</p>
                    <p className="text-xs text-primary-600 mt-1 capitalize">{role}</p>
                  </div>
                  <Link
                    href={`/${role}/profile`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-dark-700 hover:bg-dark-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <UserCircleIcon className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href={`/${role}/settings`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-dark-700 hover:bg-dark-50"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Cog6ToothIcon className="h-4 w-4" />
                    Settings
                  </Link>
                  <hr className="my-1 border-dark-200" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-dark-500 hover:bg-dark-100 rounded-lg"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-dark-200 animate-fade-in">
          <div className="px-4 py-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-dark-100 rounded-lg text-sm"
              />
            </div>
          </div>
          <nav className="px-2 pb-3 space-y-1">
            {currentNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm font-medium',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-dark-600 hover:bg-dark-100'
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

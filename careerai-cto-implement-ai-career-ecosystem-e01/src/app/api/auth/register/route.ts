import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/connect';
import { User, StudentProfile, RecruiterProfile } from '@/lib/mongodb/models';
import { hashPassword } from '@/lib/utils/auth';
import { generateAvatarUrl } from '@/lib/cloudinary/upload';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, company } = body;

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    if (role === 'recruiter' && !company) {
      return NextResponse.json(
        { error: 'Company name is required for recruiters' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    // Create profile based on role
    if (role === 'student') {
      await StudentProfile.create({
        userId: user._id,
        name,
        avatar: generateAvatarUrl(name),
        visibility: {
          profile: 'public',
          resume: 'recruiters',
          github: 'public',
          email: 'recruiters',
          phone: 'private',
        },
        preferences: {
          jobAlerts: true,
          mentorAlerts: true,
          weeklyDigest: true,
          emailNotifications: true,
          pushNotifications: true,
          marketingEmails: false,
        },
        skills: [],
        education: [],
        experience: [],
        projects: [],
        github: {
          connected: false,
          repos: [],
        },
      });
    } else if (role === 'recruiter') {
      await RecruiterProfile.create({
        userId: user._id,
        name,
        title: 'Recruiter',
        company,
        avatar: generateAvatarUrl(name),
        activeJobs: [],
        savedSearches: [],
        preferences: {
          dailyBriefing: true,
          candidateAlerts: true,
          emailNotifications: true,
        },
      });
    }

    logger.info('User registered successfully', { userId: user._id, email, role });

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('Registration failed', error as Error);
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}

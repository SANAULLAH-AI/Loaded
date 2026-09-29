import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb/connect';
import { StudentProfile } from '@/lib/mongodb/models';
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const profile = await StudentProfile.findOne({ userId: session.user.id })
      .populate('roadmapId')
      .lean();

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    logger.error('Failed to fetch student profile', error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    await connectToDatabase();

    const allowedUpdates = [
      'name',
      'headline',
      'bio',
      'avatar',
      'location',
      'education',
      'skills',
      'experience',
      'projects',
      'visibility',
      'preferences',
      'careerGoals',
    ];

    const updates: Record<string, unknown> = {};
    allowedUpdates.forEach((field) => {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    });

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: session.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    logger.info('Student profile updated', { userId: session.user.id });

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    logger.error('Failed to update student profile', error as Error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

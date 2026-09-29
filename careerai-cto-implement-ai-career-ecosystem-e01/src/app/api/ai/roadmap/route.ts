import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb/connect';
import { Roadmap, StudentProfile } from '@/lib/mongodb/models';
import { aiService } from '@/lib/ai/openrouter';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { targetRole, timeline = '5-year' } = body;

    if (!targetRole) {
      return NextResponse.json(
        { error: 'Target role is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get student profile
    const profile = await StudentProfile.findOne({ userId: session.user.id });
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Generate roadmap with AI
    const aiRoadmap = await aiService.generateRoadmap({
      currentRole: profile.headline || 'Student',
      targetRole,
      skills: profile.skills.map(s => s.name),
      education: profile.education.map(e => `${e.level} in ${e.field}`),
      interests: profile.careerGoals?.targetIndustries,
    });

    // Delete existing roadmap if any
    if (profile.roadmapId) {
      await Roadmap.findByIdAndDelete(profile.roadmapId);
    }

    // Create new roadmap
    const roadmap = await Roadmap.create({
      studentId: session.user.id,
      title: `${targetRole} Career Roadmap`,
      currentRole: profile.headline,
      targetRole,
      timeline,
      milestones: aiRoadmap.milestones.map((m, index) => ({
        ...m,
        id: `m${index + 1}`,
        completed: false,
      })),
      progress: 0,
      aiGenerated: true,
    });

    // Update profile with roadmap reference
    await StudentProfile.findOneAndUpdate(
      { userId: session.user.id },
      { roadmapId: roadmap._id }
    );

    logger.info('Roadmap generated', { userId: session.user.id, targetRole });

    return NextResponse.json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    logger.error('Roadmap generation failed', error as Error);
    return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}

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

    const roadmap = await Roadmap.findOne({ studentId: session.user.id });

    if (!roadmap) {
      return NextResponse.json(
        { error: 'No roadmap found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    logger.error('Failed to fetch roadmap', error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch roadmap' },
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
    const { milestoneId, completed } = body;

    await connectToDatabase();

    const roadmap = await Roadmap.findOne({ studentId: session.user.id });
    if (!roadmap) {
      return NextResponse.json(
        { error: 'Roadmap not found' },
        { status: 404 }
      );
    }

    // Update milestone
    const milestone = roadmap.milestones.find(m => m.id === milestoneId);
    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      );
    }

    milestone.completed = completed;
    milestone.completedAt = completed ? new Date() : null;

    // Recalculate progress
    const completedCount = roadmap.milestones.filter(m => m.completed).length;
    roadmap.progress = Math.round((completedCount / roadmap.milestones.length) * 100);

    await roadmap.save();

    return NextResponse.json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    logger.error('Failed to update roadmap', error as Error);
    return NextResponse.json(
      { error: 'Failed to update roadmap' },
      { status: 500 }
    );
  }
}

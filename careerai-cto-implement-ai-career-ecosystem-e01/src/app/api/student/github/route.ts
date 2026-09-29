import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb/connect';
import { StudentProfile } from '@/lib/mongodb/models';
import { githubVerifier } from '@/lib/github/verifier';
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
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: 'GitHub username is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verify GitHub profile
    const verification = await githubVerifier.verifyAndAnalyze(username);

    // Update profile with verified skills
    const skills = verification.verifiedSkills.map(skill => ({
      name: skill.name,
      verified: true,
      verificationSource: 'github' as const,
      endorsements: 0,
    }));

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: {
          'github.username': verification.username,
          'github.connected': true,
          'github.repos': verification.repos,
          'github.followers': verification.followers,
          'github.verifiedAt': new Date(),
        },
        $addToSet: {
          skills: { $each: skills },
        },
      },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    logger.info('GitHub connected successfully', { 
      userId: session.user.id, 
      username,
      skillsVerified: skills.length 
    });

    return NextResponse.json({
      success: true,
      data: {
        username: verification.username,
        name: verification.name,
        avatar: verification.avatar,
        publicRepos: verification.publicRepos,
        followers: verification.followers,
        repos: verification.repos,
        verifiedSkills: verification.verifiedSkills,
        overallScore: verification.overallScore,
      },
    });
  } catch (error) {
    logger.error('GitHub verification failed', error as Error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to connect GitHub' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: {
          'github.connected': false,
        },
      },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    logger.info('GitHub disconnected', { userId: session.user.id });

    return NextResponse.json({
      success: true,
      message: 'GitHub disconnected successfully',
    });
  } catch (error) {
    logger.error('GitHub disconnect failed', error as Error);
    return NextResponse.json(
      { error: 'Failed to disconnect GitHub' },
      { status: 500 }
    );
  }
}

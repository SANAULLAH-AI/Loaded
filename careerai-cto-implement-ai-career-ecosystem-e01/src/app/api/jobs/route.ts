import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb/connect';
import { Job, Application, StudentProfile } from '@/lib/mongodb/models';
import { logger } from '@/lib/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);

    await connectToDatabase();

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = { status: 'active' };

    const search = searchParams.get('search');
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skills = searchParams.get('skills');
    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    const type = searchParams.get('type');
    if (type) {
      query.type = type;
    }

    const remote = searchParams.get('remote');
    if (remote === 'true') {
      query['location.remote'] = true;
    }

    const jobs = await Job.find(query)
      .populate('createdBy', 'name company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Job.countDocuments(query);

    // If student, calculate match scores
    let jobsWithMatch = jobs;
    if (session?.user?.role === 'student') {
      const profile = await StudentProfile.findOne({ userId: session.user.id });
      if (profile) {
        const userSkills = new Set(profile.skills.map(s => s.name.toLowerCase()));
        
        jobsWithMatch = jobs.map(job => {
          const jobSkills = job.skills.map((s: string) => s.toLowerCase());
          const matchedSkills = jobSkills.filter((s: string) => userSkills.has(s));
          const matchScore = Math.round((matchedSkills.length / jobSkills.length) * 100);
          
          return {
            ...job,
            matchScore,
            matchedSkills,
          };
        }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      }
    }

    return NextResponse.json({
      success: true,
      data: jobsWithMatch,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Failed to fetch jobs', error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!['recruiter', 'admin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Only recruiters can post jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();

    await connectToDatabase();

    const job = await Job.create({
      ...body,
      createdBy: session.user.id,
      status: 'active',
      applications: [],
      views: 0,
    });

    logger.info('Job created', { jobId: job._id, createdBy: session.user.id });

    return NextResponse.json({
      success: true,
      data: job,
    }, { status: 201 });
  } catch (error) {
    logger.error('Failed to create job', error as Error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

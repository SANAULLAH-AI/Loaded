import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb/connect';
import { InterviewSession, StudentProfile } from '@/lib/mongodb/models';
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
    const { jobTitle, skills, level = 'mid', questionCount = 5 } = body;

    if (!jobTitle || !skills || skills.length === 0) {
      return NextResponse.json(
        { error: 'Job title and skills are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Generate questions with AI
    const questions = await aiService.generateInterviewQuestions(
      jobTitle,
      skills,
      level,
      questionCount
    );

    // Create interview session
    const interviewSession = await InterviewSession.create({
      studentId: session.user.id,
      jobTitle,
      skills,
      level,
      questions: questions.map((q, index) => ({
        ...q,
        id: `q${index + 1}`,
      })),
      answers: [],
      completed: false,
    });

    logger.info('Interview session created', { 
      userId: session.user.id, 
      jobTitle,
      questionCount: questions.length 
    });

    return NextResponse.json({
      success: true,
      data: {
        sessionId: interviewSession._id,
        jobTitle,
        level,
        questions,
      },
    });
  } catch (error) {
    logger.error('Interview session creation failed', error as Error);
    return NextResponse.json(
      { error: 'Failed to create interview session' },
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
    const { sessionId, questionId, answer } = body;

    if (!sessionId || !questionId || !answer) {
      return NextResponse.json(
        { error: 'Session ID, question ID, and answer are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const interviewSession = await InterviewSession.findOne({
      _id: sessionId,
      studentId: session.user.id,
    });

    if (!interviewSession) {
      return NextResponse.json(
        { error: 'Interview session not found' },
        { status: 404 }
      );
    }

    const question = interviewSession.questions.find(q => q.id === questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Score answer with AI
    const scoring = await aiService.scoreInterviewAnswer(
      question.question,
      answer,
      question.expectedPoints
    );

    // Add answer to session
    interviewSession.answers.push({
      questionId,
      answer,
      score: scoring.score,
      feedback: scoring.feedback,
      idealAnswer: scoring.idealAnswer,
    });

    // Check if all questions answered
    if (interviewSession.answers.length === interviewSession.questions.length) {
      interviewSession.completed = true;
      interviewSession.completedAt = new Date();
      
      // Calculate overall score
      const totalScore = interviewSession.answers.reduce((sum, a) => sum + a.score, 0);
      interviewSession.overallScore = Math.round(totalScore / interviewSession.answers.length);
    }

    await interviewSession.save();

    return NextResponse.json({
      success: true,
      data: {
        score: scoring.score,
        feedback: scoring.feedback,
        idealAnswer: scoring.idealAnswer,
        completed: interviewSession.completed,
        overallScore: interviewSession.overallScore,
      },
    });
  } catch (error) {
    logger.error('Interview answer submission failed', error as Error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
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

    const sessions = await InterviewSession.find({
      studentId: session.user.id,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    logger.error('Failed to fetch interview sessions', error as Error);
    return NextResponse.json(
      { error: 'Failed to fetch interview sessions' },
      { status: 500 }
    );
  }
}

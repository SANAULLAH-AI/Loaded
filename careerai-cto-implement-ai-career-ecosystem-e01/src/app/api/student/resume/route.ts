import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/lib/mongodb/connect';
import { StudentProfile } from '@/lib/mongodb/models';
import { aiService } from '@/lib/ai/openrouter';
import { uploadResume, deleteFile } from '@/lib/cloudinary/upload';
import { logger } from '@/lib/utils/logger';
import pdfParse from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get existing profile to delete old resume
    const existingProfile = await StudentProfile.findOne({ userId: session.user.id });
    if (existingProfile?.resume?.publicId) {
      await deleteFile(existingProfile.resume.publicId);
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await uploadResume(buffer, file.name, session.user.id);

    // Parse resume text
    let resumeText = '';
    if (file.type === 'application/pdf') {
      try {
        const pdfData = await pdfParse(buffer);
        resumeText = pdfData.text;
      } catch {
        resumeText = '';
      }
    }

    // Analyze with AI
    let parsedData = null;
    if (resumeText) {
      try {
        const analysis = await aiService.analyzeResume(resumeText);
        parsedData = {
          name: analysis.name,
          email: analysis.email,
          phone: analysis.phone,
          summary: analysis.summary,
          skills: analysis.skills,
          experience: analysis.experience.map(exp => ({
            title: exp.title,
            company: exp.company,
            duration: exp.duration,
            description: exp.description,
          })),
          education: analysis.education.map(edu => ({
            level: 'Bachelor',
            field: edu.degree,
            institution: edu.institution,
            startYear: parseInt(edu.year) || new Date().getFullYear(),
          })),
        };
      } catch (error) {
        logger.error('AI resume analysis failed', error as Error);
      }
    }

    // Update profile
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: session.user.id },
      {
        $set: {
          resume: {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            parsed: !!parsedData,
            parsedData,
            lastParsed: new Date(),
          },
        },
      },
      { new: true }
    );

    logger.info('Resume uploaded and analyzed', { 
      userId: session.user.id, 
      publicId: uploadResult.publicId,
      parsed: !!parsedData 
    });

    return NextResponse.json({
      success: true,
      data: {
        url: uploadResult.url,
        parsed: !!parsedData,
        parsedData,
      },
    });
  } catch (error) {
    logger.error('Resume upload failed', error as Error);
    return NextResponse.json(
      { error: 'Failed to upload resume' },
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

    const profile = await StudentProfile.findOne({ userId: session.user.id });
    
    if (!profile?.resume?.publicId) {
      return NextResponse.json(
        { error: 'No resume found' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    await deleteFile(profile.resume.publicId);

    // Remove from profile
    await StudentProfile.findOneAndUpdate(
      { userId: session.user.id },
      { $unset: { resume: 1 } }
    );

    logger.info('Resume deleted', { userId: session.user.id });

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    logger.error('Resume deletion failed', error as Error);
    return NextResponse.json(
      { error: 'Failed to delete resume' },
      { status: 500 }
    );
  }
}

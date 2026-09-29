import nodemailer from 'nodemailer';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: options.from || `"AI Career Ecosystem" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    logger.info(`Email sent to ${options.to}`, { subject: options.subject });
    return true;
  } catch (error) {
    logger.error('Failed to send email', error as Error, { to: options.to });
    return false;
  }
}

export function getVerificationEmailTemplate(code: string, name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .code { background: #f0f0f0; padding: 15px; font-size: 24px; text-align: center; letter-spacing: 5px; margin: 20px 0; }
        .footer { color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Verify Your Email Address</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up for AI Career Ecosystem. Please use the verification code below to verify your email address:</p>
        <div class="code">${code}</div>
        <p>This code will expire in 30 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <div class="footer">
          <p>AI Career Ecosystem Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getPasswordResetTemplate(token: string, name: string): string {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; display: inline-block; border-radius: 5px; margin: 20px 0; }
        .footer { color: #666; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Reset Your Password</h2>
        <p>Hi ${name},</p>
        <p>You recently requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" class="button">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <div class="footer">
          <p>AI Career Ecosystem Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getDailyBriefingTemplate(briefing: {
  recruiterName: string;
  activeJobsCount: number;
  newCandidatesCount: number;
  topMatches: Array<{
    candidateName: string;
    jobTitle: string;
    matchScore: number;
  }>;
}): string {
  const matchesHtml = briefing.topMatches.map(match => `
    <tr>
      <td>${match.candidateName}</td>
      <td>${match.jobTitle}</td>
      <td>${match.matchScore}%</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .stats { background: #f8fafc; padding: 20px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Your Daily AI Briefing</h2>
        <p>Hi ${briefing.recruiterName},</p>
        <p>Here's your personalized daily briefing from AI Career Ecosystem:</p>
        
        <div class="stats">
          <h3>Today's Stats</h3>
          <p><strong>Active Jobs:</strong> ${briefing.activeJobsCount}</p>
          <p><strong>New Candidates:</strong> ${briefing.newCandidatesCount}</p>
        </div>
        
        <h3>Top Candidate Matches</h3>
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Job</th>
              <th>Match Score</th>
            </tr>
          </thead>
          <tbody>
            ${matchesHtml}
          </tbody>
        </table>
        
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/recruiter/dashboard">View Full Dashboard</a></p>
      </div>
    </body>
    </html>
  `;
}

export function getJobAlertTemplate(jobs: Array<{ title: string; company: string; location: string }>, name: string): string {
  const jobsHtml = jobs.map(job => `
    <div style="border: 1px solid #e2e8f0; padding: 15px; margin: 10px 0; border-radius: 5px;">
      <h4>${job.title}</h4>
      <p>${job.company} • ${job.location}</p>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>New Job Matches for You</h2>
        <p>Hi ${name},</p>
        <p>We found new jobs that match your profile:</p>
        ${jobsHtml}
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/student/jobs">View All Jobs</a></p>
      </div>
    </body>
    </html>
  `;
}

import OpenAI from 'openai';
import { logger } from '@/lib/utils/logger';

const openai = new OpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    'X-Title': 'AI Career Ecosystem',
  },
});

const MODELS = {
  primary: 'openai/gpt-4',
  fallback: 'anthropic/claude-3.5-sonnet',
  fast: 'google/gemini-pro',
};

export class AIService {
  private async makeRequest(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    model: string = MODELS.primary,
    temperature: number = 0.7,
    responseFormat?: { type: 'json_object' }
  ): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        temperature,
        ...(responseFormat && { response_format: responseFormat }),
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from AI');
      }

      return content;
    } catch (error) {
      logger.error('AI request failed', error as Error, { model });
      
      if (model !== MODELS.fallback) {
        logger.info('Trying fallback model', { fallback: MODELS.fallback });
        return this.makeRequest(messages, MODELS.fallback, temperature, responseFormat);
      }
      
      throw error;
    }
  }

  async analyzeResume(text: string): Promise<{
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
    skills: string[];
    experience: Array<{
      title: string;
      company: string;
      duration: string;
      description: string;
    }>;
    education: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
    certifications: string[];
    confidence: number;
  }> {
    const prompt = `Extract structured information from this resume text. Return a JSON object with these exact fields:
    - name: full name of the person
    - email: email address
    - phone: phone number
    - summary: professional summary or objective
    - skills: array of technical and soft skills
    - experience: array of objects with title, company, duration, description
    - education: array of objects with degree, institution, year
    - certifications: array of certification names
    - confidence: number between 0-1 representing extraction confidence

    Resume text:
    ${text.substring(0, 10000)}

    Return valid JSON only.`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      MODELS.primary,
      0.3,
      { type: 'json_object' }
    );

    return JSON.parse(response);
  }

  async generateRoadmap(profile: {
    currentRole?: string;
    targetRole: string;
    skills: string[];
    education: string[];
    interests?: string[];
  }): Promise<{
    milestones: Array<{
      id: string;
      title: string;
      description: string;
      timeframe: string;
      skills: string[];
      projects: string[];
      certifications: string[];
    }>;
    estimatedTimeline: string;
  }> {
    const prompt = `Create a personalized 5-year career roadmap. Return JSON with:

    Profile:
    - Current: ${profile.currentRole || 'Student/Entry-level'}
    - Target: ${profile.targetRole}
    - Skills: ${profile.skills.join(', ')}
    - Education: ${profile.education.join(', ')}
    - Interests: ${profile.interests?.join(', ') || 'Not specified'}

    Return:
    {
      "milestones": [
        {
          "id": "m1",
          "title": "Milestone title",
          "description": "Detailed description",
          "timeframe": "Year 1 Q1-Q2",
          "skills": ["skill1", "skill2"],
          "projects": ["Project idea 1"],
          "certifications": ["Certification 1"]
        }
      ],
      "estimatedTimeline": "5 years"
    }`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      MODELS.primary,
      0.7,
      { type: 'json_object' }
    );

    return JSON.parse(response);
  }

  async generateInterviewQuestions(
    jobTitle: string,
    skills: string[],
    level: string,
    count: number = 5
  ): Promise<Array<{
    id: string;
    question: string;
    category: 'technical' | 'behavioral' | 'situational';
    difficulty: 'easy' | 'medium' | 'hard';
    expectedPoints: string[];
  }>> {
    const prompt = `Generate ${count} interview questions for a ${level} ${jobTitle} position.
    
    Required skills: ${skills.join(', ')}

    Return JSON array with objects containing:
    - id: unique identifier
    - question: the interview question
    - category: "technical", "behavioral", or "situational"
    - difficulty: "easy", "medium", or "hard"
    - expectedPoints: array of key points expected in answer

    Mix categories: 60% technical, 20% behavioral, 20% situational.
    Vary difficulties based on level: entry=easy/medium, mid=medium, senior/lead=medium/hard.`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      MODELS.primary,
      0.7,
      { type: 'json_object' }
    );

    const parsed = JSON.parse(response);
    return parsed.questions || parsed;
  }

  async scoreInterviewAnswer(
    question: string,
    answer: string,
    expectedPoints: string[]
  ): Promise<{
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    idealAnswer: string;
  }> {
    const prompt = `Score this interview answer (0-100):

    Question: ${question}
    
    Candidate's Answer: ${answer}
    
    Expected Points: ${expectedPoints.join(', ')}

    Return JSON with:
    - score: number 0-100
    - strengths: array of 2-3 strengths
    - weaknesses: array of 2-3 areas for improvement
    - suggestions: array of 2-3 specific improvement tips
    - idealAnswer: a model answer for this question`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      MODELS.primary,
      0.5,
      { type: 'json_object' }
    );

    return JSON.parse(response);
  }

  async matchCandidateToJob(
    job: {
      title: string;
      skills: string[];
      experience: { min: number; max: number };
      description: string;
    },
    candidate: {
      name: string;
      skills: string[];
      experience: Array<{ title: string; duration: string }>;
      education: string[];
    }
  ): Promise<{
    matchScore: number;
    skillMatch: {
      matched: string[];
      missing: string[];
      extra: string[];
    };
    experienceMatch: {
      yearsMatch: boolean;
      relevanceScore: number;
    };
    overallAssessment: string;
    interviewQuestions: string[];
  }> {
    const prompt = `Analyze candidate match for job position.

    JOB:
    Title: ${job.title}
    Skills Required: ${job.skills.join(', ')}
    Experience Required: ${job.experience.min}-${job.experience.max} years
    Description: ${job.description}

    CANDIDATE:
    Name: ${candidate.name}
    Skills: ${candidate.skills.join(', ')}
    Experience: ${candidate.experience.map(e => `${e.title} (${e.duration})`).join(', ')}
    Education: ${candidate.education.join(', ')}

    Return JSON with:
    - matchScore: number 0-100
    - skillMatch: { matched: [], missing: [], extra: [] }
    - experienceMatch: { yearsMatch: boolean, relevanceScore: 0-100 }
    - overallAssessment: brief summary
    - interviewQuestions: 3 suggested questions`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      MODELS.primary,
      0.5,
      { type: 'json_object' }
    );

    return JSON.parse(response);
  }

  async generateJobDescription(keywords: {
    title: string;
    skills: string[];
    experience: string;
    type: string;
  }): Promise<{
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
  }> {
    const prompt = `Generate a professional job description.

    Details:
    - Title: ${keywords.title}
    - Skills: ${keywords.skills.join(', ')}
    - Experience: ${keywords.experience}
    - Type: ${keywords.type}

    Return JSON with:
    - description: compelling job description (3-4 paragraphs)
    - requirements: array of 4-6 bullet points
    - responsibilities: array of 5-7 bullet points
    - benefits: array of 3-5 bullet points

    Use inclusive, engaging language. Highlight growth opportunities.`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      MODELS.primary,
      0.7,
      { type: 'json_object' }
    );

    return JSON.parse(response);
  }

  async generateCoverLetter(
    jobTitle: string,
    company: string,
    candidateProfile: {
      name: string;
      skills: string[];
      experience: string;
      achievements: string[];
    }
  ): Promise<string> {
    const prompt = `Write a personalized cover letter.

    Job: ${jobTitle} at ${company}
    
    Candidate:
    - Name: ${candidateProfile.name}
    - Skills: ${candidateProfile.skills.join(', ')}
    - Experience: ${candidateProfile.experience}
    - Key Achievements: ${candidateProfile.achievements.join(', ')}

    Write a professional, engaging cover letter (250-400 words) that:
    1. Opens with a hook
    2. Shows knowledge of the company
    3. Highlights relevant skills and achievements
    4. Demonstrates enthusiasm
    5. Includes a call to action

    Return plain text only.`;

    return this.makeRequest(
      [{ role: 'user', content: prompt }],
      MODELS.primary,
      0.7
    );
  }

  async analyzeGitHubRepos(repos: Array<{
    name: string;
    languages: Record<string, number>;
    description?: string;
    stars: number;
    forks: number;
  }>): Promise<{
    skills: Array<{
      name: string;
      confidence: number;
      level: 'beginner' | 'intermediate' | 'advanced';
      evidence: string[];
    }>;
    overallAssessment: string;
    recommendations: string[];
  }> {
    const prompt = `Analyze these GitHub repositories and extract verified skills:

    ${JSON.stringify(repos, null, 2)}

    Return JSON with:
    - skills: array of objects with name, confidence (0-1), level (beginner/intermediate/advanced), evidence
    - overallAssessment: brief summary of coding profile
    - recommendations: 2-3 suggestions for improvement`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      MODELS.primary,
      0.5,
      { type: 'json_object' }
    );

    return JSON.parse(response);
  }

  async chatCareerCoach(
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    context: {
      userRole?: string;
      skills?: string[];
      goals?: string;
    }
  ): Promise<string> {
    const systemPrompt = `You are an expert AI Career Coach. Be helpful, encouraging, and specific.
    
    User Context:
    - Role: ${context.userRole || 'Not specified'}
    - Skills: ${context.skills?.join(', ') || 'Not specified'}
    - Goals: ${context.goals || 'Not specified'}

    Provide actionable advice, specific resources (YouTube channels, courses, books), and concrete next steps.
    Keep responses concise but informative (max 200 words).`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history,
      { role: 'user' as const, content: message },
    ];

    return this.makeRequest(messages, MODELS.fallback, 0.7);
  }

  async detectFraud(content: {
    type: 'profile' | 'job' | 'message';
    text: string;
    metadata?: Record<string, unknown>;
  }): Promise<{
    isFraudulent: boolean;
    confidence: number;
    reasons: string[];
  }> {
    const prompt = `Analyze this content for potential fraud or spam.
    
    Type: ${content.type}
    Content: ${content.text}
    Metadata: ${JSON.stringify(content.metadata || {})}

    Return JSON with:
    - isFraudulent: boolean
    - confidence: number 0-1
    - reasons: array of flags that triggered concern`;

    const response = await this.makeRequest(
      [{ role: 'user', content: prompt }],
      MODELS.primary,
      0.3,
      { type: 'json_object' }
    );

    return JSON.parse(response);
  }
}

export const aiService = new AIService();

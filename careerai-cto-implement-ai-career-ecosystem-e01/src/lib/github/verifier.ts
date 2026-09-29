import { logger } from '@/lib/utils/logger';
import { aiService } from '@/lib/ai/openrouter';

const GITHUB_API_BASE = 'https://api.github.com';

export interface GitHubRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  size: number;
}

export interface RepoAnalysis {
  name: string;
  url: string;
  description?: string;
  languages: string[];
  stars: number;
  forks: number;
  verifiedSkills: string[];
}

export class GitHubVerifier {
  private token: string;

  constructor() {
    this.token = process.env.GITHUB_ACCESS_TOKEN || '';
  }

  private async fetchGitHub(endpoint: string): Promise<unknown> {
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'AI-Career-Ecosystem',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('GitHub user not found');
      }
      if (response.status === 403) {
        throw new Error('GitHub API rate limit exceeded');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  async getUserProfile(username: string): Promise<{
    login: string;
    name: string;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    avatar_url: string;
  }> {
    return this.fetchGitHub(`/users/${username}`) as Promise<{
      login: string;
      name: string;
      bio: string | null;
      public_repos: number;
      followers: number;
      following: number;
      created_at: string;
      avatar_url: string;
    }>;
  }

  async getUserRepos(username: string, perPage: number = 30): Promise<GitHubRepo[]> {
    return this.fetchGitHub(
      `/users/${username}/repos?sort=updated&per_page=${perPage}`
    ) as Promise<GitHubRepo[]>;
  }

  async getRepoLanguages(languagesUrl: string): Promise<Record<string, number>> {
    const response = await fetch(languagesUrl, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      return {};
    }

    return response.json();
  }

  async verifyAndAnalyze(username: string): Promise<{
    username: string;
    name: string;
    avatar: string;
    bio: string | null;
    publicRepos: number;
    followers: number;
    repos: RepoAnalysis[];
    verifiedSkills: Array<{
      name: string;
      confidence: number;
      level: 'beginner' | 'intermediate' | 'advanced';
    }>;
    overallScore: number;
  }> {
    try {
      const profile = await this.getUserProfile(username);
      const repos = await this.getUserRepos(username);

      const reposWithLanguages: Array<{
        name: string;
        languages: Record<string, number>;
        description?: string;
        stars: number;
        forks: number;
      }> = [];

      for (const repo of repos.slice(0, 10)) {
        const languages = await this.getRepoLanguages(repo.languages_url);
        reposWithLanguages.push({
          name: repo.name,
          languages,
          description: repo.description || undefined,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
        });
      }

      const aiAnalysis = await aiService.analyzeGitHubRepos(reposWithLanguages);

      const repoAnalysis: RepoAnalysis[] = repos.slice(0, 10).map((repo, index) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description || undefined,
        languages: Object.keys(reposWithLanguages[index]?.languages || {}),
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        verifiedSkills: aiAnalysis.skills
          .filter((s) => s.confidence > 0.6)
          .map((s) => s.name),
      }));

      const overallScore = Math.min(
        100,
        Math.round(
          (profile.public_repos * 2 +
            profile.followers * 0.5 +
            repos.reduce((acc, r) => acc + r.stargazers_count, 0) * 0.1) /
            10
        )
      );

      logger.info('GitHub verification completed', { username, skillsFound: aiAnalysis.skills.length });

      return {
        username: profile.login,
        name: profile.name,
        avatar: profile.avatar_url,
        bio: profile.bio,
        publicRepos: profile.public_repos,
        followers: profile.followers,
        repos: repoAnalysis,
        verifiedSkills: aiAnalysis.skills,
        overallScore,
      };
    } catch (error) {
      logger.error('GitHub verification failed', error as Error, { username });
      throw error;
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      await this.fetchGitHub('/user');
      return true;
    } catch {
      return false;
    }
  }
}

export const githubVerifier = new GitHubVerifier();

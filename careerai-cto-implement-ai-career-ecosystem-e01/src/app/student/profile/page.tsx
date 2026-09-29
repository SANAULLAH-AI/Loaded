'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { LeftNav } from '@/components/layout/LeftNav';
import { RightAIPanel } from '@/components/layout/RightAIPanel';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'react-hot-toast';
import {
  UserIcon,
  PencilIcon,
  MapPinIcon,
  LinkIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  PlusIcon,
  TrashIcon,
  GithubIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface Profile {
  name: string;
  headline?: string;
  bio?: string;
  avatar?: string;
  location?: { city?: string; country?: string };
  skills: Array<{ name: string; verified: boolean }>;
  education: Array<{
    level: string;
    field: string;
    institution: string;
    startYear: number;
    endYear?: number;
    current: boolean;
  }>;
  github?: { connected: boolean; username?: string };
  resume?: { url: string; parsed: boolean };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isConnectingGitHub, setIsConnectingGitHub] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [showGitHubModal, setShowGitHubModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/student/profile');
      const data = await response.json();
      if (response.ok) {
        setProfile(data.data);
        setEditedProfile(data.data);
      } else {
        toast.error(data.error || 'Failed to load profile');
      }
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editedProfile.name,
          headline: editedProfile.headline,
          bio: editedProfile.bio,
          location: editedProfile.location,
        }),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setProfile(editedProfile);
        setIsEditing(false);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/student/resume', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Resume uploaded and analyzed successfully');
        fetchProfile();
      } else {
        toast.error(data.error || 'Failed to upload resume');
      }
    } catch {
      toast.error('Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const connectGitHub = async () => {
    if (!githubUsername.trim()) {
      toast.error('Please enter your GitHub username');
      return;
    }

    setIsConnectingGitHub(true);
    try {
      const response = await fetch('/api/student/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: githubUsername }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('GitHub connected successfully!');
        setShowGitHubModal(false);
        fetchProfile();
      } else {
        toast.error(data.error || 'Failed to connect GitHub');
      }
    } catch {
      toast.error('Failed to connect GitHub');
    } finally {
      setIsConnectingGitHub(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-50">
        <Header />
        <div className="dashboard-container">
          <LeftNav />
          <main className="flex items-center justify-center">
            <Spinner size="xl" />
          </main>
          <RightAIPanel />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-dark-50">
      <Header />
      <div className="dashboard-container">
        <LeftNav />
        <main className="space-y-6">
          {/* Profile Header */}
          <Card>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <img
                  src={profile.avatar || '/default-avatar.png'}
                  alt={profile.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary-600 text-white rounded-full hover:bg-primary-700">
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editedProfile?.name}
                      onChange={(e) => setEditedProfile({ ...editedProfile!, name: e.target.value })}
                      placeholder="Your name"
                    />
                    <Input
                      value={editedProfile?.headline || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile!, headline: e.target.value })}
                      placeholder="Professional headline"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-dark-900">{profile.name}</h1>
                    <p className="text-dark-500">{profile.headline || 'No headline set'}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-dark-500">
                      {profile.location && (
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-4 w-4" />
                          {profile.location.city}, {profile.location.country}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="secondary" onClick={() => { setIsEditing(false); setEditedProfile(profile); }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </>
                ) : (
                  <Button variant="secondary" leftIcon={<PencilIcon className="h-4 w-4" />} onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Bio */}
          <Card>
            <h2 className="text-lg font-semibold text-dark-900 mb-4">About</h2>
            {isEditing ? (
              <Textarea
                value={editedProfile?.bio || ''}
                onChange={(e) => setEditedProfile({ ...editedProfile!, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            ) : (
              <p className="text-dark-600">{profile.bio || 'No bio added yet.'}</p>
            )}
          </Card>

          {/* Skills */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-900">Skills</h2>
              <Button variant="outline" size="sm" leftIcon={<PlusIcon className="h-4 w-4" />}>
                Add Skill
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    skill.verified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-dark-100 text-dark-700'
                  }`}
                >
                  {skill.name}
                  {skill.verified && <CheckCircleIcon className="h-3 w-3" />}
                </span>
              ))}
            </div>
          </Card>

          {/* Education */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-900">Education</h2>
              <Button variant="outline" size="sm" leftIcon={<PlusIcon className="h-4 w-4" />}>
                Add Education
              </Button>
            </div>
            <div className="space-y-4">
              {profile.education?.map((edu, index) => (
                <div key={index} className="flex gap-4 p-4 bg-dark-50 rounded-lg">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <AcademicCapIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-dark-900">{edu.field}</h3>
                    <p className="text-sm text-dark-500">{edu.institution}</p>
                    <p className="text-xs text-dark-400">
                      {edu.level} • {edu.startYear} - {edu.current ? 'Present' : edu.endYear}
                    </p>
                  </div>
                </div>
              )) || <p className="text-dark-500">No education added yet.</p>}
            </div>
          </Card>

          {/* Resume */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-900">Resume</h2>
              <label className="cursor-pointer">
                <input type="file" accept=".pdf,.doc,.docx,.txt" className="hidden" onChange={handleFileUpload} />
                <Button variant="outline" size="sm" leftIcon={<CloudArrowUpIcon className="h-4 w-4" />} isLoading={isUploading} as="span">
                  {profile.resume ? 'Update Resume' : 'Upload Resume'}
                </Button>
              </label>
            </div>
            {profile.resume ? (
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">Resume Uploaded</p>
                  <p className="text-sm text-green-700">
                    {profile.resume.parsed ? 'AI analysis completed' : 'Processing...'}
                  </p>
                </div>
                <a href={profile.resume.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm">
                  View
                </a>
              </div>
            ) : (
              <p className="text-dark-500">Upload your resume for AI analysis and auto-profile filling.</p>
            )}
          </Card>

          {/* GitHub */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-dark-900">GitHub</h2>
              {!profile.github?.connected && (
                <Button variant="outline" size="sm" leftIcon={<GithubIcon className="h-4 w-4" />} onClick={() => setShowGitHubModal(true)}>
                  Connect GitHub
                </Button>
              )}
            </div>
            {profile.github?.connected ? (
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-900">GitHub Connected</p>
                  <p className="text-sm text-green-700">@{profile.github.username}</p>
                </div>
              </div>
            ) : (
              <p className="text-dark-500">Connect your GitHub to verify your coding skills.</p>
            )}
          </Card>
        </main>
        <RightAIPanel />
      </div>

      {/* GitHub Connect Modal */}
      <Modal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
        title="Connect GitHub"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-dark-600">Enter your GitHub username to verify your repositories and coding skills.</p>
          <Input
            label="GitHub Username"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            placeholder="e.g., johndoe"
            leftIcon={<GithubIcon className="h-5 w-5" />}
          />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowGitHubModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={connectGitHub} isLoading={isConnectingGitHub}>
              Connect
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

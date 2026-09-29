'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  BuildingOfficeIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from '@/components/icons';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    company: '',
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.role === 'recruiter' && !formData.company) {
      toast.error('Company name is required for recruiters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Account created successfully! Please sign in.');
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">AI</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-900">Create Account</h1>
          <p className="text-dark-500 mt-1">Join the AI-powered career revolution</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 w-12 rounded-full ${
                i <= step ? 'bg-primary-600' : 'bg-dark-200'
              }`}
            />
          ))}
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    leftIcon={<UserIcon className="h-5 w-5" />}
                    placeholder="John Doe"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    leftIcon={<EnvelopeIcon className="h-5 w-5" />}
                    placeholder="you@example.com"
                  />

                  <Select
                    label="I am a"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    options={[
                      { value: 'student', label: 'Student / Job Seeker' },
                      { value: 'recruiter', label: 'Recruiter / Employer' },
                    ]}
                  />

                  {formData.role === 'recruiter' && (
                    <Input
                      label="Company Name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      leftIcon={<BuildingOfficeIcon className="h-5 w-5" />}
                      placeholder="Acme Inc."
                    />
                  )}

                  <Button
                    type="button"
                    className="w-full"
                    size="lg"
                    onClick={() => setStep(2)}
                    disabled={!formData.name || !formData.email}
                  >
                    Continue
                  </Button>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      leftIcon={<LockClosedIcon className="h-5 w-5" />}
                      placeholder="••••••••"
                      helperText="Min 8 chars, 1 uppercase, 1 number, 1 special char"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[34px] text-dark-400 hover:text-dark-600"
                    >
                      {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>

                  <Input
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    leftIcon={<LockClosedIcon className="h-5 w-5" />}
                    placeholder="••••••••"
                  />

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                      className="mt-1 w-4 h-4 text-primary-600 border-dark-300 rounded focus:ring-primary-500"
                      required
                    />
                    <span className="text-sm text-dark-600">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary-600 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-primary-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      isLoading={isLoading}
                      disabled={!formData.agreeToTerms}
                    >
                      Create Account
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-dark-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

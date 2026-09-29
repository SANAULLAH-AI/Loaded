import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  const login = useCallback(async (email: string, password: string, callbackUrl?: string) => {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: callbackUrl || '/dashboard',
    });

    if (result?.ok) {
      router.push(callbackUrl || '/dashboard');
      router.refresh();
    }

    return result;
  }, [router]);

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/login' });
  }, []);

  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    role: string;
    company?: string;
  }) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return response;
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    updateSession: update,
  };
}

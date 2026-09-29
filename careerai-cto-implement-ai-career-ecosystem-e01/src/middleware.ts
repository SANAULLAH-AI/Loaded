import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/api/auth'];
const ROLE_PATHS = {
  student: ['/student', '/api/student'],
  recruiter: ['/recruiter', '/api/recruiter'],
  admin: ['/admin', '/api/admin'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = token.role as string;

  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/admin') && userRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }
    if (pathname.startsWith('/api/recruiter') && !['recruiter', 'admin'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden: Recruiter access required' }, { status: 403 });
    }
    if (pathname.startsWith('/api/student') && !['student', 'admin'].includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden: Student access required' }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/recruiter') && !['recruiter', 'admin'].includes(userRole)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/student') && !['student', 'admin'].includes(userRole)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname === '/dashboard') {
    const redirectPath = userRole === 'admin' ? '/admin' : userRole === 'recruiter' ? '/recruiter' : '/student';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};

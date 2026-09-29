import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { connectToDatabase } from '@/lib/mongodb/connect';
import { User, StudentProfile, RecruiterProfile } from '@/lib/mongodb/models';
import { verifyPassword, hashPassword } from '@/lib/utils/auth';
import { generateAvatarUrl } from '@/lib/cloudinary/upload';
import { logger } from '@/lib/utils/logger';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email.toLowerCase() }).lean();

        if (!user) {
          throw new Error('Invalid email or password');
        }

        if (!user.isActive) {
          throw new Error('Account has been deactivated. Please contact support.');
        }

        if (user.isSuspended) {
          throw new Error(`Account suspended: ${user.suspensionReason || 'No reason provided'}`);
        }

        if (!user.password) {
          throw new Error('Please sign in using OAuth or set a password');
        }

        const isValidPassword = await verifyPassword(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error('Invalid email or password');
        }

        await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

        let profile;
        if (user.role === 'student') {
          profile = await StudentProfile.findOne({ userId: user._id }).lean();
        } else if (user.role === 'recruiter') {
          profile = await RecruiterProfile.findOne({ userId: user._id }).lean();
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: profile?.name || user.email,
          image: profile?.avatar || generateAvatarUrl(profile?.name || user.email),
        };
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      if (account?.provider === 'github' && profile) {
        await connectToDatabase();
        
        const existingUser = await User.findOne({ email: (profile as { email: string }).email }).lean();
        
        if (!existingUser) {
          const newUser = await User.create({
            email: (profile as { email: string }).email,
            role: 'student',
            emailVerified: new Date(),
          });

          await StudentProfile.create({
            userId: newUser._id,
            name: (profile as { name?: string }).name || (profile as { login: string }).login,
            avatar: (profile as { avatar_url?: string }).avatar_url,
            github: {
              username: (profile as { login: string }).login,
              connected: true,
            },
            visibility: {
              profile: 'public',
              resume: 'recruiters',
              github: 'public',
              email: 'recruiters',
              phone: 'private',
            },
            preferences: {
              jobAlerts: true,
              mentorAlerts: true,
              weeklyDigest: true,
              emailNotifications: true,
              pushNotifications: true,
              marketingEmails: false,
            },
          });

          token.id = newUser._id.toString();
          token.role = 'student';
        } else {
          token.id = existingUser._id.toString();
          token.role = existingUser.role;
          await User.findByIdAndUpdate(existingUser._id, { lastLoginAt: new Date() });
        }
      }

      if (account?.provider === 'google' && profile) {
        await connectToDatabase();
        
        const existingUser = await User.findOne({ email: (profile as { email: string }).email }).lean();
        
        if (!existingUser) {
          const newUser = await User.create({
            email: (profile as { email: string }).email,
            role: 'student',
            emailVerified: new Date(),
          });

          await StudentProfile.create({
            userId: newUser._id,
            name: (profile as { name?: string }).name,
            avatar: (profile as { picture?: string }).picture,
            visibility: {
              profile: 'public',
              resume: 'recruiters',
              github: 'public',
              email: 'recruiters',
              phone: 'private',
            },
            preferences: {
              jobAlerts: true,
              mentorAlerts: true,
              weeklyDigest: true,
              emailNotifications: true,
              pushNotifications: true,
              marketingEmails: false,
            },
          });

          token.id = newUser._id.toString();
          token.role = 'student';
        } else {
          token.id = existingUser._id.toString();
          token.role = existingUser.role;
          await User.findByIdAndUpdate(existingUser._id, { lastLoginAt: new Date() });
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    newUser: '/register',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error: (code, metadata) => {
      logger.error(`NextAuth Error: ${code}`, metadata as Error);
    },
    warn: (code) => {
      logger.warn(`NextAuth Warning: ${code}`);
    },
    debug: (code, metadata) => {
      logger.debug(`NextAuth Debug: ${code}`, metadata as Record<string, unknown>);
    },
  },
});

export { handler as GET, handler as POST };

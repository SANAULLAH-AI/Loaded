import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Career Ecosystem - Your AI-Powered Career Partner',
  description: 'AI-Powered Career Ecosystem with intelligent resume analysis, career roadmaps, interview simulation, and job matching.',
  keywords: ['AI Career', 'Job Matching', 'Resume Analysis', 'Interview Prep', 'Career Roadmap'],
  authors: [{ name: 'AI Career Ecosystem' }],
  openGraph: {
    title: 'AI Career Ecosystem',
    description: 'Your AI-Powered Career Partner',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#fff',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}

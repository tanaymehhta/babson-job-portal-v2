'use client';

import { useAuth } from '@/components/auth/auth-provider';
import { LandingContainer } from '@/components/landing/landing-container';
import { AuthenticatedStudentHome } from '@/components/student/student-home';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && role === 'alumni') {
      router.push('/alumni/dashboard');
    }
  }, [user, role, loading, router]);

  if (loading) {
    return null; // Or a loading spinner
  }

  // If authenticated student, show student home
  if (user && role === 'student') {
    return <AuthenticatedStudentHome />;
  }

  // If authenticated alumni, we are redirecting (handled by useEffect), so show loading state
  if (user && role === 'alumni') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-babson-green-200 dark:bg-babson-green-700 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  // If unauthenticated, show landing container
  return <LandingContainer />;
}

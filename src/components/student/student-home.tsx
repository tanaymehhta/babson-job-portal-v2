'use client';

import { useState } from 'react';
import { AnimatedSparkle } from '@/components/hero/animated-sparkle';
import { SearchBar } from '@/components/search/search-bar';
import { JobCard } from '@/components/search/job-card';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthenticatedStudentHome() {
    const { user, role, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user && role === 'alumni') {
            router.push('/alumni/dashboard');
        }
    }, [user, role, authLoading, router]);

    const [jobs, setJobs] = useState<any[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (query: string) => {
        // Reset if empty query
        if (!query.trim()) {
            setHasSearched(false);
            setJobs([]);
            setEvents([]);
            return;
        }

        setLoading(true);
        setHasSearched(true);
        setJobs([]); // Clear previous results immediately
        setEvents([]);
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            setJobs(data.jobs || []);
            setEvents(data.events || []);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <AnimatedSparkle />

            <div className="container mx-auto px-4 pt-20 pb-12">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-slate-900"
                    >
                        Find your next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-babson-green-600 to-emerald-500">
                            opportunity
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600"
                    >
                        Use natural language to search for jobs, internships, and events tailored for Babson students.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <SearchBar onSearch={handleSearch} isLoading={loading} />
                    </motion.div>
                </div>

                {(hasSearched || loading) && (
                    <div className="space-y-12">
                        <section>
                            <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                                Job Matches
                                {loading ? (
                                    <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full animate-pulse">
                                        Searching...
                                    </span>
                                ) : (
                                    <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                        {jobs.length}
                                    </span>
                                )}
                            </h2>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {jobs.map((job, index) => (
                                            <JobCard key={job.id} job={job} index={index} />
                                        ))}
                                    </div>
                                    {jobs.length === 0 && (
                                        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            No jobs found matching your criteria. Try a broader search.
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}

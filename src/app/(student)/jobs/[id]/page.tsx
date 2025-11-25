'use client';

import { useEffect, useState, use } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ApplyModal } from '@/components/search/apply-modal';
import { motion } from 'framer-motion';
import { Building2, MapPin, DollarSign, Calendar, Globe, CheckCircle2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/auth/auth-provider';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user, role, loading: authLoading } = useAuth();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isApplyOpen, setIsApplyOpen] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user && role === 'alumni') {
            router.push('/alumni/dashboard');
            return;
        }

        const fetchJob = async () => {
            const { data, error } = await supabase
                .from('jobs')
                .select(`
                    id, 
                    title, 
                    company_name, 
                    location_type, 
                    location_specifics, 
                    salary_min, 
                    salary_max, 
                    date_posted, 
                    link, 
                    requirements, 
                    application_requirements, 
                    babson_connection, 
                    posted_by, 
                    status, 
                    created_at,
                    profiles(company_name, full_name)
                `)
                .eq('id', id)
                .single();

            if (data) setJob(data);
            setLoading(false);
        };

        fetchJob();
    }, [id, supabase]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
                <Skeleton className="h-8 w-32" />
                <div className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
                <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-md">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="text-6xl"
                    >
                        😞
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-slate-100">Job Not Found</h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            This job posting may have been removed or doesn't exist anymore.
                        </p>
                    </div>
                    <Link href="/">
                        <Button className="bg-babson-green-700 hover:bg-babson-green-800 text-white shadow-lg">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Search
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    <Link href="/" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-babson-green-700 dark:hover:text-babson-green-400 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Search
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div>
                            <h1 className="font-heading text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">{job.title}</h1>
                            <div className="flex items-center gap-2 text-lg text-slate-600 dark:text-slate-300 mb-4">
                                <Building2 className="w-5 h-5" />
                                <span className="font-medium">{job.company_name}</span>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                                {job.location_type && (
                                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                        <MapPin className="w-4 h-4" />
                                        {job.location_type}
                                    </div>
                                )}
                                {(job.salary_min || job.salary_max) && (
                                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                        <DollarSign className="w-4 h-4" />
                                        {job.salary_min?.toLocaleString()} - {job.salary_max?.toLocaleString()}
                                    </div>
                                )}
                                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    <Calendar className="w-4 h-4" />
                                    Posted {new Date(job.date_posted).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {job.link && (
                                <a href={job.link} target="_blank" rel="noopener noreferrer">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-2 border-babson-green-700 text-babson-green-700 hover:bg-babson-green-50 px-6"
                                    >
                                        <Globe className="w-4 h-4 mr-2" />
                                        Apply on Company Site
                                    </Button>
                                </a>
                            )}
                            <Button
                                size="lg"
                                className="bg-babson-green-700 hover:bg-babson-green-800 text-white shadow-xl shadow-green-700/20 px-8"
                                onClick={() => setIsApplyOpen(true)}
                            >
                                Quick Apply
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h2 className="font-heading text-xl font-bold mb-4">About the Role</h2>
                        <div className="prose prose-slate max-w-none">
                            {/* Since we don't have a description field in the schema provided in prompt, I'll assume requirements or add a description if I missed it. 
                  Wait, schema has `requirements text[]`. It doesn't have a long description field! 
                  The prompt schema: `requirements text[]`, `location_specifics text`.
                  I'll use requirements.
              */}
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                {job.location_specifics || "No specific description provided."}
                            </p>

                            <h3 className="font-bold text-lg mb-3 dark:text-slate-100">Requirements</h3>
                            <ul className="space-y-2">
                                {job.requirements?.map((req: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                        <CheckCircle2 className="w-5 h-5 text-babson-green-600 shrink-0 mt-0.5" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    {job.application_requirements && (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="font-heading font-bold mb-4 dark:text-slate-100">Application Requirements</h3>
                            <div className="space-y-3">
                                {Object.entries(job.application_requirements).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        {value ? (
                                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                                        )}
                                        <span className="text-slate-600 dark:text-slate-300 capitalize">{key.replace('_', ' ')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="font-heading font-bold mb-4 dark:text-slate-100">Job Overview</h3>
                        <div className="space-y-4">
                            {job.link && (
                                <div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Official Link</div>
                                    <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-babson-green-700 dark:text-babson-green-400 hover:underline flex items-center gap-1">
                                        <Globe className="w-4 h-4" />
                                        Visit Website
                                    </a>
                                </div>
                            )}
                            {job.babson_connection && (
                                <div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Babson Connection</div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{job.babson_connection}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ApplyModal
                jobId={job.id}
                jobTitle={job.title}
                isOpen={isApplyOpen}
                onClose={() => setIsApplyOpen(false)}
            />
        </div>
    );
}

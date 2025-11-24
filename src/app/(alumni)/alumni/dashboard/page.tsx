'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Plus, Users, Briefcase, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AlumniDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [jobs, setJobs] = useState<any[]>([]);
    const [stats, setStats] = useState({ activeJobs: 0, totalApplications: 0, views: 0 });
    const [dataLoading, setDataLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return;

            if (!user) {
                setDataLoading(false);
                return;
            }

            // Fetch jobs posted by alumni
            console.log('Fetching jobs for user:', user.id);
            const { data: jobsData, error } = await supabase
                .from('jobs')
                .select('id, title, company_name, date_posted, status, applications(count)')
                .eq('posted_by', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching jobs:', error);
            } else {
                console.log('Jobs fetched:', jobsData?.length);
            }

            if (jobsData) {
                setJobs(jobsData);

                const totalApps = jobsData.reduce((acc, job) => acc + (job.applications?.[0]?.count || 0), 0);
                setStats({
                    activeJobs: jobsData.filter(j => j.status === 'active').length,
                    totalApplications: totalApps,
                    views: 124, // Mock data for views since we don't track it yet
                });
            }
            setDataLoading(false);
        };

        fetchData();
    }, [user, authLoading, supabase]);

    if (authLoading || dataLoading) {
        return <div className="container mx-auto px-4 py-12"><Skeleton className="h-96 w-full" /></div>;
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-slate-900">Alumni Dashboard</h1>
                    <p className="text-slate-500">Manage your job postings and view applicants</p>
                </div>
                <Link href="/alumni/jobs/new">
                    <Button className="bg-babson-green-700 hover:bg-babson-green-800 text-white shadow-lg shadow-green-700/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Post New Job
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeJobs}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                        <Users className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalApplications}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.views}</div>
                    </CardContent>
                </Card>
            </div>

            <h2 className="font-heading text-xl font-bold mb-6">Your Job Postings</h2>
            <div className="grid gap-6">
                {jobs.map((job) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Card className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
                                    <div className="text-sm text-slate-500 flex gap-4 mt-1">
                                        <span>{job.company_name}</span>
                                        <span>•</span>
                                        <span>Posted {new Date(job.date_posted).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span className={`capitalize ${job.status === 'active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                            {job.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-center px-4">
                                        <div className="text-2xl font-bold text-slate-900">{job.applications?.[0]?.count || 0}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wider">Applicants</div>
                                    </div>
                                    <Link href={`/alumni/jobs/${job.id}`}>
                                        <Button variant="outline" className="border-slate-200 hover:bg-slate-50">
                                            Manage
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
                {jobs.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500 mb-4">You haven't posted any jobs yet.</p>
                        <Link href="/alumni/jobs/new">
                            <Button variant="outline">Post your first job</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

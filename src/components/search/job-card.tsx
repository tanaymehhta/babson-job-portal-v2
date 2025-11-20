'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from 'lucide-react'; // Wait, Badge is a component usually, not an icon. I'll use a div for badge or import from lucide if it exists (it doesn't).
// I'll make a simple Badge component inline or just use div classes.
import { MapPin, Building2, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Job {
    id: string;
    title: string;
    company_name: string;
    similarity?: number;
    location_type?: string;
    salary_min?: number;
    salary_max?: number;
}

interface JobCardProps {
    job: Job;
    index: number;
}

export function JobCard({ job, index }: JobCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
        >
            <Card className="h-full flex flex-col hover:shadow-2xl hover:shadow-babson-green-900/10 transition-all duration-300 border-white/60 bg-white/80">
                <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <CardTitle className="text-xl mb-1 text-babson-green-900">{job.title}</CardTitle>
                            <div className="flex items-center text-slate-500 text-sm">
                                <Building2 className="w-4 h-4 mr-1" />
                                {job.company_name}
                            </div>
                        </div>
                        {job.similarity && (
                            <div className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                                {Math.round(job.similarity * 100)}% Match
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {job.location_type && (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                <MapPin className="w-3 h-3 mr-1" />
                                {job.location_type}
                            </div>
                        )}
                        {(job.salary_min || job.salary_max) && (
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                <DollarSign className="w-3 h-3 mr-1" />
                                {job.salary_min ? `$${job.salary_min.toLocaleString()}` : ''}
                                {job.salary_min && job.salary_max ? ' - ' : ''}
                                {job.salary_max ? `$${job.salary_max.toLocaleString()}` : ''}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Link href={`/jobs/${job.id}`} className="w-full">
                        <Button className="w-full bg-white border-2 border-babson-green-100 hover:border-babson-green-500 text-babson-green-700 hover:bg-babson-green-50 group">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

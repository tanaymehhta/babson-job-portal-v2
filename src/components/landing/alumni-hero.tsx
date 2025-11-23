'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Users } from 'lucide-react';
import Link from 'next/link';

export function AlumniHero() {
    return (
        <div className="relative w-full max-w-4xl mx-auto px-4 h-full flex items-center -mt-16">
            <div className="text-center space-y-8 w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-babson-green-50 text-babson-green-700 text-sm font-medium mb-4"
                >
                    <Users className="w-4 h-4" />
                    For Babson Alumni
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-slate-900"
                >
                    Hire the next generation of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-babson-green-700 to-teal-600">
                        Babson leaders
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-slate-600 max-w-2xl mx-auto"
                >
                    Post jobs, track applicants, and connect with top talent from the #1 school for entrepreneurship.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                >
                    <Link href="/login?role=alumni">
                        <Button size="lg" className="h-14 px-8 text-lg rounded-xl bg-babson-green-700 hover:bg-babson-green-800 shadow-lg shadow-green-900/20">
                            <Briefcase className="w-5 h-5 mr-2" />
                            Post a Job
                        </Button>
                    </Link>
                    <Link href="/login?role=alumni">
                        <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700">
                            Alumni Login
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

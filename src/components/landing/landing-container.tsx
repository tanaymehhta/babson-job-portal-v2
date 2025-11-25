'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentHero } from './student-hero';
import { AlumniHero } from './alumni-hero';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LandingContainer() {
    const [viewMode, setViewMode] = useState<'student' | 'alumni'>('student');
    const router = useRouter();

    const toggleView = () => {
        setViewMode((prev) => (prev === 'student' ? 'alumni' : 'student'));
    };

    const handleSearch = (query: string) => {
        // Redirect to login on search attempt
        // We can pass the query as a param if we want to pre-fill it later
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        router.push(`/login?${params.toString()}`);
    };

    // Animation variants
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    };

    // Determine direction: 1 for sliding right (Student -> Alumni), -1 for sliding left (Alumni -> Student)
    // Wait, "move to the left to make space for alumni" means:
    // Student is visible. Click Alumni. Student moves Left (-100%), Alumni enters from Right (100%).
    // So direction should be 1 if going to Alumni?
    // Let's define direction based on target view.
    // If target is Alumni (index 1), and current is Student (index 0), direction is 1.
    const direction = viewMode === 'alumni' ? 1 : -1;

    return (
        <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden flex flex-col">
            {/* Toggle Button */}
            <div className="absolute top-4 right-4 z-50">
                <Button
                    variant="outline"
                    onClick={toggleView}
                    className="rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-sm hover:bg-white dark:hover:bg-slate-800"
                >
                    {viewMode === 'student' ? (
                        <>
                            <Users className="w-4 h-4 mr-2" />
                            Switch to Alumni
                        </>
                    ) : (
                        <>
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Switch to Student
                        </>
                    )}
                </Button>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative container mx-auto">
                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                    {viewMode === 'student' ? (
                        <motion.div
                            key="student"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <StudentHero onSearch={handleSearch} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="alumni"
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <AlumniHero />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

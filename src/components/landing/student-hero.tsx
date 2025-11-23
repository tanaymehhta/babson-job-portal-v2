'use client';

import { motion } from 'framer-motion';
import { SearchBar } from '@/components/search/search-bar';
import { AnimatedSparkle } from '@/components/hero/animated-sparkle';

interface StudentHeroProps {
    onSearch: (query: string) => void;
}

export function StudentHero({ onSearch }: StudentHeroProps) {
    return (
        <div className="relative w-full max-w-4xl mx-auto px-4 h-full flex items-center -mt-16">
            <AnimatedSparkle />

            <div className="text-center space-y-8 w-full">
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
                    className="text-xl text-slate-600 max-w-2xl mx-auto"
                >
                    Use natural language to search for jobs, internships, and events tailored for Babson students.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full"
                >
                    <SearchBar onSearch={onSearch} isLoading={false} />
                </motion.div>
            </div>
        </div>
    );
}

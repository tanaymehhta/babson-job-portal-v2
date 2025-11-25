'use client';

import { useState } from 'react';

// I haven't created dialog component yet. I should create it or use a simple modal.
// Given the "Visually Stunning" requirement, a nice modal is important.
// I'll implement a custom modal using Framer Motion since I don't have the full shadcn/ui library installed and don't want to bloat with uninstalled deps.
// Actually, I can just build a modal component in `src/components/ui/modal.tsx`.

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // I might need a Textarea
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ApplyModalProps {
    jobId: string;
    jobTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ApplyModal({ jobId, jobTitle, isOpen, onClose }: ApplyModalProps) {
    const [coverNote, setCoverNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('You must be logged in to apply');

            const { error } = await supabase
                .from('applications')
                .insert({
                    job_id: jobId,
                    student_id: user.id,
                    cover_note: coverNote,
                    status: 'pending'
                });

            if (error) throw error;

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                // Reset state after closing
                setTimeout(() => {
                    setIsSuccess(false);
                    setCoverNote('');
                }, 300);
            }, 2000);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden">
                            {isSuccess ? (
                                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-2"
                                    >
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </motion.div>
                                    <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-slate-100">Application Sent!</h2>
                                    <p className="text-slate-500 dark:text-slate-400">Good luck! The poster will be notified.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                        <div>
                                            <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-slate-100">Apply for {jobTitle}</h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Share why you're a great fit</p>
                                        </div>
                                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cover Note</label>
                                            <textarea
                                                value={coverNote}
                                                onChange={(e) => setCoverNote(e.target.value)}
                                                className="w-full min-h-[150px] rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-babson-green-500/50 transition-all resize-none"
                                                placeholder="I am interested in this role because..."
                                                required
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button type="button" variant="ghost" onClick={onClose}>
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-babson-green-700 hover:bg-babson-green-800 text-white"
                                                isLoading={loading}
                                            >
                                                Submit Application
                                            </Button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

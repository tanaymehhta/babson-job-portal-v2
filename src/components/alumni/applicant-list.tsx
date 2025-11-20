'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin, FileText, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

interface Application {
    id: string;
    status: string;
    cover_note: string;
    created_at: string;
    student: {
        full_name: string;
        email: string;
        linkedin_url: string;
        resume_text: string;
    };
}

interface ApplicantListProps {
    applications: Application[];
}

export function ApplicantList({ applications: initialApplications }: ApplicantListProps) {
    const [applications, setApplications] = useState(initialApplications);
    const supabase = createClient();

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('applications')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            setApplications(apps =>
                apps.map(app => app.id === id ? { ...app, status: newStatus } : app)
            );
            toast.success(`Application ${newStatus}`);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (applications.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500">No applications received yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {applications.map((app, index) => (
                <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{app.student.full_name}</h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mt-1">
                                            <a href={`mailto:${app.student.email}`} className="flex items-center hover:text-babson-green-700">
                                                <Mail className="w-4 h-4 mr-1" />
                                                {app.student.email}
                                            </a>
                                            {app.student.linkedin_url && (
                                                <a href={app.student.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-babson-green-700">
                                                    <Linkedin className="w-4 h-4 mr-1" />
                                                    LinkedIn Profile
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <h4 className="text-sm font-medium text-slate-900 mb-2">Cover Note</h4>
                                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{app.cover_note}</p>
                                    </div>

                                    {app.student.resume_text && (
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <FileText className="w-4 h-4" />
                                            <span className="truncate max-w-md">Resume available in profile</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 min-w-[140px]">
                                    <div className={`text-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2
                    ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            app.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                                        {app.status}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-emerald-200 hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800"
                                            onClick={() => updateStatus(app.id, 'accepted')}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-red-200 hover:bg-red-50 text-red-700 hover:text-red-800"
                                            onClick={() => updateStatus(app.id, 'rejected')}
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}

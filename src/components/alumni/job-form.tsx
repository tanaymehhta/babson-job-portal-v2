'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function JobForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const [formData, setFormData] = useState({
        title: '',
        company_name: '',
        location_type: 'Onsite',
        location_specifics: '',
        requirements: '', // Will split by newline
        application_requirements: {
            resume: true,
            cover_letter: false,
            transcript: false,
            portfolio: false,
            references: false,
            writing_sample: false
        },
        salary_min: '',
        salary_max: '',
        babson_connection: '',
        link: '',
    });

    const handleRequirementChange = (key: keyof typeof formData.application_requirements) => {
        setFormData(prev => ({
            ...prev,
            application_requirements: {
                ...prev.application_requirements,
                [key]: !prev.application_requirements[key]
            }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Insert job immediately without waiting for embedding
            const { data: insertedJob, error } = await supabase.from('jobs').insert({
                title: formData.title,
                company_name: formData.company_name,
                location_type: formData.location_type,
                location_specifics: formData.location_specifics,
                requirements: formData.requirements.split('\n').filter(line => line.trim()),
                application_requirements: formData.application_requirements,
                salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
                salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
                babson_connection: formData.babson_connection,
                link: formData.link,
                posted_by: user.id,
                embedding: null, // Will be generated in background
                status: 'active'
            }).select('id, title, company_name, location_type, location_specifics, requirements');

            if (error) throw error;

            // Generate embedding in the background (fire-and-forget)
            if (insertedJob && insertedJob[0]?.id) {
                const jobId = insertedJob[0].id;
                const descriptionForEmbedding = `${formData.title} ${formData.company_name} ${formData.location_type} ${formData.location_specifics} ${formData.requirements}`;

                // Fire-and-forget: generate embedding asynchronously
                fetch('/api/generate-embedding', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: descriptionForEmbedding,
                        jobId: jobId
                    })
                }).catch(err => {
                    console.warn('Background embedding generation failed:', err);
                });
            }

            toast.success('Job posted successfully!');
            router.push('/alumni/dashboard');
        } catch (error: any) {
            console.error('Error posting job:', error);
            toast.error(error.message || 'Failed to post job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Job Title</label>
                            <Input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Product Manager"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Company Name</label>
                            <Input
                                required
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Location Type</label>
                            <select
                                className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-babson-green-500"
                                value={formData.location_type}
                                onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
                            >
                                <option value="Onsite">Onsite</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Virtual">Virtual</option>
                                <option value="On Campus">On Campus</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Location Specifics</label>
                            <Input
                                value={formData.location_specifics}
                                onChange={(e) => setFormData({ ...formData, location_specifics: e.target.value })}
                                placeholder="e.g. Boston, MA or Remote"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-slate-300">Requirements (one per line)</label>
                        <textarea
                            className="w-full min-h-[150px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-babson-green-500"
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            placeholder="- 3+ years of experience&#10;- React knowledge&#10;- Strong communication skills"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-slate-300">Application Requirements</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/30">
                            {Object.entries(formData.application_requirements).map(([key, value]) => (
                                <label key={key} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={() => handleRequirementChange(key as keyof typeof formData.application_requirements)}
                                        className="w-4 h-4 text-babson-green-600 rounded border-gray-300 focus:ring-babson-green-500"
                                    />
                                    <span className="text-sm capitalize dark:text-slate-300">{key.replace('_', ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Additional Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Min Salary ($)</label>
                            <Input
                                type="number"
                                value={formData.salary_min}
                                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300">Max Salary ($)</label>
                            <Input
                                type="number"
                                value={formData.salary_max}
                                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-slate-300">Babson Connection (Optional)</label>
                        <Input
                            value={formData.babson_connection}
                            onChange={(e) => setFormData({ ...formData, babson_connection: e.target.value })}
                            placeholder="e.g. Hiring manager is a '15 alum"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-slate-300">Application Link (Optional)</label>
                        <Input
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button
                    type="submit"
                    size="lg"
                    className="bg-babson-green-700 hover:bg-babson-green-800 text-white"
                    isLoading={loading}
                >
                    Post Job
                </Button>
            </div>
        </form>
    );
}

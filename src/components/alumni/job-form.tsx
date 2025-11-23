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
        salary_min: '',
        salary_max: '',
        babson_connection: '',
        link: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // Generate embedding via API route (we need a new route for this or reuse search but that's for query)
            // Actually, we should probably generate embedding on the server side or via an edge function.
            // For now, I'll create a simple API route to generate embedding for job description.

            const descriptionForEmbedding = `${formData.title} ${formData.company_name} ${formData.location_type} ${formData.location_specifics} ${formData.requirements}`;



            let embedding = null;
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

                const embRes = await fetch('/api/generate-embedding', {
                    method: 'POST',
                    body: JSON.stringify({ text: descriptionForEmbedding }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (embRes.ok) {
                    const embData = await embRes.json();
                    embedding = embData.embedding;
                }
            } catch (e) {
                console.warn("Embedding generation failed or timed out, proceeding without it.", e);
                // Proceed without embedding
            }

            const { error } = await supabase.from('jobs').insert({
                title: formData.title,
                company_name: formData.company_name,
                location_type: formData.location_type,
                location_specifics: formData.location_specifics,
                requirements: formData.requirements.split('\n').filter(line => line.trim()),
                salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
                salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
                babson_connection: formData.babson_connection,
                link: formData.link,
                posted_by: user.id,
                embedding: embedding,
                status: 'active'
            });

            if (error) throw error;

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
                            <label className="text-sm font-medium">Job Title</label>
                            <Input
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Product Manager"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Company Name</label>
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
                            <label className="text-sm font-medium">Location Type</label>
                            <select
                                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-babson-green-500"
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
                            <label className="text-sm font-medium">Location Specifics</label>
                            <Input
                                value={formData.location_specifics}
                                onChange={(e) => setFormData({ ...formData, location_specifics: e.target.value })}
                                placeholder="e.g. Boston, MA or Remote"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Requirements (one per line)</label>
                        <textarea
                            className="w-full min-h-[150px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            placeholder="- 3+ years of experience&#10;- React knowledge&#10;- Strong communication skills"
                        />
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
                            <label className="text-sm font-medium">Min Salary ($)</label>
                            <Input
                                type="number"
                                value={formData.salary_min}
                                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Salary ($)</label>
                            <Input
                                type="number"
                                value={formData.salary_max}
                                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Babson Connection (Optional)</label>
                        <Input
                            value={formData.babson_connection}
                            onChange={(e) => setFormData({ ...formData, babson_connection: e.target.value })}
                            placeholder="e.g. Hiring manager is a '15 alum"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Application Link (Optional)</label>
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

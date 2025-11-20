'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { User, Mail, FileText, Linkedin } from 'lucide-react';

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                setProfile(data);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [supabase]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    bio: profile.bio,
                    linkedin_url: profile.linkedin_url,
                    resume_text: profile.resume_text,
                })
                .eq('id', profile.id);

            if (error) throw error;
            toast.success('Profile updated successfully');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!profile) return <div className="p-8">Please log in</div>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="font-heading text-3xl font-bold mb-8">Your Profile</h1>

            <form onSubmit={handleSave} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    value={profile.full_name || ''}
                                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input value={profile.email || ''} disabled className="bg-slate-50" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bio</label>
                            <textarea
                                className="w-full min-h-[100px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                value={profile.bio || ''}
                                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Professional Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">LinkedIn URL</label>
                            <div className="relative">
                                <Linkedin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <Input
                                    className="pl-10"
                                    value={profile.linkedin_url || ''}
                                    onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Resume Text (for AI matching)</label>
                            <textarea
                                className="w-full min-h-[200px] rounded-xl border border-slate-200 px-3 py-2 text-sm"
                                value={profile.resume_text || ''}
                                onChange={(e) => setProfile({ ...profile, resume_text: e.target.value })}
                                placeholder="Paste your resume text here to improve job matching..."
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        className="bg-babson-green-700 hover:bg-babson-green-800 text-white"
                        isLoading={saving}
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}

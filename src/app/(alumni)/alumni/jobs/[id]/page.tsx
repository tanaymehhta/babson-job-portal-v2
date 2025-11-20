import { createClient } from '@/lib/supabase/server';
import { ApplicantList } from '@/components/alumni/applicant-list';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return notFound();

    const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('posted_by', user.id)
        .single();

    if (!job) return notFound();

    // Fetch applications with student details
    // Note: Supabase join syntax is tricky with nested relations.
    // We need to join applications -> student_id (profiles)
    const { data: applications } = await supabase
        .from('applications')
        .select(`
      id,
      status,
      cover_note,
      created_at,
      student:student_id (
        full_name,
        email,
        linkedin_url,
        resume_text
      )
    `)
        .eq('job_id', id)
        .order('created_at', { ascending: false });

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl">
            <Link href="/alumni/dashboard" className="inline-flex items-center text-slate-500 hover:text-babson-green-700 mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold text-slate-900 mb-2">Applications for {job.title}</h1>
                <p className="text-slate-500">Review and manage candidates</p>
            </div>

            <ApplicantList applications={applications as any || []} />
        </div>
    );
}

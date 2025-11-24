'use server';

import { createClient } from '@/lib/supabase/server';
import { CreateJobApplicationDTO, JobApplication, UpdateJobApplicationDTO } from '@/types/job-application';
import { revalidatePath } from 'next/cache';

export async function getApplications(): Promise<{ data: JobApplication[] | null; error: string | null }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching applications:', error);
        return { data: null, error: error.message };
    }

    return { data, error: null };
}

export async function createApplication(application: CreateJobApplicationDTO): Promise<{ data: JobApplication | null; error: string | null }> {
    const supabase = await createClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
        .from('job_applications')
        .insert({
            ...application,
            user_id: user.id
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating application:', error);
        return { data: null, error: error.message };
    }

    revalidatePath('/applications');
    return { data, error: null };
}

export async function updateApplication(id: string, application: UpdateJobApplicationDTO): Promise<{ data: JobApplication | null; error: string | null }> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('job_applications')
        .update(application)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating application:', error);
        return { data: null, error: error.message };
    }

    revalidatePath('/applications');
    return { data, error: null };
}

export async function deleteApplication(id: string): Promise<{ error: string | null }> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting application:', error);
        return { error: error.message };
    }

    revalidatePath('/applications');
    return { error: null };
}

import { JobForm } from '@/components/alumni/job-form';

export default function NewJobPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="font-heading text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">Post a New Job</h1>
            <JobForm />
        </div>
    );
}

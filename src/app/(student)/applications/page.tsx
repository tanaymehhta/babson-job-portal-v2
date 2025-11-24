import { getApplications } from './actions';
import { JobApplicationsTable } from '@/components/applications/job-applications-table';
import { JobApplicationDialog } from '@/components/applications/job-application-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function ApplicationsPage() {
    const { data: applications, error } = await getApplications();

    if (error) {
        return (
            <div className="container mx-auto py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
                    <p className="text-muted-foreground mt-2">
                        Track and manage your job search progress.
                    </p>
                </div>
                <JobApplicationDialog />
            </div>

            <JobApplicationsTable applications={applications || []} />
        </div>
    );
}

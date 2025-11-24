'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { JobApplicationForm } from './job-application-form';
import { useState } from 'react';
import { JobApplication } from '@/types/job-application';
import { Plus, Pencil } from 'lucide-react';

interface JobApplicationDialogProps {
    application?: JobApplication;
    trigger?: React.ReactNode;
}

export function JobApplicationDialog({ application, trigger }: JobApplicationDialogProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Application
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{application ? 'Edit Application' : 'Add New Application'}</DialogTitle>
                    <DialogDescription>
                        {application
                            ? 'Update the details of your job application.'
                            : 'Track a new job application.'}
                    </DialogDescription>
                </DialogHeader>
                <JobApplicationForm
                    application={application}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

'use client';

import { JobApplication } from '@/types/job-application';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { StatusBadge } from './status-badge';
import { JobApplicationDialog } from './job-application-dialog';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { deleteApplication } from '@/app/(student)/applications/actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface JobApplicationsTableProps {
    applications: JobApplication[];
}

export function JobApplicationsTable({ applications: initialApplications }: JobApplicationsTableProps) {
    const [applications, setApplications] = useState(initialApplications);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Update local state when props change (e.g. after revalidation)
    if (initialApplications !== applications) {
        // This might cause infinite loop if not careful, but usually fine if reference changes.
        // Better to just use initialApplications and filter in render, 
        // but we want optimistic UI for delete? 
        // Actually, revalidatePath in action will trigger a server re-render, 
        // passing new props. So we should just use props.
    }

    // Filtered applications
    const filteredApplications = initialApplications.filter((app) => {
        const matchesSearch =
            app.role.toLowerCase().includes(search.toLowerCase()) ||
            app.company.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this application?')) return;

        const result = await deleteApplication(id);
        if (result.error) {
            toast.error(result.error);
        } else {
            toast.success('Application deleted');
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Input
                    placeholder="Search role or company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="saved">Saved</SelectItem>
                        <SelectItem value="preparing">Preparing</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="interview_round_1">Interview</SelectItem>
                        <SelectItem value="offer_received">Offer</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        {/* Add more if needed */}
                    </SelectContent>
                </Select>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Role</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Applied</TableHead>
                            <TableHead>Next Steps</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredApplications.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No applications found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredApplications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{app.role}</span>
                                            {app.link && (
                                                <a
                                                    href={app.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-500 hover:underline inline-flex items-center"
                                                >
                                                    View Posting <ExternalLink className="ml-1 h-3 w-3" />
                                                </a>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>{app.company}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={app.status} />
                                    </TableCell>
                                    <TableCell>
                                        {app.date_applied ? new Date(app.date_applied).toLocaleDateString() : '-'}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={app.next_steps || ''}>
                                        {app.next_steps || '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <JobApplicationDialog
                                                application={app}
                                                trigger={
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                }
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(app.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

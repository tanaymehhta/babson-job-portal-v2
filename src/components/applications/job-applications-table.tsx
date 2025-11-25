'use client';

import { JobApplication } from '@/types/job-application';
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

function CompanyAvatar({ company }: { company: string }) {
    const getInitials = (name: string) => {
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const getColorFromString = (str: string) => {
        const colors = [
            'bg-red-500',
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-teal-500',
            'bg-orange-500',
            'bg-cyan-500',
        ];
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className={`w-10 h-10 rounded-lg ${getColorFromString(company)} flex items-center justify-center text-white font-semibold text-sm`}>
            {getInitials(company)}
        </div>
    );
}

export function JobApplicationsTable({ applications: initialApplications }: JobApplicationsTableProps) {
    const [applications, setApplications] = useState(initialApplications);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

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
                    </SelectContent>
                </Select>
            </div>

            {/* Header Row */}
            <div className="grid grid-cols-[60px_2fr_2fr_1.5fr_1.5fr_1.5fr_120px] gap-4 px-6 py-3 text-sm font-medium text-muted-foreground">
                <div></div>
                <div>Role</div>
                <div>Company</div>
                <div>Status</div>
                <div>Date Applied</div>
                <div>Next Steps</div>
                <div className="text-right">Actions</div>
            </div>

            {/* Application Cards */}
            <div className="space-y-3">
                {filteredApplications.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-8 text-center text-muted-foreground">
                        No applications found.
                    </div>
                ) : (
                    filteredApplications.map((app) => (
                        <div
                            key={app.id}
                            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                        >
                            <div className="grid grid-cols-[60px_2fr_2fr_1.5fr_1.5fr_1.5fr_120px] gap-4 px-6 py-4 items-center">
                                <div className="flex items-center">
                                    <CompanyAvatar company={app.company} />
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-900 dark:text-slate-100">{app.role}</span>
                                    {app.link && (
                                        <a
                                            href={app.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1 mt-1"
                                        >
                                            View Posting <ExternalLink className="h-3 w-3" />
                                        </a>
                                    )}
                                </div>

                                <div className="text-gray-700 dark:text-slate-300">{app.company}</div>

                                <div>
                                    <StatusBadge status={app.status} />
                                </div>

                                <div className="text-gray-600 dark:text-slate-400 text-sm">
                                    {app.date_applied ? new Date(app.date_applied).toLocaleDateString() : '-'}
                                </div>

                                <div className="text-gray-600 dark:text-slate-400 text-sm truncate" title={app.next_steps || ''}>
                                    {app.next_steps || '-'}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <JobApplicationDialog
                                        application={app}
                                        trigger={
                                            <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-slate-700">
                                                <Pencil className="h-4 w-4 text-gray-600 dark:text-slate-400" />
                                            </Button>
                                        }
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        onClick={() => handleDelete(app.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

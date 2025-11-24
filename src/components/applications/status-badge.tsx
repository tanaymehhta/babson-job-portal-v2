import { ApplicationStatus } from '@/types/job-application';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: ApplicationStatus;
    className?: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
    saved: { label: 'Saved', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    preparing: { label: 'Preparing', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    applied: { label: 'Applied', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    interview_round_1: { label: 'Round 1', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    interview_round_2: { label: 'Round 2', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    interview_round_3: { label: 'Round 3', color: 'bg-orange-50 text-orange-700 border-orange-200' },
    interview_final: { label: 'Final Round', color: 'bg-orange-100 text-orange-800 border-orange-300' },
    offer_received: { label: 'Offer Received', color: 'bg-green-100 text-green-700 border-green-200' },
    accepted: { label: 'Accepted', color: 'bg-green-600 text-white border-green-600' },
    rejected: { label: 'Rejected', color: 'bg-red-50 text-red-700 border-red-200' },
    withdrawn: { label: 'Withdrawn', color: 'bg-gray-50 text-gray-500 border-gray-200' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.saved;

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                config.color,
                className
            )}
        >
            {config.label}
        </span>
    );
}

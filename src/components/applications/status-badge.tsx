import { ApplicationStatus } from '@/types/job-application';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: ApplicationStatus;
    className?: string;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string }> = {
    saved: { label: 'Saved', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700' },
    preparing: { label: 'Preparing', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
    applied: { label: 'Applied', color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
    interview_round_1: { label: 'Round 1', color: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' },
    interview_round_2: { label: 'Round 2', color: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700' },
    interview_round_3: { label: 'Round 3', color: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800' },
    interview_final: { label: 'Final Round', color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700' },
    offer_received: { label: 'Offer Received', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' },
    accepted: { label: 'Accepted', color: 'bg-green-600 text-white border-green-600' },
    rejected: { label: 'Rejected', color: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
    withdrawn: { label: 'Withdrawn', color: 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700' },
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

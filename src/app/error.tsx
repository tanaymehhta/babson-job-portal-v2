'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="text-center space-y-6 max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-slate-900">Something went wrong!</h2>
                    <p className="text-slate-600">
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={reset}
                        className="bg-babson-green-700 hover:bg-babson-green-800"
                    >
                        Try again
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/'}
                    >
                        Go Home
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-slate-100 rounded-lg text-left overflow-auto max-h-48 text-xs font-mono text-slate-700">
                        <p className="font-bold mb-2">Error Details:</p>
                        {error.message}
                    </div>
                )}
            </div>
        </div>
    );
}

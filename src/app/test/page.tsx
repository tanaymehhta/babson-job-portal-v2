'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function TestPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSeed = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/seed');
            const data = await response.json();
            setResult(data);
            if (data.error) {
                toast.error(data.error);
            } else {
                toast.success('Data seeded successfully!');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-20">
            <h1 className="text-3xl font-bold mb-8">Test & Debug</h1>

            <div className="space-y-8">
                <div className="p-6 border rounded-lg bg-slate-50">
                    <h2 className="text-xl font-semibold mb-4">Seed Test Data</h2>
                    <p className="mb-4 text-slate-600">
                        Click this button to add sample jobs to the database.
                        <br />
                        <span className="font-bold text-red-500">
                            Requirement: You must be logged in as a VERIFIED ALUMNI account.
                        </span>
                    </p>
                    <Button onClick={handleSeed} disabled={loading}>
                        {loading ? 'Seeding...' : 'Seed Jobs'}
                    </Button>

                    {result && (
                        <pre className="mt-4 p-4 bg-slate-900 text-green-400 rounded overflow-auto text-xs">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    )}
                </div>
            </div>
        </div>
    );
}

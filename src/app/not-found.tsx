import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="text-center space-y-8 max-w-lg">
                <div className="space-y-2">
                    <h1 className="text-9xl font-bold text-babson-green-100">404</h1>
                    <h2 className="text-3xl font-bold text-slate-900">Page Not Found</h2>
                    <p className="text-xl text-slate-600">
                        Sorry, we couldn't find the page you're looking for.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button size="lg" className="bg-babson-green-700 hover:bg-babson-green-800 w-full sm:w-auto">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto">
                            <Search className="w-4 h-4 mr-2" />
                            Search Jobs
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

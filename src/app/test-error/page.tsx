'use client';

import { useEffect } from 'react';

export default function ErrorTestPage() {
    useEffect(() => {
        // Intentionally throw an error to test error boundary
        throw new Error('This is a test error to verify error.tsx is working correctly');
    }, []);

    return (
        <div>
            If you see this, the error boundary is NOT working.
        </div>
    );
}

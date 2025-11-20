export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-babson-green-500/5 rounded-full blur-3xl animate-float" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-emerald-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
            </div>
            <div className="w-full max-w-md space-y-8 relative z-10">
                {children}
            </div>
        </div>
    )
}

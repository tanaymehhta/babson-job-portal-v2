'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LogOut, User as UserIcon, Briefcase, LayoutDashboard } from 'lucide-react';

export function Navbar() {
    const { user, role, signOut, loading } = useAuth();

    if (loading) return null;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl shadow-sm"
        >
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-babson-green-600 to-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-green-500/20">
                        B
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tight text-slate-900">
                        Babson<span className="text-babson-green-700">Jobs</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            {role && (
                                <div className="hidden md:flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-600 mr-2">
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </div>
                            )}
                            {role === 'student' && (
                                <Link href="/profile">
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <UserIcon className="w-4 h-4" />
                                        Profile
                                    </Button>
                                </Link>
                            )}
                            {role === 'alumni' && (
                                <>
                                    <Link href="/alumni/dashboard">
                                        <Button variant="ghost" size="sm" className="gap-2">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                    <Link href="/alumni/jobs/new">
                                        <Button variant="outline" size="sm" className="gap-2 border-babson-green-200 text-babson-green-700 hover:bg-babson-green-50">
                                            <Briefcase className="w-4 h-4" />
                                            Post Job
                                        </Button>
                                    </Link>
                                </>
                            )}
                            <Button variant="ghost" size="sm" onClick={signOut} className="text-slate-500 hover:text-red-600">
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost">Log in</Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-babson-green-700 hover:bg-babson-green-800 text-white shadow-lg shadow-green-700/20">
                                    Sign up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </motion.nav>
    );
}

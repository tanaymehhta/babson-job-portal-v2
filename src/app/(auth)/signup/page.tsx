'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { User, GraduationCap } from 'lucide-react';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState<'student' | 'alumni'>('student');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                    },
                },
            });

            if (error) throw error;

            toast.success('Account created! Please check your email to verify your account.');
            router.push('/login');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="glass border-white/40 shadow-2xl shadow-babson-green-900/5">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-br from-babson-green-600 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-500/20 mb-4">
                        <User className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-3xl">Create Account</CardTitle>
                    <CardDescription>Join the exclusive Babson network</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div
                                onClick={() => setRole('student')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${role === 'student'
                                        ? 'border-babson-green-500 bg-babson-green-50/50 text-babson-green-700'
                                        : 'border-slate-100 hover:border-slate-200 text-slate-500'
                                    }`}
                            >
                                <GraduationCap className="w-6 h-6" />
                                <span className="font-medium text-sm">Student</span>
                            </div>
                            <div
                                onClick={() => setRole('alumni')}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${role === 'alumni'
                                        ? 'border-babson-green-500 bg-babson-green-50/50 text-babson-green-700'
                                        : 'border-slate-100 hover:border-slate-200 text-slate-500'
                                    }`}
                            >
                                <User className="w-6 h-6" />
                                <span className="font-medium text-sm">Alumni</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Input
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Babson Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-babson-green-700 hover:bg-babson-green-800 text-white shadow-lg shadow-green-700/20 h-12 text-base"
                            isLoading={loading}
                        >
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-babson-green-700 hover:underline font-medium">
                            Log in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </motion.div>
    );
}

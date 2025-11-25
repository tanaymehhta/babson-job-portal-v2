'use client';

import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    loading: boolean;
    role: 'student' | 'alumni' | 'admin' | null;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    role: null,
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<'student' | 'alumni' | 'admin' | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Memoize the supabase client to prevent re-creation on every render
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    // Fetch user role from profiles
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .single();

                    setRole(profile?.role as any ?? null);
                } else {
                    setRole(null);
                }

                setLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase]);

    // Memoize signOut function to maintain stable reference
    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        router.push('/');
    }, [supabase, router]);

    return (
        <AuthContext.Provider value={{ user, session, loading, role, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

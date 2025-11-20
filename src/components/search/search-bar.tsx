'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-babson-green-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Describe your dream job... (e.g., 'Marketing internship in Boston with a startup')"
                        className="h-14 pl-12 pr-32 rounded-2xl border-white/20 bg-white/90 backdrop-blur-xl shadow-xl text-lg placeholder:text-slate-400 focus-visible:ring-babson-green-500/50"
                    />
                    <Search className="absolute left-4 w-5 h-5 text-slate-400" />
                    <div className="absolute right-2">
                        <Button
                            type="submit"
                            size="sm"
                            className="h-10 bg-babson-green-700 hover:bg-babson-green-800 text-white shadow-lg shadow-green-700/20 rounded-xl px-6"
                            isLoading={isLoading}
                        >
                            {isLoading ? 'Searching...' : (
                                <>
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Search
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}

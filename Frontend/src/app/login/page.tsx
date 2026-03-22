'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (!data.success) {
                setError(data.message || 'Invalid credentials.');
                setLoading(false);
                return;
            }

            // Set Cookie logic
            document.cookie = `token=${data.data.token}; path=/; max-age=86400;`; // 1 day

            // Route mapping
            const roleRoutes: Record<string, string> = {
                'super_admin': '/admin',
                'ciso': '/ciso',
                'tenant_admin': '/tenant-admin',
                'content_creator': '/content-creator',
                'manager': '/manager',
                'employee': '/employee',
                'ngo_admin': '/ngo'
            };

            const userRole = data.data.user.role;
            const route = roleRoutes[userRole] || '/';
            
            router.push(route);
            router.refresh(); // Important for middleware refresh
        } catch (err: any) {
            setError('Network error: Unable to reach authentication server.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 tracking-tight">CyberShield CMS</h1>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Sign in to your account</h2>
                <p className="mt-2 text-center text-sm text-neutral-400">
                    Enterprise Cybersecurity Training & Phishing Sandbox
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-neutral-900 py-8 px-4 shadow-2xl shadow-cyan-900/20 sm:rounded-2xl sm:px-10 border border-neutral-800">
                    
                    {error && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm font-semibold animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 placeholder-neutral-500 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full appearance-none rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 placeholder-neutral-500 shadow-sm focus:border-cyan-500 focus:outline-none focus:ring-cyan-500 sm:text-sm text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-cyan-600 focus:ring-cyan-500" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-400">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-cyan-500 hover:text-cyan-400">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center rounded-lg border border-transparent bg-gradient-to-r from-cyan-600 to-blue-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 transition-all font-bold"
                            >
                                {loading ? 'Authenticating...' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-neutral-700" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-neutral-900 px-2 text-neutral-500">Or continue with SSO</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div>
                                <a href="#" className="inline-flex w-full justify-center rounded-md border border-neutral-700 bg-neutral-950 py-2 px-4 text-sm font-medium text-neutral-400 shadow-sm hover:bg-neutral-800 transition">
                                    <span className="sr-only">Sign in with OKTA</span>
                                    <span className="font-bold text-blue-500">OKTA</span>
                                </a>
                            </div>
                            <div>
                                <a href="#" className="inline-flex w-full justify-center rounded-md border border-neutral-700 bg-neutral-950 py-2 px-4 text-sm font-medium text-neutral-400 shadow-sm hover:bg-neutral-800 transition">
                                    <span className="sr-only">Sign in with Azure AD</span>
                                    <span className="font-bold text-blue-400">Azure AD</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

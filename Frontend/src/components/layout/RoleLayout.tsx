'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const roleTabs = [
    { label: 'Super Admin', href: '/admin', color: 'text-red-400' },
    { label: 'CISO', href: '/ciso', color: 'text-blue-400' },
    { label: 'Tenant Admin', href: '/tenant-admin', color: 'text-purple-400' },
    { label: 'Content Creator', href: '/content-creator', color: 'text-green-400' },
    { label: 'Manager', href: '/manager', color: 'text-yellow-400' },
    { label: 'Employee', href: '/employee', color: 'text-cyan-400' },
    { label: 'NGO Admin', href: '/ngo', color: 'text-orange-400' },
];

export interface NavSection {
    title: string;
    items: { label: string; href: string; icon: React.ReactNode }[];
}

interface RoleLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    accentColor: string; // tailwind color class like 'blue' | 'purple' | 'green' | 'yellow' | 'cyan' | 'orange'
    avatarText: string;
    avatarGradient: string;
    userName: string;
    userEmail: string;
    navSections: NavSection[];
    statusLabel?: string;
    statusValue?: string;
    statusDot?: string;
    currentRole: string;
    sidebarHeader?: React.ReactNode;
}

export default function RoleLayout({
    children,
    title,
    subtitle,
    accentColor,
    avatarText,
    avatarGradient,
    userName,
    userEmail,
    navSections,
    statusLabel = 'System Status',
    statusValue = 'All systems operational',
    statusDot = 'bg-green-400',
    currentRole,
    sidebarHeader,
}: RoleLayoutProps) {
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const accentActiveClass = `bg-${accentColor}-500/10 text-${accentColor}-300 border border-${accentColor}-500/20`;
    const accentDot = `bg-${accentColor}-400`;
    const accentRefreshClass = `bg-${accentColor}-600 hover:bg-${accentColor}-500 shadow-[0_0_12px_rgba(0,0,0,0.3)]`;

    return (
        <div className="flex flex-col h-screen bg-neutral-950 text-white overflow-hidden">

            {/* TOP NAV */}
            <header className="h-14 flex-shrink-0 flex items-center justify-between px-6 bg-black border-b border-neutral-800 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="text-neutral-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-neutral-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link href={`/${currentRole}`}>
                        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 cursor-pointer">CyberShield</span>
                    </Link>
                </div>

                {/* Role Tabs */}
                <nav className="hidden lg:flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                    {roleTabs.map(r => {
                        const isActive = pathname?.startsWith(r.href) ?? false;
                        return (
                            <Link key={r.href} href={r.href}>
                                <span className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all duration-200 whitespace-nowrap ${isActive ? `bg-neutral-800 ${r.color} shadow` : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'}`}>
                                    {r.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right */}
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
                            className="relative p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-black"></span>
                        </button>
                        {notifOpen && (
                            <div className="absolute right-0 top-10 w-80 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-neutral-800 flex justify-between">
                                    <p className="font-semibold text-sm">Notifications</p>
                                    <span className="text-xs text-blue-400">3 unread</span>
                                </div>
                                {[
                                    { icon: '📚', msg: 'New course assigned: Phishing Basics', time: '5m ago' },
                                    { icon: '🏆', msg: 'Certificate earned: Data Privacy', time: '2h ago' },
                                    { icon: '⚠️', msg: 'Training deadline in 3 days', time: '1d ago' },
                                ].map(n => (
                                    <div key={n.msg} className="px-4 py-3 border-b border-neutral-800 hover:bg-neutral-800 cursor-pointer transition-colors">
                                        <div className="flex gap-3"><span>{n.icon}</span>
                                            <div><p className="text-xs text-neutral-200">{n.msg}</p><p className="text-xs text-neutral-500 mt-0.5">{n.time}</p></div>
                                        </div>
                                    </div>
                                ))}
                                <div className="px-4 py-2 bg-neutral-900/50 hover:bg-neutral-800 transition-colors">
                                    <Link href={`/${currentRole === 'admin' ? 'admin' : currentRole}/notifications`}>
                                        <button className="w-full text-left text-xs text-blue-400 hover:text-blue-300 transition-colors">View all notifications</button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    <div className="relative">
                        <button onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
                            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors">
                            <div className={`h-7 w-7 rounded-full ${avatarGradient} flex items-center justify-center text-xs font-bold`}>{avatarText}</div>
                            <span className="text-sm font-medium text-white hidden sm:block">{userName}</span>
                            <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {userMenuOpen && (
                            <div className="absolute right-0 top-10 w-48 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-neutral-800">
                                    <p className="text-sm font-medium text-white">{userName}</p>
                                    <p className="text-xs text-neutral-400">{userEmail}</p>
                                </div>
                                <div className="py-1">
                                    <Link href="/admin/settings/accounts">
                                        <button className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">Profile</button>
                                    </Link>
                                    <Link href="/admin/settings">
                                        <button className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">Settings</button>
                                    </Link>
                                </div>
                                <div className="border-t border-neutral-800 py-1">
                                    <button
                                        onClick={() => {
                                            document.cookie = 'token=; Max-Age=0; path=/;';
                                            document.cookie = `token=; Max-Age=0; path=/; domain=${window.location.hostname};`;
                                            window.location.href = '/login';
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 transition-colors"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* BODY */}
            <div className="flex flex-1 overflow-hidden">
                {/* SIDEBAR */}
                <aside className={`${sidebarCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-56'} flex-shrink-0 bg-black border-r border-neutral-800 flex flex-col transition-all duration-300 overflow-y-auto`}>
                    <nav className="flex-1 py-3 px-2.5">
                        {sidebarHeader && (
                            <div className="mb-4">
                                {sidebarHeader}
                            </div>
                        )}
                        {navSections.map(section => (
                            <div key={section.title} className="mb-3">
                                <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest px-3 pt-3 pb-1.5">{section.title}</p>
                                {section.items.map(item => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link key={item.href} href={item.href}>
                                            <div className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${isActive ? accentActiveClass : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900 border border-transparent'}`}>
                                                <span className="text-sm">{item.icon}</span>
                                                <span className="text-xs font-medium">{item.label}</span>
                                                {isActive && <span className={`ml-auto w-1 h-1 rounded-full ${accentDot}`}></span>}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>
                    <div className="p-3 border-t border-neutral-800 flex-shrink-0">
                        <div className="border border-neutral-800 rounded-lg p-3 bg-neutral-900">
                            <p className="text-xs font-bold text-neutral-400">{statusLabel}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className={`w-2 h-2 rounded-full ${statusDot} animate-pulse`}></span>
                                <span className="text-xs text-neutral-500">{statusValue}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 overflow-y-auto bg-neutral-950">
                    <div className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-6 py-3 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-bold text-white">{title}</h2>
                            <p className="text-xs text-neutral-500">{subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg border border-neutral-700 transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export
                            </button>
                            <button className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium ${accentRefreshClass} text-white rounded-lg transition-colors`}>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>
                    <div className="p-6 space-y-6">{children}</div>
                </main>
            </div>
        </div>
    );
}

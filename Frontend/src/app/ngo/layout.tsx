'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import RoleLayout, { NavSection } from '@/components/layout/RoleLayout';

const I = ({ d }: { d: string }) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
    </svg>
);

const navSections: NavSection[] = [
    {
        title: 'ORGANISATION', items: [
            { label: 'Org Dashboard', href: '/ngo', icon: <I d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
            { label: 'Members', href: '/ngo/members', icon: <I d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /> },
            { label: 'Team Progress', href: '/ngo/progress', icon: <I d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
        ]
    },
    {
        title: 'TRAINING', items: [
            { label: 'Available Courses', href: '/ngo/courses', icon: <I d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
            { label: 'Certificates', href: '/ngo/certificates', icon: <I d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /> },
        ]
    },
    {
        title: 'REPORTS', items: [
            { label: 'Impact Report', href: '/ngo/reports/impact', icon: <I d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
            { label: 'Plan & Limits', href: '/ngo/reports/plan', icon: <I d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> },
        ]
    },
];

export default function NGOLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    let title = "Organisation Dashboard";
    let subtitle = "Community digital safety programme serving members across the region.";

    if (pathname.includes('/ngo/members')) { title = "Members"; subtitle = "All members in the training program."; }
    else if (pathname.includes('/ngo/progress')) { title = "Team Progress"; subtitle = "Course completion across all NGO members."; }
    else if (pathname.includes('/ngo/courses')) { title = "Available Courses"; subtitle = "Courses included in the NGO plan."; }
    else if (pathname.includes('/ngo/certificates')) { title = "Certificates"; subtitle = "Certificates issued to NGO members."; }
    else if (pathname.includes('/ngo/reports/impact')) { title = "Impact Report — Yearly"; subtitle = "Shareable report for donors and grant sponsors."; }
    else if (pathname.includes('/ngo/reports/plan')) { title = "Plan & Limits"; subtitle = "Manage your CyberShield NGO free tier plan."; }

    const freeTierPanel = (
        <div className="mx-3 mt-4 mb-2 p-3 bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 rounded-xl">
            <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1.5">NGO FREE TIER</p>
            <p className="text-xs font-semibold text-white truncate">SafeNet Uganda</p>
            <div className="mt-3">
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] text-neutral-400 font-medium">Seat usage</span>
                    <span className="text-[10px] text-white font-bold">42 / 50</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full" style={{ width: '84%' }}></div>
                </div>
            </div>
        </div>
    );

    return (
        <RoleLayout
            title={title}
            subtitle={subtitle}
            accentColor="orange"
            avatarText="SU"
            avatarGradient="bg-gradient-to-tr from-orange-500 to-yellow-400"
            userName="SafeNet Uganda"
            userEmail="admin@safenet.ug"
            navSections={navSections}
            sidebarHeader={freeTierPanel}
            statusLabel="System Status"
            statusValue="All systems operational"
            statusDot="bg-green-400"
            currentRole="ngo"
        >
            {children}
        </RoleLayout>
    );
}

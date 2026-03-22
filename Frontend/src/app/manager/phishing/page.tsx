'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import RoleLayout from '@/components/layout/RoleLayout';
import { managerNavSections } from '../page';

const METRICS = [
    { label: 'Team Click Rate', value: '22%', icon: '🖱️', color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Credential Submissions', value: '2', icon: '🔑', color: 'text-red-500', bg: 'bg-red-500/20' },
    { label: 'Report Rate', value: '17%', icon: '🛡️', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Campaigns Received', value: '3', icon: '📥', color: 'text-blue-400', bg: 'bg-blue-500/10' },
];

const PHISHING_DATA = [
    { id: 1, name: 'Dan Brown', c1: 'Clicked + Credentials', c2: 'Clicked', c3: 'Clicked', rr: '0%' },
    { id: 2, name: 'Mark Evans', c1: 'Clicked', c2: 'Not Clicked', c3: 'Not Clicked', rr: '33%' },
    { id: 3, name: 'Priya Mehta', c1: 'Not Clicked', c2: 'Clicked', c3: 'Not Clicked', rr: '33%' },
    { id: 4, name: 'James Lee', c1: 'Reported', c2: 'Not Clicked', c3: 'Reported', rr: '66%' },
    { id: 5, name: 'Yuki Tanaka', c1: 'Reported', c2: 'Reported', c3: 'Not Clicked', rr: '66%' },
    { id: 6, name: 'Alice Thompson', c1: 'Reported', c2: 'Reported', c3: 'Reported', rr: '100%' },
];

export default function PhishingResults() {
    return (
        <RoleLayout title="Team Phishing Results" subtitle="Performance and resilience across recent simulated phishing campaigns." accentColor="emerald" avatarText="M" avatarGradient="bg-gradient-to-tr from-emerald-500 to-teal-500" userName="Emily Davis" userEmail="emily.d@cybershield.com" navSections={managerNavSections.map(s => ({ ...s, items: s.items.map(i => ({ ...i, active: i.href === '/manager/phishing' })) }))} currentRole="manager">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">

                {/* Dashboard Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {METRICS.map((metric, i) => (
                        <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm hover:border-neutral-700 transition">
                            <div className="flex justify-between items-start mb-2">
                                <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${metric.bg} ${metric.color}`}>
                                    {metric.icon}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-neutral-400 mb-1">{metric.label}</p>
                            <div className="flex items-end gap-2">
                                <p className="text-2xl font-bold text-white">{metric.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col pt-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-neutral-950 text-neutral-500 border-b border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wider">Employee</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Q1 All Staff Campaign</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Finance BEC Campaign</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">CEO Deepfake Campaign</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Report Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {PHISHING_DATA.map(user => (
                                    <tr key={user.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{user.name}</td>

                                        {[user.c1, user.c2, user.c3].map((status, i) => (
                                            <td key={i} className="px-6 py-4">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${status === 'Clicked + Credentials' ? 'bg-red-500/10 text-red-500 border-red-500/30 animate-pulse' :
                                                        status.includes('Clicked') ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                                                            status === 'Reported' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                                                                'bg-neutral-800 text-neutral-400 border-neutral-700'
                                                    }`}>
                                                    {status === 'Reported' ? '🛡️ Reported' : status}
                                                </span>
                                            </td>
                                        ))}

                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold font-mono ${parseInt(user.rr) > 50 ? 'text-emerald-400' : parseInt(user.rr) === 0 ? 'text-red-400' : 'text-neutral-400'}`}>
                                                {user.rr}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </RoleLayout>
    );
}

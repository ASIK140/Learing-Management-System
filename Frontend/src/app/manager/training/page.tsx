'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import RoleLayout from '@/components/layout/RoleLayout';
import { managerNavSections } from '../page';

const TRAINING_DATA = [
    { id: 1, name: 'Alice Thompson', p1: '100%', g1: '100%', f1: '100%', total: '100%', overdue: 0, certs: 3 },
    { id: 2, name: 'Yuki Tanaka', p1: '100%', g1: '100%', f1: '45%', total: '82%', overdue: 0, certs: 2 },
    { id: 3, name: 'James Lee', p1: '100%', g1: '100%', f1: '34%', total: '78%', overdue: 0, certs: 2 },
    { id: 4, name: 'Priya Mehta', p1: '100%', g1: '82%', f1: '0%', total: '61%', overdue: 1, certs: 1 },
    { id: 5, name: 'Mark Evans', p1: '100%', g1: '0%', f1: '0%', total: '34%', overdue: 2, certs: 1 },
    { id: 6, name: 'Dan Brown', p1: 'Failed', g1: '0%', f1: '0%', total: '0%', overdue: 3, certs: 0 },
];

export default function TrainingStatus() {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    return (
        <RoleLayout title="Training Status" subtitle="Course completion and certification across all team members." accentColor="emerald" avatarText="M" avatarGradient="bg-gradient-to-tr from-emerald-500 to-teal-500" userName="Emily Davis" userEmail="emily.d@cybershield.com" navSections={managerNavSections.map(s => ({ ...s, items: s.items.map(i => ({ ...i, active: i.href === '/manager/training' })) }))} currentRole="manager">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">

                <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl text-emerald-400">📚</div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Course Completions</h2>
                            <p className="text-sm text-neutral-400">Track progress against compliance deadlines.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/manager/nudge" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
                            Remind Overdue
                        </Link>
                        <button className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-sm font-semibold rounded-lg shadow-sm border border-neutral-800 hover:border-neutral-600 transition-colors">
                            Export CSV
                        </button>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                        <div className="relative w-72">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">🔍</span>
                            <input type="text" placeholder="Search team members..." className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-neutral-950 text-neutral-500 border-b border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wider">Employee</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">PHISH-01</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">GDPR-01</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">FIN-01</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Completion %</th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-center">Overdue</th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-right">Certificates</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {TRAINING_DATA.map(user => (
                                    <tr key={user.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white min-w-[150px]">{user.name}</td>

                                        {/* PHISH-01 */}
                                        <td className="px-6 py-4">
                                            {user.p1 === '100%' ? (
                                                <span className="text-green-400 font-bold inline-flex items-center gap-1"><span className="text-[10px]">✓</span> 100%</span>
                                            ) : user.p1 === 'Failed' ? (
                                                <span className="text-red-400 font-bold inline-flex items-center gap-1"><span className="text-[10px]">✕</span> Failed</span>
                                            ) : (
                                                <span className="text-neutral-500 font-mono text-xs">{user.p1}</span>
                                            )}
                                        </td>

                                        {/* GDPR-01 */}
                                        <td className="px-6 py-4">
                                            {user.g1 === '100%' ? (
                                                <span className="text-green-400 font-bold inline-flex items-center gap-1"><span className="text-[10px]">✓</span> 100%</span>
                                            ) : user.g1 === '0%' ? (
                                                <span className="text-neutral-500 font-mono text-xs text-opacity-50">0%</span>
                                            ) : (
                                                <span className="text-yellow-400 font-mono text-xs">{user.g1}</span>
                                            )}
                                        </td>

                                        {/* FIN-01 */}
                                        <td className="px-6 py-4">
                                            {user.f1 === '100%' ? (
                                                <span className="text-green-400 font-bold inline-flex items-center gap-1"><span className="text-[10px]">✓</span> 100%</span>
                                            ) : user.f1 === '0%' ? (
                                                <span className="text-neutral-500 font-mono text-xs text-opacity-50">0%</span>
                                            ) : (
                                                <span className="text-yellow-400 font-mono text-xs">{user.f1}</span>
                                            )}
                                        </td>

                                        {/* Total Completion */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-white w-10 text-right">{user.total}</span>
                                                <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                                    <div className={`h-full ${parseInt(user.total) < 50 ? 'bg-red-500' : parseInt(user.total) === 100 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: user.total }}></div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Overdue */}
                                        <td className="px-6 py-4 text-center">
                                            {user.overdue > 0 ? (
                                                <span className="inline-flex items-center justify-center px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-bold font-mono">
                                                    {user.overdue}
                                                </span>
                                            ) : (
                                                <span className="text-neutral-600">-</span>
                                            )}
                                        </td>

                                        {/* Certs */}
                                        <td className="px-6 py-4 text-right">
                                            {user.certs > 0 ? (
                                                <span className="text-yellow-400 font-bold text-sm tracking-widest">{Array(user.certs).fill('🏆').join(' ')}</span>
                                            ) : (
                                                <span className="text-neutral-600">-</span>
                                            )}
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

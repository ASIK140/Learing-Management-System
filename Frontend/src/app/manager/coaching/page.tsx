'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import RoleLayout from '@/components/layout/RoleLayout';
import { managerNavSections } from '../page';

const COACHING_DATA = [
    { id: 1, date: 'Mar 28, 2026', employee: 'Dan Brown', topic: '3 phishing clicks + credential submission', outcome: 'Remedial training assigned', followUp: 'Apr 4, 2026', loggedBy: 'Emily Davis' },
    { id: 2, date: 'Mar 15, 2026', employee: 'Priya Mehta', topic: 'Overdue GDPR Training', outcome: 'Commitment to complete by EOW', followUp: 'Mar 22, 2026', loggedBy: 'Emily Davis' },
    { id: 3, date: 'Feb 10, 2026', employee: 'Mark Evans', topic: 'Poor Exam Score (FIN-01)', outcome: 'Discussed key concepts, re-assigned exam', followUp: 'None', loggedBy: 'Emily Davis' },
];

export default function CoachingLog() {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleLogConversation = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setActiveModal('toast_success');
            setTimeout(() => setActiveModal(null), 3000);
        }, 1500);
    };

    return (
        <RoleLayout title="Coaching Log" subtitle="Private coaching conversations and interventions with team members." accentColor="emerald" avatarText="M" avatarGradient="bg-gradient-to-tr from-emerald-500 to-teal-500" userName="Emily Davis" userEmail="emily.d@cybershield.com" navSections={managerNavSections.map(s => ({ ...s, items: s.items.map(i => ({ ...i, active: i.href === '/manager/coaching' })) }))} currentRole="manager">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full relative">

                <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl text-emerald-400">🤝</div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Intervention Records</h2>
                            <p className="text-sm text-neutral-400">Track 1-on-1 discussions and required follow-ups seamlessly.</p>
                        </div>
                    </div>
                    <button onClick={() => setActiveModal('log_modal')} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
                        + Log Conversation
                    </button>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col pt-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-neutral-950 text-neutral-500 border-b border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Employee</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Topic / Reason</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Outcome</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Follow Up</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Logged By</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {COACHING_DATA.map(log => (
                                    <tr key={log.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4 text-neutral-300 font-mono text-xs">{log.date}</td>
                                        <td className="px-6 py-4 font-bold text-white max-w-[150px] truncate">{log.employee}</td>
                                        <td className="px-6 py-4 text-neutral-400 max-w-xs truncate">{log.topic}</td>
                                        <td className="px-6 py-4 text-emerald-400 font-medium max-w-[200px] truncate">{log.outcome}</td>
                                        <td className="px-6 py-4 text-yellow-500/80 font-mono text-xs">{log.followUp}</td>
                                        <td className="px-6 py-4 text-neutral-500 text-xs">{log.loggedBy}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Simulated Success Toasts */}
                {activeModal === 'toast_success' && (
                    <div className="absolute top-20 right-0 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right-5 fade-in duration-300 z-50">
                        <span className="text-xl">✓</span>
                        <div>
                            <p className="text-sm font-bold">Log Saved</p>
                            <p className="text-xs opacity-80">Conversation securely recorded.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* MODALS */}
            {activeModal === 'log_modal' && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                            <h3 className="font-bold text-white text-lg">Log Coaching Conversation</h3>
                            <button onClick={() => setActiveModal(null)} className="text-neutral-500 hover:text-white text-2xl pb-1">×</button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-400 block">Date of Conversation</label>
                                    <input type="date" defaultValue="2026-03-29" className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-400 block">Select Employee</label>
                                    <select className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500">
                                        <option value="">Choose team member...</option>
                                        <option value="dan">Dan Brown</option>
                                        <option value="mark">Mark Evans</option>
                                        <option value="priya">Priya Mehta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-400 block">Topic / Reason for Coaching</label>
                                <input type="text" placeholder="e.g. Discussed recent phishing failure and required training" className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-neutral-400 block">Intervention Outcome</label>
                                <textarea placeholder="Summary of what was agreed upon..." className="w-full h-24 px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500 resize-none"></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-neutral-800 pt-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-neutral-400 cursor-pointer hover:text-white">
                                        <input type="checkbox" className="w-4 h-4 accent-emerald-500 rounded bg-neutral-900 border-neutral-700" /> Follow-up Required
                                    </label>
                                    <input type="date" className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-500 focus:outline-none focus:border-emerald-500" disabled />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-neutral-400 cursor-pointer hover:text-white">
                                        <input type="checkbox" className="w-4 h-4 accent-emerald-500 rounded bg-neutral-900 border-neutral-700" /> Add Note to HR Audit File
                                    </label>
                                    <p className="text-xs text-neutral-500 mt-1">Checking this securely logs the event for potential compliance or disciplinary review.</p>
                                </div>
                            </div>

                        </div>
                        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950 flex justify-end gap-3">
                            <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm font-semibold text-neutral-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={handleLogConversation} disabled={processing} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-md transition-colors flex items-center">
                                {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> : 'Save Log Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </RoleLayout>
    );
}

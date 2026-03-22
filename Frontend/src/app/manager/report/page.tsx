'use client';
import React, { useState } from 'react';
import RoleLayout from '@/components/layout/RoleLayout';
import { managerNavSections } from '../page';

const ACTIONS_TAKEN = [
    { id: 1, date: 'Mar 28, 2026', action: 'Coaching Conversation', employee: 'Dan Brown', outcome: 'Remedial training assigned' },
    { id: 2, date: 'Mar 25, 2026', action: 'Team Nudge Sent', employee: '3 Employees', outcome: '2 completed training within 48h' },
    { id: 3, date: 'Mar 15, 2026', action: 'Coaching Conversation', employee: 'Priya Mehta', outcome: 'Commitment to complete by EOW' },
    { id: 4, date: 'Feb 10, 2026', action: 'Coaching Conversation', employee: 'Mark Evans', outcome: 'Discussed key concepts, re-assigned exam' },
];

export default function TeamReport() {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleExport = (type: string) => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setActiveModal(`export_${type}`);
            setTimeout(() => setActiveModal(null), 3000);
        }, 1500);
    };

    return (
        <RoleLayout title="Team Report — Quarterly" subtitle="Comprehensive cyber risk and performance summary for Q1 2026." accentColor="emerald" avatarText="M" avatarGradient="bg-gradient-to-tr from-emerald-500 to-teal-500" userName="Emily Davis" userEmail="emily.d@cybershield.com" navSections={managerNavSections.map(s => ({ ...s, items: s.items.map(i => ({ ...i, active: i.href === '/manager/report' })) }))} currentRole="manager">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full relative pb-20">

                {/* Export Actions Panel */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-white">Finance Team Report (Q1 2026)</h2>
                        <p className="text-sm text-neutral-400">Generated on March 29, 2026</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => handleExport('pdf')} disabled={processing} className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2">
                            <span>📄</span> PDF
                        </button>
                        <button onClick={() => handleExport('csv')} disabled={processing} className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2">
                            <span>📊</span> CSV
                        </button>
                        <button onClick={() => handleExport('excel')} disabled={processing} className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2">
                            <span>📗</span> Excel
                        </button>
                        <button onClick={() => handleExport('email')} disabled={processing} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 ml-2">
                            {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <span>✉️ Email to HR</span>}
                        </button>
                    </div>
                </div>

                {/* Printable Document Area */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden text-neutral-900 border border-neutral-200">

                    {/* Doc Header */}
                    <div className="bg-neutral-50 px-10 py-8 border-b border-neutral-200 flex justify-between items-start">
                        <div>
                            <div className="text-2xl font-black tracking-tighter text-neutral-900 mb-1 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-sm">🛡️</span>
                                CyberShield
                            </div>
                            <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest mt-4">Quarterly Executive Summary</p>
                            <h1 className="text-3xl font-bold mt-1">Finance Department</h1>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold flex items-center justify-end gap-2"><span className="text-emerald-600">Period:</span> Q1 2026</p>
                            <p className="text-sm font-bold flex items-center justify-end gap-2 mt-1"><span className="text-emerald-600">Manager:</span> Emily Davis</p>
                            <p className="text-sm font-bold flex items-center justify-end gap-2 mt-1"><span className="text-emerald-600">Headcount:</span> 12 Employees</p>
                        </div>
                    </div>

                    <div className="p-10 space-y-10">
                        {/* Risk Summary */}
                        <section>
                            <h3 className="text-lg font-bold border-b-2 border-neutral-200 pb-2 mb-4 uppercase tracking-wider text-emerald-800">Team Cyber Risk Summary</h3>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="p-5 bg-orange-50 border border-orange-200 rounded-xl">
                                    <p className="text-sm font-bold text-orange-800 uppercase tracking-wide mb-1">Overall Risk Score</p>
                                    <p className="text-4xl font-black text-orange-600">61 <span className="text-sm font-bold text-orange-500">(Elevated)</span></p>
                                    <p className="text-xs font-semibold text-orange-700 mt-2">Highest risk department in organization.</p>
                                </div>
                                <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
                                    <p className="text-sm font-bold text-red-800 uppercase tracking-wide mb-1">Phishing Resilience</p>
                                    <p className="text-4xl font-black text-red-600">22% <span className="text-sm font-bold text-red-500">Click Rate</span></p>
                                    <p className="text-xs font-semibold text-red-700 mt-2">2 Credential Submissions detected.</p>
                                </div>
                            </div>
                            <p className="text-sm leading-relaxed text-neutral-700">
                                The Finance team currently presents an <strong className="text-orange-600">elevated cyber risk</strong> profile. Training completion rests at a critical low of <strong>34%</strong> (Target: 90%), leaving the team vulnerable to social engineering attacks, as evidenced by a 22% phishing click rate during Q1 simulations. Immediate intervention and remedial training have been initiated for high-risk individuals.
                            </p>
                        </section>

                        {/* Key Metrics */}
                        <section>
                            <h3 className="text-lg font-bold border-b-2 border-neutral-200 pb-2 mb-4 uppercase tracking-wider text-emerald-800">Key Performance Indicators</h3>
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-neutral-100">
                                        <th className="p-3 font-bold border border-neutral-200">Metric</th>
                                        <th className="p-3 font-bold border border-neutral-200 text-center">Team Score</th>
                                        <th className="p-3 font-bold border border-neutral-200 text-center text-neutral-500">Org Average</th>
                                        <th className="p-3 font-bold border border-neutral-200 text-center text-emerald-600">Target</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-3 border border-neutral-200 font-bold">Risk Score</td>
                                        <td className="p-3 border border-neutral-200 text-center font-bold text-orange-600 text-lg">61</td>
                                        <td className="p-3 border border-neutral-200 text-center text-neutral-500">42</td>
                                        <td className="p-3 border border-neutral-200 text-center text-emerald-600 font-bold">&lt; 30</td>
                                    </tr>
                                    <tr className="bg-neutral-50">
                                        <td className="p-3 border border-neutral-200 font-bold">Training Completion</td>
                                        <td className="p-3 border border-neutral-200 text-center font-bold text-red-600 text-lg">34%</td>
                                        <td className="p-3 border border-neutral-200 text-center text-neutral-500">76%</td>
                                        <td className="p-3 border border-neutral-200 text-center text-emerald-600 font-bold">&gt; 90%</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 border border-neutral-200 font-bold">Phishing Click Rate</td>
                                        <td className="p-3 border border-neutral-200 text-center font-bold text-orange-600 text-lg">22%</td>
                                        <td className="p-3 border border-neutral-200 text-center text-neutral-500">12%</td>
                                        <td className="p-3 border border-neutral-200 text-center text-emerald-600 font-bold">&lt; 5%</td>
                                    </tr>
                                    <tr className="bg-neutral-50">
                                        <td className="p-3 border border-neutral-200 font-bold">Credential Submissions</td>
                                        <td className="p-3 border border-neutral-200 text-center font-bold text-red-600 text-lg">2</td>
                                        <td className="p-3 border border-neutral-200 text-center text-neutral-500">0.4</td>
                                        <td className="p-3 border border-neutral-200 text-center text-emerald-600 font-bold">0</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 border border-neutral-200 font-bold">Certificates Issued</td>
                                        <td className="p-3 border border-neutral-200 text-center font-bold text-neutral-800 text-lg">9</td>
                                        <td className="p-3 border border-neutral-200 text-center text-neutral-500">22</td>
                                        <td className="p-3 border border-neutral-200 text-center text-emerald-600 font-bold">N/A</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>

                        {/* Actions Taken */}
                        <section>
                            <h3 className="text-lg font-bold border-b-2 border-neutral-200 pb-2 mb-4 uppercase tracking-wider text-emerald-800">Actions Taken This Quarter</h3>
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-neutral-100">
                                        <th className="p-3 font-bold border border-neutral-200">Date</th>
                                        <th className="p-3 font-bold border border-neutral-200">Action Type</th>
                                        <th className="p-3 font-bold border border-neutral-200">Subject</th>
                                        <th className="p-3 font-bold border border-neutral-200">Outcome</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ACTIONS_TAKEN.map((act, i) => (
                                        <tr key={act.id} className={i % 2 === 1 ? 'bg-neutral-50' : ''}>
                                            <td className="p-3 border border-neutral-200 text-neutral-500 font-mono text-xs">{act.date}</td>
                                            <td className="p-3 border border-neutral-200 font-bold">{act.action}</td>
                                            <td className="p-3 border border-neutral-200 text-neutral-600">{act.employee}</td>
                                            <td className="p-3 border border-neutral-200 text-neutral-600 italic">{act.outcome}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    </div>
                </div>
            </div>

            {/* Simulated Success Toasts */}
            {activeModal === 'export_email' && (
                <div className="fixed top-6 right-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-5 fade-in duration-300 z-50">
                    <span className="text-3xl">🚀</span>
                    <div>
                        <p className="text-base font-bold">Report Delivered</p>
                        <p className="text-sm opacity-80 mt-1">Sent securely to Human Resources.</p>
                    </div>
                </div>
            )}
            {activeModal?.startsWith('export_') && activeModal !== 'export_email' && (
                <div className="fixed top-6 right-6 bg-neutral-800 border border-neutral-700 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-5 fade-in duration-300 z-50">
                    <span className="text-3xl">⬇️</span>
                    <div>
                        <p className="text-base font-bold">Download Started</p>
                        <p className="text-sm opacity-80 mt-1">Your {activeModal.split('_')[1].toUpperCase()} file is ready.</p>
                    </div>
                </div>
            )}
        </RoleLayout>
    );
}

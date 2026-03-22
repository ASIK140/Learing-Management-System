'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import RoleLayout, { NavSection } from '@/components/layout/RoleLayout';

export const managerNavSections: NavSection[] = [
    {
        title: 'MY TEAM',
        items: [
            { label: 'Team Dashboard', href: '/manager', icon: '👥' },
            { label: 'Risk View', href: '/manager/risk', icon: '⚠️' },
            { label: 'Training Status', href: '/manager/training', icon: '📚' },
            { label: 'Phishing Results', href: '/manager/phishing', icon: '🎣' },
        ],
    },
    {
        title: 'ACTIONS',
        items: [
            { label: 'Coaching Log', href: '/manager/coaching', icon: '🤝' },
            { label: 'Send Nudge', href: '/manager/nudge', icon: '🔔' },
        ],
    },
    {
        title: 'REPORTS',
        items: [
            { label: 'Team Report', href: '/manager/report', icon: '📊' },
            { label: 'My Actions Log', href: '/manager/actions', icon: '📝' },
        ],
    },
];

const METRICS = [
    { label: 'Team Risk Score', value: '61', subtext: 'Status: Elevated — worst department', icon: '⚠️', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'High Risk Members', value: '3', subtext: 'Action required', icon: '🚨', color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Training Completion', value: '34%', subtext: 'Target: 90% | Overdue: 8', icon: '📉', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Phishing Click Rate', value: '14%', subtext: 'Target < 5%', icon: '🎣', color: 'text-orange-400', bg: 'bg-orange-500/10' },
];

const TEAM_MEMBERS = [
    { id: 1, name: 'Dan Brown', score: 84, training: '0%', clicks: 3, status: 'Critical' },
    { id: 2, name: 'Mark Evans', score: 72, training: '34%', clicks: 1, status: 'High Risk' },
    { id: 3, name: 'Priya Mehta', score: 48, training: '61%', clicks: 1, status: 'Medium' },
    { id: 4, name: 'James Lee', score: 32, training: '78%', clicks: 0, status: 'Good' },
    { id: 5, name: 'Yuki Tanaka', score: 24, training: '82%', clicks: 0, status: 'Low Risk' },
    { id: 6, name: 'Alice Thompson', score: 18, training: '100%', clicks: 0, status: 'Excellent' },
];

export default function ManagerDashboard() {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [exporting, setExporting] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
    
    // Assign training state
    const [assignProcessing, setAssignProcessing] = useState(false);

    const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const triggerAction = (modalType: string, user: any = null) => {
        setSelectedUser(user);
        setActiveModal(modalType);
    };

    const handleExport = () => {
        setExporting(true);
        const rows = [
            ['Name', 'Risk Score', 'Training Completion', 'Phishing Clicks', 'Status'],
            ...TEAM_MEMBERS.map(m => [m.name, m.score, m.training, m.clicks, m.status])
        ];
        const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'team-risk-overview.csv'; a.click();
        setTimeout(() => { setExporting(false); showToast('✅ Team Overview exported to CSV!'); }, 700);
    };

    const handleAssignTraining = () => {
        setAssignProcessing(true);
        setTimeout(() => {
            setAssignProcessing(false);
            setActiveModal(null);
            showToast(`✅ Training successfully assigned to ${selectedUser ? selectedUser.name : 'team members'}.`);
        }, 1200);
    };

    const toastCls: Record<string, string> = {
        success: 'bg-emerald-600', error: 'bg-red-600', info: 'bg-indigo-600',
    };

    return (
        <RoleLayout title="Team Dashboard" subtitle="Your team overview and cyber risk insights." accentColor="emerald" avatarText="M" avatarGradient="bg-gradient-to-tr from-emerald-500 to-teal-500" userName="Emily Davis" userEmail="emily.d@cybershield.com" navSections={managerNavSections.map(s => ({ ...s, items: s.items.map(i => ({ ...i, active: i.href === '/manager' })) }))} currentRole="manager">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full relative">

                {/* TOAST */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl font-bold text-sm text-white max-w-sm ${toastCls[toast.type]}`}>
                        {toast.msg}
                    </div>
                )}

                {/* Header Actions */}
                <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
                    <p className="text-sm text-neutral-400">Your <strong className="text-white">Finance</strong> team has 12 members. <strong className="text-red-400">3 high-risk employees</strong> require attention this week.</p>
                    <div className="flex gap-3">
                        <Link href="/manager/report" className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
                            Team Report
                        </Link>
                        <button onClick={handleExport} disabled={exporting} className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2">
                            {exporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '📥'}
                            {exporting ? 'Exporting...' : 'Export CSV'}
                        </button>
                        <Link href="/manager/nudge" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
                            Send Nudge
                        </Link>
                    </div>
                </div>

                {/* Dashboard Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {METRICS.map((metric, i) => (
                        <div key={i} className={`bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-sm hover:border-neutral-700 transition ${i === 2 ? 'relative overflow-hidden' : ''}`}>
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${metric.bg} ${metric.color}`}>
                                    {metric.icon}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-neutral-400 mb-1 relative z-10">{metric.label}</p>
                            <div className="flex items-end gap-2 relative z-10">
                                <p className="text-2xl font-bold text-white">{metric.value}</p>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2 font-medium relative z-10">{metric.subtext}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Team Risk Overview Table */}
                    <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center">
                            <h3 className="font-bold text-white text-lg">Team Risk Overview</h3>
                            <Link href="/manager/risk" className="text-sm font-semibold text-emerald-500 hover:text-emerald-400 transition-colors">View All →</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-neutral-950 text-neutral-500 border-b border-neutral-800 uppercase text-xs">
                                    <tr>
                                        <th className="px-5 py-4 font-bold tracking-wider">Name</th>
                                        <th className="px-5 py-4 font-bold tracking-wider">Risk Score</th>
                                        <th className="px-5 py-4 font-bold tracking-wider">Training Completion</th>
                                        <th className="px-5 py-4 font-bold tracking-wider">Phishing Clicks</th>
                                        <th className="px-5 py-4 font-bold tracking-wider">Status</th>
                                        <th className="px-5 py-4 font-bold tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/50">
                                    {TEAM_MEMBERS.map(member => (
                                        <tr key={member.id} className="hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-400">
                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="font-bold text-white">{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`font-mono font-bold ${member.score >= 70 ? 'text-red-400' : member.score >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>{member.score}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`font-mono text-xs font-bold ${parseInt(member.training) < 50 ? 'text-red-400' : parseInt(member.training) < 80 ? 'text-yellow-400' : 'text-green-400'}`}>{member.training}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                {member.clicks > 0 ? <span className="text-red-400 font-bold">{member.clicks}</span> : <span className="text-green-400 font-bold">0</span>}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${member.status === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        member.status === 'High Risk' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                            member.status === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                                'bg-green-500/10 text-green-400 border-green-500/20'
                                                    }`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button onClick={() => triggerAction('quick_action', member)} className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-lg transition text-xs">Manage</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                
                    <div className="space-y-6">
                        {/* Actions Required Panel */}
                        <div className="bg-gradient-to-br from-red-950/20 to-neutral-900 border border-red-900/30 rounded-2xl shadow-xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-red-500/10 transition-colors"></div>
                            <div className="p-4 border-b border-red-900/30 bg-red-900/10 flex justify-between items-center relative z-10">
                                <h3 className="font-bold text-red-400 text-sm flex items-center gap-2"><span>🚨</span> Actions Required</h3>
                            </div>
                            <div className="p-4 space-y-3 relative z-10">
                                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                                    <p className="text-xs font-semibold text-white mb-2 leading-relaxed">Dan Brown submitted credentials during phishing simulation.</p>
                                    <Link href="/manager/coaching" className="inline-block text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors">Log Coaching →</Link>
                                </div>
                                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                                    <p className="text-xs font-semibold text-white mb-2 leading-relaxed">8 team members overdue on PHISH-01 training.</p>
                                    <Link href="/manager/nudge" className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-500 hover:text-emerald-400 transition-colors">Send Nudge →</Link>
                                </div>
                                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                                    <p className="text-xs font-semibold text-white mb-2 leading-relaxed">DORA Article 13 compliance training deadline approaching.</p>
                                    <button onClick={() => { setSelectedUser(null); setActiveModal('assign_training'); }} className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors">Assign Training →</button>
                                </div>
                            </div>
                        </div>

                        {/* Team Progress Panel */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-4 border-b border-neutral-800 bg-neutral-900/50">
                                <h3 className="font-bold text-white text-sm">Team Progress (6-mo)</h3>
                            </div>
                            <div className="p-5">
                                <div className="flex items-end gap-2 h-32 mb-4">
                                    {[
                                        { m: 'Oct', v: 40, c: 'bg-emerald-500' },
                                        { m: 'Nov', v: 45, c: 'bg-emerald-500' },
                                        { m: 'Dec', v: 60, c: 'bg-emerald-500' },
                                        { m: 'Jan', v: 25, c: 'bg-red-500' },
                                        { m: 'Feb', v: 30, c: 'bg-yellow-500' },
                                        { m: 'Mar', v: 34, c: 'bg-yellow-500' }
                                    ].map((col, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                            <div className="w-full bg-neutral-950 rounded-t-sm relative flex-1 flex items-end">
                                                <div className={`w-full rounded-t-sm transition-all duration-500 group-hover:opacity-80 ${col.c}`} style={{ height: `${col.v}%` }}></div>
                                            </div>
                                            <span className="text-[10px] text-neutral-500 font-bold uppercase">{col.m}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-neutral-400 text-center">Training completion rate over time. <span className="text-red-400 font-semibold block mt-1">Declining performance detected in Q1.</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS MODAL */}
            {activeModal === 'quick_action' && selectedUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-5 border-b border-neutral-800 bg-neutral-950 text-center relative">
                            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-neutral-500 hover:text-white pb-1 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition">✕</button>
                            <div className="w-16 h-16 mx-auto rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center text-xl font-bold text-white mb-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <h3 className="font-bold text-white text-lg">{selectedUser.name}</h3>
                            <p className="text-xs font-semibold text-neutral-500 mt-1 uppercase tracking-widest">{selectedUser.status} Risk User</p>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <Link href={`/manager/coaching?user=${selectedUser.id}`} className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500 text-left px-5 rounded-lg text-sm text-neutral-300 font-bold transition-all flex items-center gap-3">
                                <span className="text-emerald-400">💬</span> Coach Employee
                            </Link>
                            <Link href={`/manager/nudge?user=${selectedUser.id}`} className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500 text-left px-5 rounded-lg text-sm text-neutral-300 font-bold transition-all flex items-center gap-3">
                                <span className="text-yellow-400">🔔</span> Send Reminder
                            </Link>
                            <button onClick={() => setActiveModal('assign_training')} className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500 text-left px-5 rounded-lg text-sm text-neutral-300 font-bold transition-all flex items-center gap-3">
                                <span className="text-indigo-400">📚</span> Assign Training
                            </button>
                            <button onClick={() => setActiveModal(null)} className="w-full py-3 mt-2 text-neutral-500 hover:text-white text-sm font-bold transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ASSIGN TRAINING MODAL */}
            {activeModal === 'assign_training' && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-5 border-b border-neutral-800 bg-neutral-950 flex justify-between items-center">
                            <h3 className="font-bold text-white text-lg">Assign Training</h3>
                            <button onClick={() => setActiveModal(null)} className="text-neutral-500 hover:text-white pb-1 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition">✕</button>
                        </div>
                        <div className="p-5">
                            <p className="text-sm text-neutral-400 mb-4">
                                Select a training module to assign to {selectedUser ? <strong className="text-white">{selectedUser.name}</strong> : <strong className="text-white">your team members</strong>}.
                            </p>
                            
                            <div className="space-y-3 mb-6">
                                <label className="flex items-start gap-3 p-3 bg-neutral-950 border border-neutral-800 hover:border-emerald-500 rounded-xl cursor-pointer transition-colors">
                                    <input type="radio" name="training" className="mt-1 text-emerald-500 focus:ring-emerald-500 bg-neutral-900 border-neutral-700" defaultChecked />
                                    <div>
                                        <p className="font-bold text-white text-sm">PHISH-01: Advanced Phishing Defense</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">Focuses on recognizing credential harvesting pages.</p>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 p-3 bg-neutral-950 border border-neutral-800 hover:border-emerald-500 rounded-xl cursor-pointer transition-colors">
                                    <input type="radio" name="training" className="mt-1 text-emerald-500 focus:ring-emerald-500 bg-neutral-900 border-neutral-700" />
                                    <div>
                                        <p className="font-bold text-white text-sm">DORA Article 13 Compliance</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">Mandatory regulatory awareness for Finance division.</p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setActiveModal(selectedUser ? 'quick_action' : null)} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-sm font-bold rounded-xl transition">
                                    Back
                                </button>
                                <button onClick={handleAssignTraining} disabled={assignProcessing} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
                                    {assignProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '📚'}
                                    {assignProcessing ? 'Assigning...' : 'Assign Required'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </RoleLayout>
    );
}

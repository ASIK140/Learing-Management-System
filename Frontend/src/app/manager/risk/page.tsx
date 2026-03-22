'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import RoleLayout from '@/components/layout/RoleLayout';
import { managerNavSections } from '../page';

// ── Types ──────────────────────────────
type UserRisk = {
    id: number;
    name: string;
    score: number;
    clicks: number;
    creds: 'Yes' | 'No';
    training: string;
    exam: string;
    overdue: string;
};

// ── Data ───────────────────────────────
const SEED_DATA: UserRisk[] = [
    { id: 1, name: 'Dan Brown', score: 84, clicks: 3, creds: 'Yes', training: '0%', exam: '44%', overdue: '21 days' },
    { id: 2, name: 'Mark Evans', score: 72, clicks: 1, creds: 'No', training: '34%', exam: '65%', overdue: '14 days' },
    { id: 3, name: 'Priya Mehta', score: 48, clicks: 1, creds: 'No', training: '61%', exam: '78%', overdue: '7 days' },
    { id: 4, name: 'James Lee', score: 32, clicks: 0, creds: 'No', training: '78%', exam: '88%', overdue: 'None' },
    { id: 5, name: 'Yuki Tanaka', score: 24, clicks: 0, creds: 'No', training: '82%', exam: '92%', overdue: 'None' },
    { id: 6, name: 'Alice Thompson', score: 18, clicks: 0, creds: 'No', training: '100%', exam: '98%', overdue: 'None' },
];

export default function RiskView() {
    // ── State ──────────────────────────────
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<'risk' | 'name' | 'training'>('risk');
    
    // Modals
    const [activeModal, setActiveModal] = useState<'action_modal' | 'bulk_modal' | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserRisk | null>(null);
    
    // Actions
    const [assigning, setAssigning] = useState(false);
    const [exporting, setExporting] = useState<'csv' | 'excel' | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

    const showToast = (msg: string, type: 'success' | 'info' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const triggerAction = (user: UserRisk) => {
        setSelectedUser(user);
        setActiveModal('action_modal');
    };

    // ── Filtering and Sorting ─────────────
    const filteredAndSorted = useMemo(() => {
        let result = [...SEED_DATA];

        // Search
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(u => u.name.toLowerCase().includes(q));
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'risk') return b.score - a.score; // High to Low
            if (sortBy === 'name') return a.name.localeCompare(b.name); // A-Z
            if (sortBy === 'training') {
                const trA = parseInt(a.training);
                const trB = parseInt(b.training);
                return trA - trB; // Low to High
            }
            return 0;
        });

        return result;
    }, [search, sortBy]);

    // ── Actions ───────────────────────────
    const handleExport = (format: 'csv' | 'excel') => {
        setExporting(format);
        const ext = format === 'csv' ? 'csv' : 'xlsx';
        
        const rows = [
            ['Employee Name', 'Risk Score', 'Phish Clicks', 'Cred Submission', 'Training', 'Exam Score', 'Overdue'],
            ...filteredAndSorted.map(u => [u.name, u.score, u.clicks, u.creds, u.training, u.exam, u.overdue])
        ];
        const csvContent = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: format === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `team-risk-report.${ext}`; a.click();
        
        setTimeout(() => { 
            setExporting(null);
            showToast(`✅ Report exported as ${format.toUpperCase()}!`);
        }, 700);
    };

    const handleAssignTraining = (type: 'single' | 'bulk') => {
        setAssigning(true);
        setTimeout(() => {
            setAssigning(false);
            setActiveModal(null);
            if (type === 'single' && selectedUser) {
                showToast(`✅ Remedial training assigned to ${selectedUser.name}.`);
            } else {
                showToast('✅ Bulk remedial training assigned to all high-risk users.');
            }
        }, 1200);
    };

    return (
        <RoleLayout title="Team Risk View" subtitle="Real-time cyber risk scores based on training, phishing simulations, and exam performance." accentColor="emerald" avatarText="M" avatarGradient="bg-gradient-to-tr from-emerald-500 to-teal-500" userName="Emily Davis" userEmail="emily.d@cybershield.com" navSections={managerNavSections.map(s => ({ ...s, items: s.items.map(i => ({ ...i, active: i.href === '/manager/risk' })) }))} currentRole="manager">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full relative">

                {/* TOAST */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl font-bold text-sm text-white max-w-sm ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                        {toast.msg}
                    </div>
                )}

                {/* Header Banner */}
                <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />
                    <div className="flex gap-4 items-center relative z-10">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-2xl text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">⚠️</div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Risk Analysis</h2>
                            <p className="text-sm text-neutral-400">Deep dive into individual employee vulnerabilities.</p>
                        </div>
                    </div>
                    <div className="flex gap-3 relative z-10">
                        <button onClick={() => setActiveModal('bulk_modal')} className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold rounded-lg shadow-sm border border-neutral-700 transition-colors hover:border-emerald-500/50">
                            Bulk Remedial Training
                        </button>
                        <button onClick={() => handleExport('csv')} disabled={exporting !== null} className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-neutral-300 text-sm font-semibold rounded-lg shadow-sm border border-neutral-800 hover:border-neutral-600 transition-colors flex items-center gap-2">
                            {exporting === 'csv' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                            {exporting === 'csv' ? 'Exporting...' : 'Export CSV'}
                        </button>
                        <button onClick={() => handleExport('excel')} disabled={exporting !== null} className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-neutral-300 text-sm font-semibold rounded-lg shadow-sm border border-neutral-800 hover:border-neutral-600 transition-colors flex items-center gap-2">
                            {exporting === 'excel' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                            {exporting === 'excel' ? 'Exporting...' : 'Export Excel'}
                        </button>
                    </div>
                </div>

                {/* Main Table Card */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50 flex-wrap gap-4">
                        {/* Search */}
                        <div className="relative w-72">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">🔍</span>
                            <input 
                                type="text" 
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search team members..." 
                                className="w-full pl-9 pr-8 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500" 
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs">✕</button>
                            )}
                        </div>
                        {/* Sort */}
                        <div className="flex gap-2">
                            <select 
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value as any)}
                                className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                            >
                                <option value="risk">Sort by: Risk Score (High - Low)</option>
                                <option value="name">Sort by: Name (A-Z)</option>
                                <option value="training">Sort by: Training (Low - High)</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-neutral-950 text-neutral-500 border-b border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wider">Employee Name</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Risk Score</th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-center">Phish Clicks</th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-center">Cred Submission</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Training</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Exam Score</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Overdue</th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {filteredAndSorted.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-neutral-500">
                                            No team members found matching your criteria.
                                        </td>
                                    </tr>
                                ) : filteredAndSorted.map(user => (
                                    <tr key={user.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white max-w-[200px] truncate">{user.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold font-mono ${user.score >= 70 ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : user.score >= 40 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                                {user.score}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`font-mono font-bold ${user.clicks > 0 ? 'text-red-400' : 'text-green-400'}`}>{user.clicks}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {user.creds === 'Yes' ? (
                                                <span className="inline-block px-2.5 py-1 bg-red-500/20 text-red-500 text-[10px] font-bold uppercase rounded border border-red-500/30 animate-pulse">Yes</span>
                                            ) : (
                                                <span className="text-neutral-500 text-xs text-[10px] uppercase font-bold tracking-widest">No</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-mono text-xs font-bold ${parseInt(user.training) < 50 ? 'text-red-400' : parseInt(user.training) < 80 ? 'text-yellow-400' : 'text-green-400'}`}>{user.training}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`font-mono text-xs font-bold ${parseInt(user.exam) < 60 ? 'text-red-400' : parseInt(user.exam) < 80 ? 'text-yellow-400' : 'text-green-400'}`}>{user.exam}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.overdue !== 'None' ? (
                                                <span className="text-red-400 text-xs font-semibold">{user.overdue}</span>
                                            ) : (
                                                <span className="text-neutral-500 text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.score >= 40 || user.overdue !== 'None' ? (
                                                <button onClick={() => triggerAction(user)} className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-semibold rounded text-xs transition border border-emerald-500/30 hover:border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                                    Action Required
                                                </button>
                                            ) : (
                                                <span className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-500 font-semibold rounded text-xs">
                                                    OK
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            
            {/* 1. Single Action Modal */}
            {activeModal === 'action_modal' && selectedUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                            <h3 className="font-bold text-white text-lg">Take Action</h3>
                            <button onClick={() => setActiveModal(null)} className="text-neutral-500 hover:text-white pb-1 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition">✕</button>
                        </div>
                        <div className="p-6 pb-2 text-center relative">
                            {/* Avatar */}
                            <div className="w-16 h-16 mx-auto rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center text-xl font-bold text-white mb-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <p className="text-sm text-neutral-400 mb-1">Select an intervention for</p>
                            <h4 className="text-xl font-bold text-white mb-6">{selectedUser.name}</h4>

                            <div className="space-y-3">
                                <Link href={`/manager/coaching?user=${selectedUser.id}`} className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500 text-left px-5 rounded-xl text-sm text-indigo-400 font-bold transition-all flex items-center gap-3">
                                    <span className="text-xl">💬</span> Coach Employee
                                </Link>
                                <Link href={`/manager/nudge?user=${selectedUser.id}`} className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500 text-left px-5 rounded-xl text-sm text-yellow-400 font-bold transition-all flex items-center gap-3">
                                    <span className="text-xl">🔔</span> Send Reminder
                                </Link>
                                <button onClick={() => handleAssignTraining('single')} disabled={assigning} className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500 disabled:opacity-50 text-left px-5 rounded-xl text-sm text-emerald-400 font-bold transition-all flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                    {assigning ? <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin ml-1 mr-1" /> : <span className="text-xl">📚</span>}
                                    {assigning ? 'Assigning...' : 'Assign Remedial Training'}
                                </button>
                            </div>
                        </div>
                        <div className="p-4 flex justify-center mt-2">
                            <button onClick={() => setActiveModal(null)} className="py-2 px-6 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Bulk Action Modal */}
            {activeModal === 'bulk_modal' && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950 text-emerald-400">
                            <h3 className="font-bold text-lg flex items-center gap-2"><span>📚</span> Bulk Remedial Training</h3>
                            <button onClick={() => setActiveModal(null)} className="text-neutral-500 hover:text-white pb-1 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition">✕</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-neutral-300">
                                This will automatically assign the <strong className="text-white">Security Fundamentals Refresher</strong> module to all team members who meet the following criteria:
                            </p>
                            
                            <ul className="space-y-2 p-4 bg-neutral-950 rounded-xl border border-neutral-800">
                                <li className="flex items-center gap-2 text-sm text-red-400 font-medium">
                                    <span>•</span> Risk Score &gt; 70
                                </li>
                                <li className="flex items-center gap-2 text-sm text-red-400 font-medium">
                                    <span>•</span> Phishing Clicks &gt; 0
                                </li>
                                <li className="flex items-center gap-2 text-sm text-yellow-500 font-medium">
                                    <span>•</span> Overdue Training &gt; 10 days
                                </li>
                            </ul>

                            <p className="text-xs text-neutral-500 font-medium">
                                Approximately <strong className="text-neutral-300">3 employees</strong> will be enrolled and notified via email.
                            </p>
                        </div>
                        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex gap-3">
                            <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-bold rounded-xl transition">
                                Cancel
                            </button>
                            <button onClick={() => handleAssignTraining('bulk')} disabled={assigning} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                {assigning ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '📚'}
                                {assigning ? 'Assigning...' : 'Assign Training'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </RoleLayout>
    );
}

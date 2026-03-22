import React from 'react';

export default function NGOProgressPage() {
    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Team Progress</h2>
                    <p className="text-neutral-400 text-sm">Course completion across all NGO members.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors border border-neutral-700">Export CSV</button>
                    <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors border border-neutral-700">Export Excel</button>
                    <button className="px-4 py-2 border border-orange-600 text-orange-400 hover:bg-orange-500/10 text-sm font-semibold rounded-lg transition-colors">Nudge Not Started</button>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Average Completion', value: '74%', icon: '📈', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Courses Available', value: '3', icon: '📚', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Certificates Issued', value: '31', icon: '🏆', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { label: 'Need Attention', value: '6 members below 50%', icon: '⚠️', color: 'text-red-400', bg: 'bg-red-500/10' },
                ].map(kpi => (
                    <div key={kpi.label} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-4 shadow-lg">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${kpi.bg} ${kpi.color} flex-shrink-0`}>
                            {kpi.icon}
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400 font-medium mb-1 uppercase tracking-wider">{kpi.label}</p>
                            <p className="text-xl font-bold text-white">{kpi.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* COURSE PROGRESS TABLE */}
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-lg mt-2">
                <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-black/20">
                    <h3 className="font-bold text-white">Course Performance Matrix</h3>
                    <button className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1">
                        View Detailed Analytics <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/40 border-b border-neutral-800 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Course</th>
                                <th className="px-6 py-4 text-center">Members Enrolled</th>
                                <th className="px-6 py-4 text-center">Completed</th>
                                <th className="px-6 py-4 text-center">In Progress</th>
                                <th className="px-6 py-4 text-center">Not Started</th>
                                <th className="px-6 py-4 text-center">Average Score</th>
                                <th className="px-6 py-4 text-center">Certificates Issued</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {[
                                { course: 'PHISH-01: Phishing, Smishing & Vishing', enrolled: 42, completed: 34, inProgress: 6, notStarted: 2, avgScore: '77%', certs: 31, avgColor: 'text-green-400' },
                                { course: 'GDPR-01: GDPR & Data Protection', enrolled: 42, completed: 28, inProgress: 10, notStarted: 4, avgScore: '82%', certs: 25, avgColor: 'text-green-400' },
                                { course: 'EXEC-01: Executive Targeted Attacks', enrolled: 5, completed: 1, inProgress: 2, notStarted: 2, avgScore: '65%', certs: 0, avgColor: 'text-orange-400' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-white">{row.course}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-neutral-300 text-center">{row.enrolled}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex w-8 h-8 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 items-center justify-center font-bold text-sm">
                                            {row.completed}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 items-center justify-center font-bold text-sm">
                                            {row.inProgress}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex w-8 h-8 rounded-full bg-neutral-500/10 text-neutral-400 border border-neutral-500/20 items-center justify-center font-bold text-sm">
                                            {row.notStarted}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`text-sm font-bold ${row.avgColor}`}>{row.avgScore}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm text-yellow-500 font-bold">
                                        <span className="mr-1">🏆</span> {row.certs}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}

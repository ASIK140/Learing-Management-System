import React from 'react';
import Link from 'next/link';

export default function NGODashboardPage() {
    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
            
            {/* KPI METRIC CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Members', value: '42', trend: '+8 this month', trendUp: true, icon: '👥', color: 'text-orange-400', bg: 'bg-orange-500/10' },
                    { label: 'Average Completion', value: '74%', trend: '+6% vs last month', trendUp: true, icon: '📈', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                    { label: 'Certificates Issued', value: '31', trend: '+4 this month', trendUp: true, icon: '🏆', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { label: 'Seats Remaining', value: '8 of 50 seats', trend: 'Free tier limit', trendUp: false, icon: '🪑', color: 'text-green-400', bg: 'bg-green-500/10' },
                ].map(kpi => (
                    <div key={kpi.label} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-sm font-semibold text-neutral-400">{kpi.label}</span>
                            <div className={`w-10 h-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center text-xl`}>
                                {kpi.icon}
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-white mb-2">{kpi.value}</p>
                            <p className="text-xs font-medium flex items-center gap-1 text-neutral-500">
                                {kpi.trendUp && <span className="text-green-400">↑</span>}
                                {kpi.trend}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT COLUMN: Summary & Activity */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    {/* ORGANISATION SUMMARY CARD */}
                    <div className="rounded-2xl bg-gradient-to-br from-neutral-900 to-black border border-neutral-800 overflow-hidden relative shadow-lg">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[60px] rounded-full pointer-events-none"></div>
                        
                        <div className="p-6 border-b border-neutral-800 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-400 flex flex-col items-center justify-center text-white font-bold shadow-lg">
                                <span className="text-xs uppercase">Safe</span>
                                <span className="text-[10px] uppercase">Net</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">SafeNet Uganda</h3>
                                <p className="text-sm text-neutral-400">Kampala, Uganda</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-6 gap-x-4 p-6 relative z-10">
                            <div>
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Programme</p>
                                <p className="text-sm font-semibold text-white">CyberShield NGO Free Tier</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Approved</p>
                                <p className="text-sm font-semibold text-white">March 2024</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Languages</p>
                                <p className="text-sm font-semibold text-white">English + Luganda</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Seats Used</p>
                                <p className="text-sm font-semibold text-white">42 / 50</p>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-black/40 border-t border-neutral-800 flex justify-end gap-3">
                            <Link href="/ngo/reports/plan">
                                <button className="px-4 py-2 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors border border-neutral-700">View Plan</button>
                            </Link>
                            <Link href="/ngo/reports/impact">
                                <button className="px-4 py-2 text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors shadow-[0_0_15px_rgba(234,88,12,0.3)]">Impact Report</button>
                            </Link>
                        </div>
                    </div>

                    {/* RECENT ACTIVITY TABLE */}
                    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-lg flex-1">
                        <div className="p-5 border-b border-neutral-800 flex justify-between items-center">
                            <h3 className="font-bold text-white">Recent Activity</h3>
                            <button className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-black/30 border-b border-neutral-800 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                        <th className="px-5 py-3 w-32">Date</th>
                                        <th className="px-5 py-3">Member</th>
                                        <th className="px-5 py-3">Activity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/50">
                                    {[
                                        { date: 'Today', member: 'Amara Nkosi', activity: 'Completed PHISH-01 — scored 84%', icon: '🎓', color: 'text-green-400' },
                                        { date: 'Today', member: 'Joseph Okello', activity: 'Started GDPR-01 Chapter 2', icon: '▶️', color: 'text-blue-400' },
                                        { date: 'Yesterday', member: 'Grace Auma', activity: 'Certificate issued PHISH-01', icon: '🏆', color: 'text-yellow-400' },
                                        { date: 'Yesterday', member: 'David Ssali', activity: 'Joined SafeNet Uganda', icon: '👋', color: 'text-orange-400' },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-5 py-3.5 text-xs text-neutral-400 whitespace-nowrap">{row.date}</td>
                                            <td className="px-5 py-3.5 text-sm font-medium text-white">{row.member}</td>
                                            <td className="px-5 py-3.5 text-sm text-neutral-300 flex items-center gap-2">
                                                <span className={`${row.color}`}>{row.icon}</span>
                                                {row.activity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: Impact & Course Progress */}
                <div className="flex flex-col gap-6">
                    
                    {/* IMPACT THIS YEAR PANEL */}
                    <div className="rounded-2xl bg-gradient-to-b from-orange-900/30 to-neutral-900 border border-orange-500/20 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg className="w-24 h-24 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        </div>
                        
                        <div className="p-5 border-b border-orange-500/10">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <span className="text-orange-400">🌍</span> Impact This Year
                            </h3>
                        </div>
                        
                        <div className="p-5 space-y-4">
                            {[
                                { label: 'Members trained', value: '42' },
                                { label: 'Certificates issued', value: '31' },
                                { label: 'Training hours completed', value: '186 hours' },
                                { label: 'Phishing simulations', value: '2 campaigns' },
                            ].map(item => (
                                <div key={item.label} className="flex justify-between items-center pb-3 border-b border-neutral-800/50 last:border-0 last:pb-0">
                                    <span className="text-sm text-neutral-400">{item.label}</span>
                                    <span className="text-sm font-bold text-white">{item.value}</span>
                                </div>
                            ))}
                            
                            <div className="pt-4 border-t border-neutral-800/50">
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-2">Phishing click rate improvement</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-xl font-bold text-red-400">38%</span>
                                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    <span className="text-xl font-bold text-green-400">21%</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-orange-600/10 border-t border-orange-500/20 text-center">
                            <p className="text-xs text-orange-400 font-medium">Subsidy value received: <strong className="text-white ml-1">£2,160 per year</strong></p>
                        </div>
                    </div>

                    {/* COMPLETION BY COURSE */}
                    <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-5 shadow-lg flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">Completion By Course</h3>
                            <Link href="/ngo/progress">
                                <button className="text-xs font-semibold px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded border border-neutral-700 transition-colors">Details</button>
                            </Link>
                        </div>
                        
                        <div className="space-y-5">
                            {[
                                { name: 'Phishing Smishing & Vishing', pct: 81, color: 'bg-cyan-500' },
                                { name: 'GDPR & Data Protection', pct: 68, color: 'bg-blue-500' },
                                { name: 'Executive Targeted Attacks', pct: 52, color: 'bg-indigo-500' },
                            ].map(course => (
                                <div key={course.name}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-semibold text-neutral-300 truncate pr-4">{course.name}</span>
                                        <span className="text-xs font-bold text-white">{course.pct}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${course.color} rounded-full`} style={{ width: `${course.pct}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

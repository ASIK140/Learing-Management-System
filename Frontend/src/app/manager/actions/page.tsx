'use client';
import React from 'react';
import RoleLayout from '@/components/layout/RoleLayout';
import { managerNavSections } from '../page';

const ACTION_LOGS = [
    { id: 1, time: 'Mar 28, 2026 11:00 AM', action: 'Coaching Logged', target: 'Dan Brown', channel: 'In Person', result: 'Logged' },
    { id: 2, time: 'Mar 28, 2026 11:30 AM', action: 'Team Nudge Sent', target: '8 Employees', channel: 'Email', result: 'Delivered' },
    { id: 3, time: 'Mar 25, 2026 09:15 AM', action: 'Remedial Assigned', target: 'Dan Brown', channel: 'System', result: 'Assigned' },
    { id: 4, time: 'Mar 15, 2026 02:45 PM', action: 'Coaching Logged', target: 'Priya Mehta', channel: 'Video Call', result: 'Logged' },
    { id: 5, time: 'Feb 28, 2026 10:00 AM', action: 'Report Exported', target: 'HR Department', channel: 'Email', result: 'Sent' },
    { id: 6, time: 'Feb 10, 2026 11:20 AM', action: 'Coaching Logged', target: 'Mark Evans', channel: 'In Person', result: 'Logged' },
    { id: 7, time: 'Feb 01, 2026 09:00 AM', action: 'Team Nudge Sent', target: 'Finance Team', channel: 'Slack', result: 'Delivered' },
];

export default function ActionsLog() {
    return (
        <RoleLayout title="My Actions Log" subtitle="Comprehensive audit history of all manager interventions and system activities." accentColor="emerald" avatarText="M" avatarGradient="bg-gradient-to-tr from-emerald-500 to-teal-500" userName="Emily Davis" userEmail="emily.d@cybershield.com" navSections={managerNavSections.map(s => ({ ...s, items: s.items.map(i => ({ ...i, active: i.href === '/manager/actions' })) }))} currentRole="manager">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">

                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                        <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center text-2xl text-neutral-400">📝</div>
                            <div>
                                <h2 className="text-xl font-bold text-white">System Audit Log</h2>
                                <p className="text-sm text-neutral-400">Immutable record of managerial actions for compliance.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative w-64 hidden md:block">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-bold">🔍</span>
                                <input type="text" placeholder="Search logs..." className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500" />
                            </div>
                            <button className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-sm font-semibold rounded-lg shadow-sm border border-neutral-800 hover:border-neutral-600 transition-colors">
                                Filter
                            </button>
                            <button className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-sm font-semibold rounded-lg shadow-sm border border-neutral-800 hover:border-neutral-600 transition-colors">
                                Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-neutral-950 text-neutral-500 border-b border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wider">Timestamp</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Action Type</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Target</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Delivery Channel</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Status/Result</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {ACTION_LOGS.map(log => (
                                    <tr key={log.id} className="hover:bg-neutral-800/30 transition-colors group">
                                        <td className="px-6 py-4 text-neutral-400 font-mono text-xs">{log.time}</td>
                                        <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                                            <span className="text-emerald-500 text-xs">⚡</span> {log.action}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-300">{log.target}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-neutral-950 border border-neutral-700 rounded text-xs text-neutral-400 font-bold font-mono">
                                                {log.channel}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded border ${log.result === 'Delivered' || log.result === 'Sent' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                                }`}>
                                                {log.result}
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

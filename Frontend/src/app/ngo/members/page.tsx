import React from 'react';
import Link from 'next/link';

export default function NGOMembersPage() {
    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Members</h2>
                    <p className="text-neutral-400 text-sm">List of all members participating in the training program.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors border border-neutral-700">Import CSV</button>
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(234,88,12,0.3)]">+ Add Member</button>
                </div>
            </div>

            {/* SEAT WARNING PANEL */}
            <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-xl text-orange-400">⚠️</span>
                    <div>
                        <p className="font-bold text-orange-400 text-sm">You have 8 seats remaining on the free tier.</p>
                        <p className="text-xs text-orange-400/80">Upgrade to add more.</p>
                    </div>
                </div>
                <Link href="/ngo/reports/plan">
                    <button className="px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs font-bold rounded border border-orange-500/30 transition-colors uppercase tracking-wider">Upgrade</button>
                </Link>
            </div>

            {/* MEMBERS TABLE */}
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-lg">
                <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-black/20">
                    <div className="relative w-64">
                        <input type="text" placeholder="Search members..." className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50" />
                        <svg className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <button className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold rounded border border-neutral-800 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                        Filter
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/30 border-b border-neutral-800 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                <th className="px-5 py-4">Name</th>
                                <th className="px-5 py-4">Role</th>
                                <th className="px-5 py-4">Training Completion</th>
                                <th className="px-5 py-4">Certificates</th>
                                <th className="px-5 py-4">Last Login</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {[
                                { name: 'Amara Nkosi', email: 'amara.n@safenet.ug', role: 'Community Educator', cmp: 100, certs: '1 valid certificate', login: '2 hours ago', status: 'Active', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
                                { name: 'Grace Auma', email: 'grace.a@safenet.ug', role: 'Youth Trainer', cmp: 88, certs: '1 certificate', login: '1 day ago', status: 'Active', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
                                { name: 'Joseph Okello', email: 'joseph.o@safenet.ug', role: 'Field Worker', cmp: 62, certs: 'No certificates', login: '3 days ago', status: 'In Progress', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                                { name: 'Fatima Hassan', email: 'fatima.h@safenet.ug', role: 'Programme Lead', cmp: 79, certs: '1 certificate expiring', login: '5 days ago', status: 'Warning', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
                                { name: 'Emmanuel Kato', email: 'emmanuel.k@safenet.ug', role: 'Community Educator', cmp: 41, certs: 'Needs remedial training', login: '2 weeks ago', status: 'At Risk', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
                                { name: 'David Ssali', email: 'david.s@safenet.ug', role: 'New Member', cmp: 0, certs: 'Enrolled', login: 'Never', status: 'Pending', badge: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20' },
                            ].map((user, i) => (
                                <tr key={i} className="hover:bg-neutral-800/30 transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-300">
                                                {user.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{user.name}</p>
                                                <p className="text-xs text-neutral-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral-300">{user.role}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${user.cmp}%` }}></div>
                                            </div>
                                            <span className="text-sm font-medium text-white">{user.cmp}%</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral-400">{user.certs}</td>
                                    <td className="px-5 py-4 text-xs text-neutral-500">{user.login}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${user.badge}`}>{user.status}</span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {user.cmp === 0 ? (
                                                <button className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded border border-neutral-700 text-xs font-semibold">Welcome Member</button>
                                            ) : user.cmp < 50 ? (
                                                <button className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded border border-red-500/30 text-xs font-semibold">Send Reminder</button>
                                            ) : (
                                                <button className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 text-xs font-semibold">View Member</button>
                                            )}
                                        </div>
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

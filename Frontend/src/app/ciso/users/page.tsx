'use client';
import React, { useState } from 'react';

const users = [
    { name: 'Alice Johnson', email: 'alice@acme.com', dept: 'Engineering', role: 'Software Engineer', risk: 18, training: 96, certs: 'Valid', login: '2h ago' },
    { name: 'Dan Brown', email: 'dan@acme.com', dept: 'Finance', role: 'Finance Manager', risk: 84, training: 22, certs: 'Failed', login: '3 days ago' },
    { name: 'Lisa Chen', email: 'lisa@acme.com', dept: 'Sales', role: 'Account Executive', risk: 79, training: 38, certs: 'None', login: '1 day ago' },
    { name: 'Grace Williams', email: 'grace@acme.com', dept: 'HR', role: 'HR Director', risk: 43, training: 88, certs: 'Valid', login: '5h ago' },
    { name: 'Tom Reeves', email: 'tom@acme.com', dept: 'Executives', role: 'CTO', risk: 35, training: 91, certs: 'Valid', login: 'Today' },
    { name: 'James Okafor', email: 'james@acme.com', dept: 'Sales', role: 'SDR', risk: 65, training: 60, certs: 'None', login: '4 days ago' },
    { name: 'Sarah Park', email: 'sarah@acme.com', dept: 'Finance', role: 'Financial Analyst', risk: 68, training: 55, certs: 'None', login: '6 days ago' },
    { name: 'Mike Torres', email: 'mike@acme.com', dept: 'Operations', role: 'Operations Lead', risk: 71, training: 41, certs: 'None', login: '2 days ago' },
];

export default function AllUsersPage() {
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [msg, setMsg] = useState('');
    const act = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchDept = deptFilter === 'All' || u.dept === deptFilter;
        return matchSearch && matchDept;
    });

    const depts = ['All', ...Array.from(new Set(users.map(u => u.dept)))];

    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">All Users</h2>
                    <p className="text-sm text-neutral-400 mt-1">Full employee roster and security posture for Acme Corp.</p>
                </div>
                <button onClick={() => act('📄 Exporting all users as CSV…')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">Export CSV</button>
            </div>

            {msg && <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold">{msg}</div>}

            <div className="flex flex-wrap gap-3">
                <div className="relative">
                    <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search by name or email…" className="bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 w-72" />
                    <svg className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="bg-neutral-950 border border-neutral-800 text-neutral-300 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500/50">
                    {depts.map(d => <option key={d}>{d}</option>)}
                </select>
            </div>

            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/40 border-b border-neutral-800 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                <th className="px-5 py-4">Employee</th>
                                <th className="px-5 py-4">Department</th>
                                <th className="px-5 py-4">Role</th>
                                <th className="px-5 py-4 text-center">Risk Score</th>
                                <th className="px-5 py-4 text-center">Training %</th>
                                <th className="px-5 py-4 text-center">Certs</th>
                                <th className="px-5 py-4">Last Login</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {filtered.map((u, i) => (
                                <tr key={i} className="hover:bg-neutral-800/30 transition-colors group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${u.risk >= 70 ? 'bg-red-500/20 text-red-400 border-red-500/20' : 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>
                                                {u.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">{u.name}</p>
                                                <p className="text-xs text-neutral-500">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral-400">{u.dept}</td>
                                    <td className="px-5 py-4 text-xs text-neutral-500">{u.role}</td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`text-lg font-black ${u.risk >= 70 ? 'text-red-400' : u.risk >= 50 ? 'text-orange-400' : u.risk >= 30 ? 'text-yellow-400' : 'text-green-400'}`}>{u.risk}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-14 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${u.training > 75 ? 'bg-green-500' : u.training > 50 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${u.training}%` }} />
                                            </div>
                                            <span className="text-xs font-bold text-white">{u.training}%</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${u.certs === 'Valid' ? 'text-green-400 bg-green-500/10 border-green-500/20' : u.certs === 'Failed' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-neutral-500 bg-neutral-800 border-neutral-700'}`}>{u.certs}</span>
                                    </td>
                                    <td className="px-5 py-4 text-xs text-neutral-500">{u.login}</td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex gap-1.5 justify-end">
                                            <button onClick={() => { alert('Opening full employee security profile for ' + u.name); act(`👤 Viewing profile for ${u.name}…`); }} className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 rounded text-xs font-semibold shadow-md transition-colors">Profile</button>
                                            {u.risk >= 60 && <button onClick={() => { alert('Assigned mandatory remedial security training modules to ' + u.name); act(`📚 Assigned remedial training for ${u.name}`); }} className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white border border-red-500 rounded text-xs font-semibold shadow-md transition-colors">Remedial</button>}
                                            <button onClick={() => { alert('Automated security reminder successfully dispatched to ' + u.name); act(`📬 Reminder sent to ${u.name}`); }} className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 rounded text-xs font-semibold shadow-md transition-colors">Remind</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && <div className="p-10 text-center text-neutral-500">No users match your search.</div>}
                </div>
            </div>
        </div>
    );
}

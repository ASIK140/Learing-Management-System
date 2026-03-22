import React from 'react';

export default function NGOCertificatesPage() {
    return (
        <div className="flex flex-col gap-6 max-w-[1600px] mx-auto">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Certificates</h2>
                    <p className="text-neutral-400 text-sm">Certificates issued to NGO members.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors border border-neutral-700">Export CSV</button>
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(234,88,12,0.3)] flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download All
                    </button>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Valid Certificates', value: '29', icon: '✅', color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: 'Expiring in 60 days', value: '2', icon: '⏳', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
                    { label: 'Expired', value: '0', icon: '❌', color: 'text-red-400', bg: 'bg-red-500/10' },
                    { label: 'Never Earned', value: '11', icon: '🚷', color: 'text-neutral-400', bg: 'bg-neutral-500/10' },
                ].map(kpi => (
                    <div key={kpi.label} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col shadow-sm">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${kpi.bg} ${kpi.color}`}>{kpi.icon}</span>
                            <span className="text-xs font-semibold text-neutral-400">{kpi.label}</span>
                        </div>
                        <p className={`text-2xl font-bold mt-1 pl-1 ${kpi.label === 'Expired' && kpi.value === '0' ? 'text-neutral-500' : 'text-white'}`}>{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* CERTIFICATE TABLE */}
            <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-lg mt-2">
                <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-black/20">
                    <div className="relative w-72">
                        <input type="text" placeholder="Search by member or course..." className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50" />
                        <svg className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <div className="flex gap-2">
                        <select className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 outline-none">
                            <option>All Courses</option>
                            <option>PHISH-01</option>
                            <option>GDPR-01</option>
                        </select>
                        <select className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-300 outline-none">
                            <option>All Statuses</option>
                            <option>Valid</option>
                            <option>Expiring</option>
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-black/40 border-b border-neutral-800 text-xs font-bold text-neutral-500 uppercase tracking-wider">
                                <th className="px-5 py-4">Member</th>
                                <th className="px-5 py-4">Course</th>
                                <th className="px-5 py-4 text-center">Score</th>
                                <th className="px-5 py-4">Issued Date</th>
                                <th className="px-5 py-4">Expiry Date</th>
                                <th className="px-5 py-4 text-center">CPD Hours</th>
                                <th className="px-5 py-4 text-center">Status</th>
                                <th className="px-5 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {[
                                { name: 'Amara Nkosi', course: 'PHISH-01', score: '84%', issued: '12 Oct 2024', expiry: '12 Oct 2025', cpd: '1.5h', status: 'Valid', color: 'green' },
                                { name: 'Grace Auma', course: 'PHISH-01', score: '79%', issued: '15 Oct 2024', expiry: '15 Oct 2025', cpd: '1.5h', status: 'Valid', color: 'green' },
                                { name: 'Joseph Okello', course: 'PHISH-01', score: '76%', issued: '20 Oct 2024', expiry: '20 Oct 2025', cpd: '1.5h', status: 'Valid', color: 'green' },
                                { name: 'Fatima Hassan', course: 'GDPR-01', score: '88%', issued: '02 Mar 2024', expiry: '02 Mar 2025', cpd: '2.0h', status: 'Expiring soon', color: 'yellow' },
                                { name: 'Emmanuel Kato', course: 'PHISH-01', score: 'Failed', issued: '-', expiry: '-', cpd: '0h', status: 'Failed', color: 'red' },
                            ].map((cert, i) => (
                                <tr key={i} className="hover:bg-neutral-800/30 transition-colors group">
                                    <td className="px-5 py-4">
                                        <span className="text-sm font-bold text-white">{cert.name}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="text-sm text-neutral-300 bg-neutral-800 px-2 py-0.5 rounded font-mono text-xs">{cert.course}</span>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`text-sm font-bold ${cert.score === 'Failed' ? 'text-red-400' : 'text-green-400'}`}>{cert.score}</span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral-400">{cert.issued}</td>
                                    <td className="px-5 py-4 text-sm text-neutral-400">{cert.expiry}</td>
                                    <td className="px-5 py-4 text-center text-sm font-medium text-blue-400">{cert.cpd}</td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border bg-${cert.color}-500/10 text-${cert.color}-400 border-${cert.color}-500/20`}>{cert.status}</span>
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {cert.status === 'Failed' ? (
                                                <button className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded border border-red-500/30 text-xs font-semibold">Retake Exam</button>
                                            ) : cert.status.includes('Expiring') ? (
                                                <button className="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 rounded border border-yellow-500/30 text-xs font-semibold">Send Reminder</button>
                                            ) : (
                                                <button className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 text-xs font-semibold flex items-center gap-1.5">
                                                    PDF
                                                </button>
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

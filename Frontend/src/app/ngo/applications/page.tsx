'use client';
import React, { useState } from 'react';

const applications = [
    { id: 'APP-1029', organization: 'Digital Literacy Foundation', country: 'India', type: 'Community Ed', focus: 'Youth Cyber Safety', applied: '2 hours ago', status: 'Pending Review', score: 'High Fit' },
    { id: 'APP-1028', organization: 'Rural Tech Initiative', country: 'Kenya', type: 'Skills Training', focus: 'Basic Device Security', applied: '5 hours ago', status: 'Pending Review', score: 'High Fit' },
    { id: 'APP-1027', organization: 'Women In Cyberspace', country: 'Brazil', type: 'Advocacy', focus: 'Anti-Harassment', applied: '1 day ago', status: 'Under Evaluation', score: 'Medium Fit' },
    { id: 'APP-1026', organization: 'Code For Seniors', country: 'UK', type: 'Community Ed', focus: 'Phishing Defense', applied: '2 days ago', status: 'Approved', score: 'High Fit' },
    { id: 'APP-1025', organization: 'Global Privacy Watch', country: 'USA', type: 'Think Tank', focus: 'Policy Research', applied: '3 days ago', status: 'Rejected', score: 'Low Fit' },
    { id: 'APP-1024', organization: 'EduNet Africa', country: 'Nigeria', type: 'School Program', focus: 'Teacher Training', applied: '1 week ago', status: 'Approved', score: 'High Fit' },
];

export default function NGOApplicationsPage() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [selectedApp, setSelectedApp] = useState<any | null>(null);

    const filtered = applications.filter(a =>
        (statusFilter === 'All' || a.status === statusFilter) &&
        (a.organization.toLowerCase().includes(search.toLowerCase()) || a.country.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <>
            {/* ── Page Content ── */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                    <p className="text-neutral-400 text-sm">Review and approve applications from Non-Governmental Organizations seeking access to the CyberShield Community Edition.</p>
                    <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg border border-neutral-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Export CSV
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                        <p className="text-xs text-neutral-500 mb-1">Pending Reviews</p>
                        <p className="text-3xl font-bold text-blue-400">14</p>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                        <p className="text-xs text-neutral-500 mb-1">Approved (30d)</p>
                        <p className="text-3xl font-bold text-green-400">42</p>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                        <p className="text-xs text-neutral-500 mb-1">Rejected (30d)</p>
                        <p className="text-3xl font-bold text-red-400">8</p>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                        <p className="text-xs text-neutral-500 mb-1">Average Review Time</p>
                        <p className="text-3xl font-bold text-white">1.8 <span className="text-lg text-neutral-500 font-normal">days</span></p>
                    </div>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                    <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-neutral-900 border-b border-neutral-800">
                        <div className="relative w-full max-w-sm">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-neutral-500">🔍</span>
                            <input type="text" placeholder="Search by organization or country..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-green-500" />
                        </div>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-green-500 cursor-pointer">
                            <option value="All">All Statuses</option>
                            <option>Pending Review</option>
                            <option>Under Evaluation</option>
                            <option>Approved</option>
                            <option>Rejected</option>
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm whitespace-nowrap">
                            <thead className="bg-neutral-800/30 border-b border-neutral-800">
                                <tr className="text-neutral-500 text-[11px] uppercase tracking-wider">
                                    <th className="px-6 py-4 text-left font-semibold">Organization</th>
                                    <th className="px-6 py-4 text-left font-semibold">Location</th>
                                    <th className="px-6 py-4 text-left font-semibold">Program Focus</th>
                                    <th className="px-6 py-4 text-left font-semibold">Fit Score</th>
                                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left font-semibold">Applied</th>
                                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {filtered.map(app => (
                                    <tr key={app.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-white">{app.organization}</p>
                                            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">{app.id}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">🌍</span>
                                                <span className="text-neutral-300">{app.country}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white text-xs">{app.focus}</p>
                                            <p className="text-[10px] text-neutral-500 bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 rounded inline-block mt-1">{app.type}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${app.score === 'High Fit' ? 'bg-green-500' : app.score === 'Medium Fit' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                                <span className={`text-xs font-semibold ${app.score === 'High Fit' ? 'text-green-400' : app.score === 'Medium Fit' ? 'text-yellow-400' : 'text-red-400'}`}>{app.score}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${app.status === 'Approved' ? 'bg-green-400/10 text-green-400 border-green-500/20' : app.status === 'Rejected' ? 'bg-red-400/10 text-red-400 border-red-500/20' : app.status === 'Under Evaluation' ? 'bg-purple-400/10 text-purple-400 border-purple-500/20' : 'bg-blue-400/10 text-blue-400 border-blue-500/20'}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-400 text-xs">{app.applied}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => { setSelectedApp(app); setActiveModal('review'); }} className="px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white rounded border border-neutral-700 transition-colors">
                                                Review Application
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">No applications found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Review Modal ── */}
            {activeModal === 'review' && selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/80">
                            <div>
                                <h3 className="font-bold text-white text-lg">{selectedApp.organization}</h3>
                                <p className="text-xs text-neutral-500 font-mono mt-0.5">Application ID: {selectedApp.id}</p>
                            </div>
                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${selectedApp.status === 'Approved' ? 'bg-green-400/10 text-green-400 border-green-500/20' : selectedApp.status === 'Rejected' ? 'bg-red-400/10 text-red-400 border-red-500/20' : 'bg-blue-400/10 text-blue-400 border-blue-500/20'}`}>
                                {selectedApp.status}
                            </span>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-neutral-950 p-4 border border-neutral-800 rounded-xl">
                                    <p className="text-[10px] text-neutral-500 uppercase font-semibold mb-1">Primary Contact</p>
                                    <p className="text-sm text-white font-medium">Dr. Amina Abiola</p>
                                    <p className="text-xs text-blue-400 mt-0.5">director@{selectedApp.organization.toLowerCase().replace(/ /g, '')}.org</p>
                                </div>
                                <div className="bg-neutral-950 p-4 border border-neutral-800 rounded-xl">
                                    <p className="text-[10px] text-neutral-500 uppercase font-semibold mb-1">Location &amp; Size</p>
                                    <p className="text-sm text-white font-medium">{selectedApp.country}</p>
                                    <p className="text-xs text-neutral-400 mt-0.5">Est. Reach: 5,000+ members/yr</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-3">Program Proposal</h4>
                                <div className="space-y-4 text-sm text-neutral-300">
                                    <div>
                                        <p className="text-xs font-semibold text-neutral-500 mb-1">Organization Mission</p>
                                        <p className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">We aim to bridge the digital divide by providing essential digital literacy and safety training to underserved communities in {selectedApp.country}.</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-neutral-500 mb-1">How CyberShield Will Be Used</p>
                                        <p className="bg-neutral-950 p-3 rounded-lg border border-neutral-800">We plan to integrate the CyberShield &apos;{selectedApp.focus}&apos; modules into our existing curriculum.</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-white mb-2">Reviewer Notes</h4>
                                <textarea rows={3} placeholder="Add internal notes about this application..." className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 resize-none" />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-neutral-800 flex justify-between items-center bg-neutral-900">
                            <button onClick={() => { setActiveModal(null); setSelectedApp(null); }} className="px-5 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">Cancel</button>
                            {selectedApp.status === 'Pending Review' || selectedApp.status === 'Under Evaluation' ? (
                                <div className="flex gap-2">
                                    <button onClick={() => { setActiveModal(null); setSelectedApp(null); }} className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 text-sm font-medium rounded-lg transition-colors border border-red-500/20">Reject Application</button>
                                    <button onClick={() => { setActiveModal(null); setSelectedApp(null); }} className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">Approve &amp; Provision Tenant</button>
                                </div>
                            ) : (
                                <button onClick={() => { setActiveModal(null); setSelectedApp(null); }} className="px-5 py-2 bg-neutral-800 text-white text-sm font-medium rounded-lg transition-colors border border-neutral-700">Close Review</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

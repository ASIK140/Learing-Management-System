'use client';
import React, { useState } from 'react';

const activeNGOs = [
    { id: 'NGO-782', name: 'Digital Literacy Foundation', region: 'India', tier: 'Community Pro', seats: '350 / 500', joined: 'Oct 12, 2023', status: 'Healthy', utilization: 70 },
    { id: 'NGO-781', name: 'Rural Tech Initiative', region: 'Kenya', tier: 'Community Basic', seats: '120 / 150', joined: 'Jan 05, 2024', status: 'Healthy', utilization: 80 },
    { id: 'NGO-780', name: 'Women In Cyberspace', region: 'Brazil', tier: 'Community Elite', seats: '950 / 2000', joined: 'May 22, 2023', status: 'Healthy', utilization: 47 },
    { id: 'NGO-779', name: 'Code For Seniors', region: 'UK', tier: 'Community Basic', seats: '145 / 150', joined: 'Nov 18, 2024', status: 'Warning', utilization: 96 },
    { id: 'NGO-778', name: 'EduNet Africa', region: 'Nigeria', tier: 'Community Pro', seats: '480 / 500', joined: 'Feb 10, 2025', status: 'Warning', utilization: 96 },
    { id: 'NGO-777', name: 'CyberAware Youth', region: 'Australia', tier: 'Community Basic', seats: '12 / 150', joined: 'Mar 01, 2022', status: 'Inactive', utilization: 8 },
];

export default function ActiveNGOsPage() {
    const [search, setSearch] = useState('');
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [selectedNGO, setSelectedNGO] = useState<any | null>(null);

    const filtered = activeNGOs.filter(n =>
        n.name.toLowerCase().includes(search.toLowerCase()) ||
        n.region.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {/* ── Page Content ── */}
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                    <p className="text-neutral-400 text-sm">Manage enrolled Non-Governmental Organizations spanning the CyberShield Community Edition program.</p>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all whitespace-nowrap">
                        + Provision New NGO
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
                        <p className="text-xs text-neutral-500 mb-1">Total Active NGOs</p>
                        <p className="text-3xl font-bold text-white">124</p>
                        <p className="text-xs text-green-500 mt-1">↑ 12% YoY growth</p>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                        <p className="text-xs text-neutral-500 mb-1">Total Community Users</p>
                        <p className="text-3xl font-bold text-white">48,250</p>
                        <p className="text-xs text-neutral-500 mt-1">Across all NGO tenants</p>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
                        <p className="text-xs text-neutral-500 mb-1">Total Subsidized Value</p>
                        <p className="text-3xl font-bold text-white">$1.2M</p>
                        <p className="text-xs text-neutral-500 mt-1">Equivalency to corporate tier</p>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                        <p className="text-xs text-neutral-500 mb-1">Seat Limit Warnings</p>
                        <p className="text-3xl font-bold text-red-500">18</p>
                        <p className="text-xs text-red-400 mt-1">NGOs &gt; 90% seat capacity</p>
                    </div>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                    <div className="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-neutral-900 border-b border-neutral-800">
                        <div className="relative w-full max-w-sm">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-neutral-500">🔍</span>
                            <input type="text" placeholder="Search NGO name or region..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-green-500" />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm whitespace-nowrap">
                            <thead className="bg-neutral-800/30 border-b border-neutral-800">
                                <tr className="text-neutral-500 text-[11px] uppercase tracking-wider">
                                    <th className="px-6 py-4 text-left font-semibold">NGO / Tenant Name</th>
                                    <th className="px-6 py-4 text-left font-semibold">Region</th>
                                    <th className="px-6 py-4 text-left font-semibold">Grant Tier</th>
                                    <th className="px-6 py-4 text-left font-semibold">Seat Utilization</th>
                                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left font-semibold">Joined Date</th>
                                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {filtered.map(ngo => (
                                    <tr key={ngo.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-white">{ngo.name}</p>
                                            <p className="text-[11px] text-neutral-500 font-mono mt-0.5">{ngo.id}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">🌍</span>
                                                <span className="text-neutral-300">{ngo.region}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-300">{ngo.tier}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5 w-32">
                                                <div className="flex justify-between text-[10px] text-neutral-400">
                                                    <span>{ngo.seats}</span>
                                                    <span className={ngo.utilization > 90 ? 'text-red-400 font-bold' : ''}>{ngo.utilization}%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full ${ngo.utilization > 90 ? 'bg-red-500' : ngo.utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${ngo.utilization}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${ngo.status === 'Healthy' ? 'bg-green-400/10 text-green-400 border-green-500/20' : ngo.status === 'Warning' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-500/20' : 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>
                                                {ngo.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-400 text-xs">{ngo.joined}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => { setSelectedNGO(ngo); setActiveModal('manage'); }} className="px-3 py-1.5 text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white rounded border border-neutral-700 transition-colors">
                                                Manage Tenant
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-neutral-500">No active NGOs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── Manage Tenant Modal ── */}
            {activeModal === 'manage' && selectedNGO && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/80">
                            <div>
                                <h3 className="font-bold text-white text-lg">Manage: {selectedNGO.name}</h3>
                                <p className="text-xs text-neutral-500 font-mono mt-0.5">Tenant ID: {selectedNGO.id}</p>
                            </div>
                            <button onClick={() => { setActiveModal(null); setSelectedNGO(null); }} className="text-neutral-500 hover:text-white transition-colors text-2xl">×</button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className={`p-4 rounded-xl border ${selectedNGO.utilization > 90 ? 'bg-red-500/10 border-red-500/20' : 'bg-neutral-950 border-neutral-800'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className={`text-sm font-semibold ${selectedNGO.utilization > 90 ? 'text-red-400' : 'text-white'}`}>Seat Capacity: {selectedNGO.utilization}%</h4>
                                    <span className="text-xs text-neutral-400">{selectedNGO.seats} Users</span>
                                </div>
                                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden mb-4">
                                    <div className={`h-full rounded-full ${selectedNGO.utilization > 90 ? 'bg-red-500 animate-pulse' : selectedNGO.utilization > 75 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${selectedNGO.utilization}%` }}></div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg border border-neutral-700 transition-colors">Increase Grant Seats</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Update Grant Tier</label>
                                    <select defaultValue={selectedNGO.tier} className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-green-500">
                                        <option>Community Basic</option>
                                        <option>Community Pro</option>
                                        <option>Community Elite</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Partner Status</label>
                                    <select defaultValue={selectedNGO.status === 'Inactive' ? 'Suspended' : 'Active'} className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-green-500">
                                        <option>Active</option>
                                        <option>Suspended</option>
                                        <option>Revoked</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                                <div>
                                    <p className="text-sm font-bold text-white">Generate Custom Impact Report</p>
                                    <p className="text-xs text-neutral-400 mt-1">Export full learner analytics for {selectedNGO.name}</p>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors">Download PDF</button>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-900">
                            <button onClick={() => { setActiveModal(null); setSelectedNGO(null); }} className="px-5 py-2.5 text-sm font-medium text-neutral-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={() => { setActiveModal(null); setSelectedNGO(null); }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors border border-blue-500">Save Configuration</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

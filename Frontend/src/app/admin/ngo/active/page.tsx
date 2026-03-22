'use client';
import React, { useEffect, useState } from 'react';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout';
import { apiFetch } from '@/utils/api';

const statusBadge: any = {
    'Active': 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
    'Low Engagement': 'text-amber-400 bg-amber-400/10 border-amber-500/20',
    'Suspended': 'text-red-400 bg-red-400/10 border-red-500/20',
};

export default function ActiveNGOsPage() {
    const [ngos, setNgos] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const [selectedNgo, setSelectedNgo] = useState<any | null>(null);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [upgradeData, setUpgradeData] = useState({
        new_plan: '',
        new_member_limit: 0,
        subsidy_percentage: 0
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ngoRes, statsRes] = await Promise.all([
                apiFetch(`/admin/ngo/active?t=${Date.now()}`),
                apiFetch(`/admin/ngo/stats?t=${Date.now()}`)
            ]);
            const ngosJson = await ngoRes.json();
            const statsJson = await statsRes.json();
            
            if (ngosJson.success) setNgos(ngosJson.data);
            if (statsJson.success) setStats(statsJson.stats);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSuspend = async (id: string) => {
        if (!confirm('Are you sure you want to suspend this NGO? Their platform access will be revoked.')) return;
        setProcessingId(id);
        const payload = { 
            tenant_id: id,
            reason: 'Administrative suspension' 
        };
        console.log('Sending Suspend Payload:', payload);
        try {
            const res = await apiFetch('/admin/ngo/suspend', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            const json = await res.json();
            if (json.success) {
                fetchData();
            }
        } catch (err) {
            console.error('Suspend failed', err);
        } finally {
            setProcessingId(null);
        }
    };

    const handleUpgrade = async () => {
        if (!selectedNgo) return;
        setProcessingId(selectedNgo.ngo_program_id);
        const payload = { 
            tenant_id: selectedNgo.ngo_program_id,
            new_plan: upgradeData.new_plan,
            new_member_limit: upgradeData.new_member_limit,
            subsidy_percentage: upgradeData.subsidy_percentage
        };
        console.log('Final Upgrade Payload:', payload);
        try {
            const res = await apiFetch('/admin/ngo/upgrade-plan', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                // Optimistic UI update
                setNgos(prev => prev.map(n => 
                    n.ngo_program_id === selectedNgo.ngo_program_id 
                    ? { ...n, proposed_plan: upgradeData.new_plan, member_limit: upgradeData.new_member_limit }
                    : n
                ));
                setUpgradeModalOpen(false);
                fetchData(); // Sync with server
            }
        } catch (err) {
            console.error('Upgrade failed', err);
        } finally {
            setProcessingId(null);
        }
    };

    const handleExportImpact = async () => {
        setExporting(true);
        try {
            // Simulated export delay
            await new Promise(r => setTimeout(r, 1500));
            const res = await apiFetch('/admin/ngo/impact-report');
            const json = await res.json();
            if (json.success) {
                alert('Impact Report Generated Successfully!\nMembers Trained: ' + json.data.members_trained + '\nCertificates: ' + json.data.certificates_issued);
            }
        } catch (err) {
            console.error('Export failed', err);
        } finally {
            setExporting(false);
        }
    };

    return (
        <SuperAdminLayout title="Active NGO Dashboard">
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Active NGOs', value: stats?.active_ngos || '0', color: 'text-emerald-400' },
                        { label: 'Total Members', value: stats?.total_members || '0', color: 'text-blue-400' },
                        { label: 'Certificates Issued', value: stats?.certificates_issued || '0', color: 'text-purple-400' },
                        { label: 'Countries Reached', value: stats?.countries_reached || '0', color: 'text-orange-400' },
                    ].map((s, idx) => (
                        <div key={`stats-card-${s.label}-${idx}`} className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-lg">
                            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{s.label}</p>
                            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Main Table */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-black/20">
                        <h3 className="text-sm font-bold text-white">NGO Performance Monitoring</h3>
                        <button 
                            onClick={handleExportImpact}
                            disabled={exporting}
                            className={`text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded shadow-lg transition-all flex items-center gap-2 ${exporting ? 'opacity-50' : ''}`}
                        >
                            {exporting ? (
                                <>
                                    <svg className="animate-spin h-3 w-3 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    GENERATING...
                                </>
                            ) : 'EXPORT IMPACT REPORT'}
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-black/30 text-neutral-400 uppercase tracking-tighter font-bold">
                                    <th className="px-6 py-4 font-black">Organization</th>
                                    <th className="px-6 py-4 font-black text-center">Country</th>
                                    <th className="px-6 py-4 font-black">Plan & Subsidy</th>
                                    <th className="px-6 py-4 font-black">Members</th>
                                    <th className="px-6 py-4 font-black">Completion</th>
                                    <th className="px-6 py-4 font-black">Certificates</th>
                                    <th className="px-6 py-4 font-black">Status</th>
                                    <th className="px-6 py-4 font-black text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {loading ? (
                                    <tr key="active-ngo-loading-row-full">
                                        <td colSpan={8} className="px-6 py-12 text-center text-neutral-500 animate-pulse font-bold">Syncing platform data...</td>
                                    </tr>
                                ) : (
                                    ngos.map((ngo, idx) => (
                                        <tr key={`ngo-list-row-${ngo.ngo_program_id || idx}`} className="hover:bg-neutral-800/40 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center font-bold text-neutral-400 group-hover:text-white transition-colors">
                                                        {ngo.organization_name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{ngo.organization_name}</p>
                                                        <p className="text-[10px] text-neutral-500 mt-0.5 uppercase tracking-widest">{ngo.ngo_id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center font-bold text-neutral-400">
                                                <span className="px-2 py-1 rounded bg-neutral-800 text-white border border-neutral-700">{ngo.country}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-white font-black">{ngo.plan}</p>
                                                <p className="text-blue-400 font-bold mt-0.5">{ngo.subsidy_percentage}% Subsidized</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-white font-bold">{ngo.members_count} / {ngo.member_limit}</p>
                                                <div className="w-24 h-1.5 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                                                    <div className="h-full bg-blue-500" style={{ width: `${(ngo.members_count / ngo.member_limit) * 100}%` }}></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`font-black text-base ${ngo.completion_rate < 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                    {ngo.completion_rate}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-white font-black">
                                                {ngo.certificates_issued}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusBadge[ngo.status] || 'text-neutral-400 bg-neutral-800/50 border-neutral-700'}`}>
                                                    {ngo.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2 transition-opacity">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedNgo(ngo);
                                                            setUpgradeData({
                                                                new_plan: ngo.plan,
                                                                new_member_limit: ngo.member_limit,
                                                                subsidy_percentage: ngo.subsidy_percentage
                                                            });
                                                            setUpgradeModalOpen(true);
                                                        }}
                                                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border border-neutral-700 transition-colors" 
                                                        title="Modify Plan & Quota"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleSuspend(ngo.ngo_program_id)}
                                                        className="p-1.5 rounded-lg bg-red-900/10 hover:bg-red-900/20 text-red-400 border border-red-500/20 transition-colors" 
                                                        title="Suspend NGO"
                                                        disabled={processingId !== null}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-6 py-4 bg-neutral-900/30 border-t border-neutral-800">
                        <p className="text-[10px] text-neutral-500 font-medium italic">
                            * NGOs with completion rates below 60% are automatically flagged as "Low Engagement".
                        </p>
                    </div>
                </div>

                {/* Upgrade Modal */}
                {upgradeModalOpen && selectedNgo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                            <div className="px-6 py-4 bg-neutral-800/50 border-b border-neutral-800 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Adjust Plan: {selectedNgo.organization_name}</h3>
                                <button onClick={() => setUpgradeModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1.5 block">Subscription Tier</label>
                                    <select 
                                        className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                        value={upgradeData.new_plan}
                                        onChange={(e) => setUpgradeData({...upgradeData, new_plan: e.target.value})}
                                    >
                                        <option value="Starter">Starter</option>
                                        <option value="Premium">Premium</option>
                                        <option value="Enterprise">Enterprise</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-400 uppercase mb-1.5 block">Member Limit</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                                        value={isNaN(upgradeData.new_member_limit) ? '' : upgradeData.new_member_limit}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setUpgradeData({...upgradeData, new_member_limit: isNaN(val) ? 0 : val});
                                        }}
                                    />
                                </div>
                                <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                                    <button 
                                        onClick={() => setUpgradeModalOpen(false)}
                                        className="px-4 py-2 text-[10px] font-bold text-neutral-400 hover:text-white transition-colors"
                                    >
                                        CANCEL
                                    </button>
                                    <button 
                                        onClick={handleUpgrade}
                                        className="px-6 py-2 text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg"
                                        disabled={processingId !== null}
                                    >
                                        {processingId === selectedNgo.ngo_id ? 'UPDATING...' : 'SAVE CHANGES'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </SuperAdminLayout>
    );
}

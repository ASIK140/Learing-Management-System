'use client';
import React, { useEffect, useState } from 'react';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout';
import { apiFetch } from '@/utils/api';

const statusColors: any = {
    'Pending': 'text-amber-400 bg-amber-400/10 border-amber-500/20',
    'Under Review': 'text-blue-400 bg-blue-400/10 border-blue-500/20',
    'Approved': 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
    'Rejected': 'text-red-400 bg-red-400/10 border-red-500/20',
    'More Info Required': 'text-purple-400 bg-purple-400/10 border-purple-500/20',
};

export default function NGOApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const [selectedApp, setSelectedApp] = useState<any | null>(null);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await apiFetch('/admin/ngo/applications');
            const json = await res.json();
            if (json.success) setApplications(json.applications);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleAction = async (id: string, action: string) => {
        setProcessingId(id);
        try {
            let endpoint = '/admin/ngo/applications/approve';
            if (action === 'reject') endpoint = '/admin/ngo/applications/reject';
            if (action === 'request-info') endpoint = '/admin/ngo/applications/request-info';

            const res = await apiFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify({ application_id: id, reason: 'Manual review action', details: 'Manual review action' })
            });
            const json = await res.json();
            if (json.success) {
                setSelectedApp(null);
                fetchApplications();
            }
        } catch (err) {
            console.error('Action failed', err);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <SuperAdminLayout title="NGO Applications">
            <div className="space-y-6">
                {/* Header with Export */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Application Review Queue</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => apiFetch('/admin/ngo/applications/export/csv').then(() => alert('CSV Export Started'))}
                            className="px-3 py-1.5 text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 transition-colors"
                        >
                            EXPORT CSV
                        </button>
                        <button 
                            onClick={() => apiFetch('/admin/ngo/applications/export/excel').then(() => alert('Excel Export Started'))}
                            className="px-3 py-1.5 text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 transition-colors"
                        >
                            EXPORT EXCEL
                        </button>
                    </div>
                </div>

                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                        <p className="text-xs text-neutral-500 font-medium">Pending Review</p>
                        <p className="text-2xl font-bold text-amber-400 mt-1">
                            {applications.filter(a => a.status === 'Pending').length}
                        </p>
                    </div>
                    <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                        <p className="text-xs text-neutral-500 font-medium">Under Review</p>
                        <p className="text-2xl font-bold text-blue-400 mt-1">
                            {applications.filter(a => a.status === 'Under Review').length}
                        </p>
                    </div>
                    <div className="bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl">
                        <p className="text-xs text-neutral-500 font-medium">Total Received</p>
                        <p className="text-2xl font-bold text-white mt-1">{applications.length}</p>
                    </div>
                </div>

                {/* Applications Table */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-black/50 border-b border-neutral-800">
                                    <th className="px-4 py-3 font-semibold text-neutral-400">ORGANIZATION</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-400">COUNTRY</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-400">TYPE</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-400">MEMBERS</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-400">FUNDING</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-400">PROPOSED TIER</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-400">STATUS</th>
                                    <th className="px-4 py-3 font-semibold text-neutral-400 text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                                            Loading applications...
                                        </td>
                                    </tr>
                                ) : applications.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-8 text-center text-neutral-500">
                                            No pending applications found.
                                        </td>
                                    </tr>
                                ) : (
                                    applications.map((app) => (
                                        <tr key={app.application_id} className="hover:bg-neutral-800/30 transition-colors">
                                            <td className="px-4 py-4">
                                                <p className="font-bold text-white">{app.organization_name}</p>
                                                <p className="text-[10px] text-neutral-500 mt-0.5">ID: {app.application_id}</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="flex items-center gap-1.5 font-medium">
                                                    <span className="text-lg">🌍</span> {app.country}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-neutral-300 font-medium">{app.ngo_type}</td>
                                            <td className="px-4 py-4 text-neutral-300 font-medium">{app.members_count}</td>
                                            <td className="px-4 py-4">
                                                <p className="text-white font-medium">{app.funding_source}</p>
                                                <p className="text-neutral-500 mt-0.5">£{(app.funding_amount / 10000000).toFixed(1)}Cr</p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-tighter">
                                                    {app.proposed_plan} {app.subsidy_percentage}% SUB
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 rounded-md border text-[10px] font-bold uppercase ${statusColors[app.status]}`}>
                                                    {app.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {(app.status !== 'Approved' && app.status !== 'Rejected') ? (
                                                        <>
                                                            <button 
                                                                onClick={() => setSelectedApp(app)}
                                                                className="text-[10px] bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 px-2 py-1.5 rounded font-bold transition-all"
                                                            >
                                                                DETAILS
                                                            </button>
                                                            <button 
                                                                onClick={() => handleAction(app.application_id, 'reject')}
                                                                className="text-[10px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-1.5 rounded font-bold transition-all"
                                                                disabled={processingId !== null}
                                                            >
                                                                REJECT
                                                            </button>
                                                            <button 
                                                                onClick={() => handleAction(app.application_id, 'approve')}
                                                                className="text-[10px] bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded font-bold transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                                                disabled={processingId !== null}
                                                            >
                                                                {processingId === app.application_id ? 'WAIT..' : 'APPROVE'}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-[10px] text-neutral-500 font-bold italic py-1.5">Action Completed</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* NGO Details Modal */}
                {selectedApp && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                            <div className="px-6 py-4 bg-neutral-800/50 border-b border-neutral-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{selectedApp.organization_name}</h3>
                                    <p className="text-xs text-neutral-400 mt-1">Application ID: {selectedApp.application_id}</p>
                                </div>
                                <button onClick={() => setSelectedApp(null)} className="text-neutral-500 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6 text-[11px]">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-neutral-500 font-bold uppercase mb-1">Organization Details</p>
                                            <div className="bg-black/20 p-3 rounded-lg border border-neutral-800">
                                                <p className="text-neutral-400 mb-1">Type: <span className="text-white font-medium">{selectedApp.ngo_type}</span></p>
                                                <p className="text-neutral-400 mb-1">Country: <span className="text-white font-medium">🌍 {selectedApp.country}</span></p>
                                                <p className="text-neutral-400">Members: <span className="text-white font-medium">{selectedApp.members_count}</span></p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-neutral-500 font-bold uppercase mb-1">Funding Profile</p>
                                            <div className="bg-black/20 p-3 rounded-lg border border-neutral-800">
                                                <p className="text-neutral-400 mb-1">Source: <span className="text-white font-medium">{selectedApp.funding_source}</span></p>
                                                <p className="text-neutral-400 mb-1">Amount: <span className="text-white font-medium">£{(selectedApp.funding_amount / 10000000).toFixed(1)}Cr</span></p>
                                                <p className="text-neutral-400">Doc Status: <span className="text-emerald-400 font-bold">{selectedApp.registration_status}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-neutral-500 font-bold uppercase mb-1">Proposed Subsidy</p>
                                            <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/20">
                                                <p className="text-neutral-400 mb-1">Tier: <span className="text-blue-400 font-bold">{selectedApp.proposed_plan}</span></p>
                                                <p className="text-neutral-400">Discount: <span className="text-blue-400 font-bold">{selectedApp.subsidy_percentage}% OFF</span></p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-neutral-500 font-bold uppercase mb-1">Documents</p>
                                            <a href="#" className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 p-3 rounded-lg border border-neutral-700 transition-all group">
                                                <svg className="w-5 h-5 text-neutral-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <span className="text-neutral-300 group-hover:text-white font-medium">Registration_Doc.pdf</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                                    <button 
                                        onClick={() => handleAction(selectedApp.application_id, 'request-info')}
                                        className="px-4 py-2 text-[10px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg border border-neutral-700 transition-all"
                                        disabled={processingId !== null}
                                    >
                                        REQUEST MORE INFO
                                    </button>
                                    <button 
                                        onClick={() => handleAction(selectedApp.application_id, 'reject')}
                                        className="px-4 py-2 text-[10px] font-bold bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg border border-red-500/20 transition-all"
                                        disabled={processingId !== null}
                                    >
                                        REJECT APPLICATION
                                    </button>
                                    <button 
                                        onClick={() => handleAction(selectedApp.application_id, 'approve')}
                                        className="px-6 py-2 text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg transition-all shadow-lg"
                                        disabled={processingId !== null}
                                    >
                                        {processingId === selectedApp.application_id ? 'WAIT..' : 'APPROVE & ONBOARD'}
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

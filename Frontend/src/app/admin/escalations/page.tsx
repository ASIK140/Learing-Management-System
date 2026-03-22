'use client';
import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout';

const escalations = [
    { id: 'ESC-0091', tenant: 'Global Finance Ltd.', issue: 'Critical API authentication failure causing employee lockout', sla: 'Breached', priority: 'Critical', assignee: 'Unassigned', age: '3h 22m', created: '2025-03-07 14:42' },
    { id: 'ESC-0090', tenant: 'TechNova Inc.', issue: 'Bulk phishing campaign mislabeled as production send', sla: 'At Risk', priority: 'High', assignee: 'Priya K.', age: '6h 11m', created: '2025-03-07 12:09' },
    { id: 'ESC-0089', tenant: 'Acme Corporation', issue: 'SSO integration broken after tenant reconfiguration', sla: 'On Track', priority: 'High', assignee: 'Rahul D.', age: '8h 5m', created: '2025-03-07 10:00' },
    { id: 'ESC-0088', tenant: 'MediCare Group', issue: 'Compliance report generation fails for Q4 export', sla: 'On Track', priority: 'Medium', assignee: 'Priya K.', age: '11h', created: '2025-03-07 07:45' },
    { id: 'ESC-0087', tenant: 'SecureBank PLC', issue: 'Email deliverability dropped below 90% threshold', sla: 'On Track', priority: 'Medium', assignee: 'Unassigned', age: '1d ago', created: '2025-03-06 16:10' },
];

const slaBadge = (sla: string) => ({
    Breached: 'text-red-400 bg-red-400/10 border-red-500/20',
    'At Risk': 'text-orange-400 bg-orange-400/10 border-orange-500/20',
    'On Track': 'text-green-400 bg-green-400/10 border-green-500/20',
}[sla] || 'text-neutral-400 bg-neutral-800');

const prioColor = (p: string) => ({ Critical: 'text-red-400', High: 'text-orange-400', Medium: 'text-yellow-400', Low: 'text-blue-400' }[p] || 'text-neutral-400');
const prioBg = (p: string) => ({ Critical: 'bg-red-400/10 border-red-500/20', High: 'bg-orange-400/10 border-orange-500/20', Medium: 'bg-yellow-400/10 border-yellow-500/20', Low: 'bg-blue-400/10 border-blue-500/20' }[p] || 'bg-neutral-800 border-neutral-700');

export default function EscalationsPage() {
    const [escalations, setEscalations] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewEscalationModalOpen, setIsNewEscalationModalOpen] = useState(false);
    const [resolveModalEscalation, setResolveModalEscalation] = useState<any | null>(null);
    const [assignModalEscalation, setAssignModalEscalation] = useState<any | null>(null);
    const [tenants, setTenants] = useState<any[]>([]);
    const [newAssignee, setNewAssignee] = useState('');
    const [newEscalation, setNewEscalation] = useState({
        tenant_id: '',
        issue_type: 'Technical',
        description: '',
        severity: 'low',
        assigned_to: ''
    });
    const [resolutionNote, setResolutionNote] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const { apiFetch } = await import('@/utils/api');
            const [escRes, dashRes, tenRes] = await Promise.all([
                apiFetch('/admin/escalations'),
                apiFetch('/admin/dashboard'),
                apiFetch('/admin/tenants')
            ]);
            const escJson = await escRes.json();
            const dashJson = await dashRes.json();
            const tenJson = await tenRes.json();

            if (escJson.success && dashJson.success && tenJson.success) {
                setEscalations(escJson.data);
                setStats(dashJson.data.escalations);
                setTenants(tenJson.data);
            } else {
                setError('Failed to fetch data');
            }
        } catch (err) {
            setError('Network error connecting to API');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleResolve = async (id: string) => {
        try {
            const { apiFetch } = await import('@/utils/api');
            const res = await apiFetch(`/admin/escalations/${id}/resolve`, {
                method: 'POST',
                body: JSON.stringify({ resolution_note: resolutionNote })
            });
            if (res.ok) {
                setResolveModalEscalation(null);
                setResolutionNote('');
                fetchData();
            }
        } catch (err) {
            console.error('Failed to resolve escalation', err);
        }
    };

    const handleAssign = async (id: string, assignee: string) => {
        try {
            const { apiFetch } = await import('@/utils/api');
            const res = await apiFetch(`/admin/escalations/${id}/assign`, {
                method: 'PATCH',
                body: JSON.stringify({ assigned_to: assignee })
            });
            if (res.ok) {
                setAssignModalEscalation(null);
                fetchData();
            }
        } catch (err) {
            console.error('Failed to assign escalation', err);
        }
    };

    const handleCreateEscalation = async () => {
        try {
            const { apiFetch } = await import('@/utils/api');
            const res = await apiFetch('/admin/escalations', {
                method: 'POST',
                body: JSON.stringify(newEscalation)
            });
            const json = await res.json();
            if (json.success) {
                setIsNewEscalationModalOpen(false);
                setNewEscalation({
                    tenant_id: '',
                    issue_type: 'Technical',
                    description: '',
                    severity: 'low',
                    assigned_to: ''
                });
                fetchData();
            }
        } catch (err) {
            console.error('Failed to create escalation', err);
        }
    };

    if (loading) return (
        <SuperAdminLayout title="Escalations">
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <span className="ml-3 text-neutral-400">Loading escalations...</span>
            </div>
        </SuperAdminLayout>
    );

    if (error) return (
        <SuperAdminLayout title="Escalations">
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <p className="font-bold">Error</p>
                <p className="text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Retry</button>
            </div>
        </SuperAdminLayout>
    );

    return (
        <SuperAdminLayout title="Escalations">
            <div className="flex flex-col gap-6">
                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Open', value: stats?.pending?.toString() || '0', color: 'text-white' },
                        { label: 'SLA Breached', value: '1', color: 'text-red-400' },
                        { label: 'At Risk', value: '2', color: 'text-orange-400' },
                        { label: 'On Track', value: '4', color: 'text-green-400' },
                    ].map(s => (
                        <div key={s.label} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                            <p className="text-xs text-neutral-500">{s.label}</p>
                            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Escalation Table */}
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
                        <h3 className="font-semibold text-white text-sm">Open Escalations</h3>
                        <button onClick={() => setIsNewEscalationModalOpen(true)} className="text-xs px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                            + New Escalation
                        </button>
                    </div>
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-neutral-800 text-neutral-500 text-[11px] uppercase tracking-wider">
                                <th className="text-left px-5 py-3">ID</th>
                                <th className="text-left px-5 py-3">Tenant</th>
                                <th className="text-left px-5 py-3">Issue</th>
                                <th className="text-left px-5 py-3">Priority</th>
                                <th className="text-left px-5 py-3">SLA Status</th>
                                <th className="text-left px-5 py-3">Assignee</th>
                                <th className="text-left px-5 py-3">Created</th>
                                <th className="text-left px-5 py-3">Age</th>
                                <th className="text-left px-5 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {escalations.map((e, idx) => (
                                <tr key={`esc-${e.escalation_id}-${idx}`} className="hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-5 py-3.5 font-mono font-medium text-neutral-300">{e.escalation_id}</td>
                                    <td className="px-5 py-3.5 text-white font-medium whitespace-nowrap">{e.tenant_name}</td>
                                    <td className="px-5 py-3.5 text-neutral-400 max-w-xs truncate">{e.description}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${prioColor(e.severity.charAt(0).toUpperCase() + e.severity.slice(1))} ${prioBg(e.severity.charAt(0).toUpperCase() + e.severity.slice(1))}`}>{e.severity.toUpperCase()}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${slaBadge('On Track')}`}>On Track</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-neutral-400">{e.assigned_to || 'Unassigned'}</td>
                                    <td className="px-5 py-3.5 text-neutral-500">{e.created_at}</td>
                                    <td className="px-5 py-3.5 text-neutral-500">1d</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-1.5">
                                            {e.status !== 'resolved' && (
                                                <>
                                                    <button onClick={() => setResolveModalEscalation(e)} className="px-2.5 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-md border border-red-500/20 transition-colors font-medium">Resolve</button>
                                                    <button onClick={() => { setAssignModalEscalation(e); setNewAssignee(e.assigned_to || ''); }} className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md border border-neutral-700 transition-colors">Assign</button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Escalation Modal */}
            {isNewEscalationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                            <h3 className="font-bold text-lg text-white">Create New Escalation</h3>
                            <button onClick={() => setIsNewEscalationModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Target Tenant</label>
                                <select 
                                    value={newEscalation.tenant_id}
                                    onChange={(e) => setNewEscalation({...newEscalation, tenant_id: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none"
                                >
                                    <option value="" disabled>Select a tenant...</option>
                                    {tenants.map(t => (
                                        <option key={t.tenant_id} value={t.tenant_id}>{t.organization_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Issue Type</label>
                                <select 
                                    value={newEscalation.issue_type}
                                    onChange={(e) => setNewEscalation({...newEscalation, issue_type: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none"
                                >
                                    <option>Technical</option>
                                    <option>Security</option>
                                    <option>Compliance</option>
                                    <option>Billing</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Detailed Description</label>
                                <textarea 
                                    rows={4} 
                                    value={newEscalation.description}
                                    onChange={(e) => setNewEscalation({...newEscalation, description: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" 
                                    placeholder="Provide full context, affected systems, and steps taken so far..."
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Priority</label>
                                    <select 
                                        value={newEscalation.severity}
                                        onChange={(e) => setNewEscalation({...newEscalation, severity: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Initial Assignee</label>
                                    <select 
                                        value={newEscalation.assigned_to}
                                        onChange={(e) => setNewEscalation({...newEscalation, assigned_to: e.target.value})}
                                        className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none"
                                    >
                                        <option value="">Unassigned</option>
                                        <option>Priya K. (L2 Support)</option>
                                        <option>Rahul D. (Infra)</option>
                                        <option>Alex M. (Security)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
                            <button onClick={() => setIsNewEscalationModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button 
                                onClick={handleCreateEscalation} 
                                disabled={!newEscalation.tenant_id || !newEscalation.description}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_12px_rgba(220,38,38,0.3)]"
                            >
                                Submit Escalation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resolve Modal */}
            {resolveModalEscalation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                            <h3 className="font-bold text-lg text-white">Resolve Escalation: {resolveModalEscalation.escalation_id}</h3>
                            <button onClick={() => setResolveModalEscalation(null)} className="text-neutral-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                                <p className="text-sm font-medium text-white mb-1">{resolveModalEscalation.tenant_name}</p>
                                <p className="text-xs text-neutral-400">{resolveModalEscalation.issue}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Resolution Notes *</label>
                                <textarea 
                                    rows={3} 
                                    value={resolutionNote}
                                    onChange={(e) => setResolutionNote(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-green-500 transition-colors" 
                                    placeholder="Explain how the issue was resolved..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
                            <button onClick={() => setResolveModalEscalation(null)} className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button onClick={() => handleResolve(resolveModalEscalation.escalation_id)} className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_12px_rgba(22,163,74,0.3)]">
                                Mark as Resolved
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Modal */}
            {assignModalEscalation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                            <h3 className="font-bold text-lg text-white">Reassign: {assignModalEscalation.escalation_id}</h3>
                            <button onClick={() => setAssignModalEscalation(null)} className="text-neutral-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-neutral-500 mb-0.5">Current Assignee</p>
                                    <p className="text-sm font-medium text-white">{assignModalEscalation.assigned_to || 'Unassigned'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 mb-0.5">Priority</p>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${prioColor(assignModalEscalation.severity.charAt(0).toUpperCase() + assignModalEscalation.severity.slice(1))} ${prioBg(assignModalEscalation.severity.charAt(0).toUpperCase() + assignModalEscalation.severity.slice(1))}`}>
                                        {assignModalEscalation.severity.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">New Assignee *</label>
                                <select 
                                    value={newAssignee}
                                    onChange={(e) => setNewAssignee(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                                >
                                    <option value="" disabled>Select an engineer...</option>
                                    <option value="Priya K. (L2 Support)">Priya K. (L2 Support)</option>
                                    <option value="Rahul D. (Infra)">Rahul D. (Infra)</option>
                                    <option value="Alex M. (Security)">Alex M. (Security)</option>
                                    <option value="Sarah J. (Platform Ops)">Sarah J. (Platform Ops)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Handoff Notes (Optional)</label>
                                <textarea rows={2} className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="Brief note for the new assignee..."></textarea>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
                            <button onClick={() => setAssignModalEscalation(null)} className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button 
                                onClick={() => handleAssign(assignModalEscalation.escalation_id, newAssignee)} 
                                disabled={!newAssignee}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                            >
                                Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}

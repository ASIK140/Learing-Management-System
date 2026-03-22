'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout';

const allTenants = [
    { id: 'T-001', name: 'Acme Corporation', plan: 'Enterprise', seats: '450/500', health: 94, risk: 'Low', status: 'Active', contact: 'john@acme.com', revenue: '$4,200/mo', since: '2023-01-15' },
    { id: 'T-002', name: 'TechNova Inc.', plan: 'Business', seats: '280/300', health: 78, risk: 'Medium', status: 'Active', contact: 'ops@technova.io', revenue: '$1,800/mo', since: '2023-04-22' },
    { id: 'T-003', name: 'Global Finance Ltd.', plan: 'Enterprise', seats: '1100/1200', health: 62, risk: 'High', status: 'Flagged', contact: 'it@gfl.com', revenue: '$8,500/mo', since: '2022-11-01' },
    { id: 'T-004', name: 'Retail Brands Co.', plan: 'Starter', seats: '45/50', health: 88, risk: 'Low', status: 'Active', contact: 'admin@retailbrands.com', revenue: '$299/mo', since: '2024-02-10' },
    { id: 'T-005', name: 'MediCare Group', plan: 'Business', seats: '190/250', health: 55, risk: 'High', status: 'Trial', contact: 'it@medicare.org', revenue: 'Trial', since: '2025-01-05' },
    { id: 'T-006', name: 'EduTech Systems', plan: 'Starter', seats: '28/50', health: 91, risk: 'Low', status: 'Active', contact: 'hello@edutech.io', revenue: '$299/mo', since: '2024-08-20' },
    { id: 'T-007', name: 'SecureBank PLC', plan: 'Enterprise', seats: '820/1000', health: 72, risk: 'Medium', status: 'Active', contact: 'ciso@securebank.co', revenue: '$6,800/mo', since: '2023-06-14' },
    { id: 'T-008', name: 'Sky Logistics', plan: 'Business', seats: '100/150', health: 85, risk: 'Low', status: 'Active', contact: 'it@skylogi.com', revenue: '$1,200/mo', since: '2024-03-11' },
    { id: 'T-009', name: 'Quantum Research Ltd.', plan: 'Enterprise', seats: '60/100', health: 96, risk: 'Low', status: 'Active', contact: 'sec@qrl.ac.uk', revenue: '$4,200/mo', since: '2024-05-01' },
];

const riskBadge = (risk: string) => ({ Low: 'text-green-400 bg-green-400/10 border-green-500/20', Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20', High: 'text-red-400 bg-red-400/10 border-red-500/20' }[risk] || 'text-neutral-400 bg-neutral-800 border-neutral-700');
const statusBadge = (status: string) => ({ Active: 'text-green-400 bg-green-400/10 border-green-500/20', Trial: 'text-blue-400 bg-blue-400/10 border-blue-500/20', Flagged: 'text-red-400 bg-red-400/10 border-red-500/20', Suspended: 'text-orange-400 bg-orange-400/10 border-orange-500/20' }[status] || 'text-neutral-400 bg-neutral-800 border-neutral-700');
const planBadge = (plan: string) => ({ Enterprise: 'text-purple-400 bg-purple-400/10 border border-purple-500/20', Business: 'text-blue-400 bg-blue-400/10 border border-blue-500/20', Starter: 'text-neutral-400 bg-neutral-800 border border-neutral-700' }[plan] || '');

export default function AllTenantsPage() {
    const [tenants, setTenants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [planFilter, setPlanFilter] = useState('All');
    const [riskFilter, setRiskFilter] = useState('All');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editModalTenant, setEditModalTenant] = useState<any | null>(null);
    const [suspendModalTenant, setSuspendModalTenant] = useState<any | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    const fetchTenants = async () => {
        setLoading(true);
        try {
            const { apiFetch } = await import('@/utils/api');
            const res = await apiFetch('/admin/tenants');
            const json = await res.json();
            if (json.success) {
                // Map backend tenant to frontend structure
                const mapped = json.data.map((t: any) => ({
                    id: t.tenant_id,
                    name: t.organization_name,
                    plan: t.plan_type,
                    seats: `${t.seat_count}/${t.user_limit}`,
                    health: 85, // Mock health as it's not in the base tenant object yet
                    risk: 'Low', // Mock risk
                    status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
                    contact: t.admin_email,
                    revenue: t.monthly_revenue > 0 ? `$${t.monthly_revenue.toLocaleString()}/mo` : 'Trial',
                    since: t.created_at
                }));
                setTenants(mapped);
            } else {
                setError('Failed to fetch tenants');
            }
        } catch (err) {
            setError('Network error connecting to API');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const filtered = tenants.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.contact.toLowerCase().includes(search.toLowerCase());
        const matchPlan = planFilter === 'All' || t.plan === planFilter;
        const matchRisk = riskFilter === 'All' || t.risk === riskFilter;
        return matchSearch && matchPlan && matchRisk;
    });

    return (
        <SuperAdminLayout title="All Tenants">
            <div className="flex flex-col gap-6">

                {/* Summary Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Tenants', value: tenants.length.toString() },
                        { label: 'Enterprise', value: tenants.filter(t => t.plan === 'Enterprise').length.toString() },
                        { label: 'Business / Pro', value: tenants.filter(t => t.plan === 'Business' || t.plan === 'Pro').length.toString() },
                        { label: 'Starter / Trial', value: tenants.filter(t => t.plan === 'Starter' || t.plan === 'Trial').length.toString() },
                    ].map(s => (
                        <div key={s.label} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
                            <p className="text-xs text-neutral-500">{s.label}</p>
                            <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or contact..."
                        className="flex-1 min-w-64 px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none transition-colors"
                    />
                    <select value={planFilter} onChange={e => setPlanFilter(e.target.value)} className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
                        {['All', 'Enterprise', 'Business', 'Starter'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-red-500">
                        {['All', 'Low', 'Medium', 'High'].map(o => <option key={o}>{o}</option>)}
                    </select>
                    <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_12px_rgba(220,38,38,0.3)]">
                        + Add Tenant
                    </button>
                </div>

                {/* Table */}
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-x-auto">
                    <table className="w-full text-sm min-w-[900px]">
                        <thead>
                            <tr className="border-b border-neutral-800 text-neutral-500 text-xs uppercase tracking-wider">
                                <th className="text-left px-5 py-3">ID</th>
                                <th className="text-left px-5 py-3">Tenant Name</th>
                                <th className="text-left px-5 py-3">Plan</th>
                                <th className="text-left px-5 py-3">Seat Usage</th>
                                <th className="text-left px-5 py-3">Health</th>
                                <th className="text-left px-5 py-3">Risk</th>
                                <th className="text-left px-5 py-3">Status</th>
                                <th className="text-left px-5 py-3">Revenue</th>
                                <th className="text-left px-5 py-3">Member Since</th>
                                <th className="text-left px-5 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {filtered.map((t, idx) => (
                                <tr key={`tenant-${t.id || t.name}-${idx}`} className="hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-5 py-3.5 font-mono text-xs text-neutral-500">{t.id}</td>
                                    <td className="px-5 py-3.5">
                                        <p className="font-semibold text-white">{t.name}</p>
                                        <p className="text-xs text-neutral-500">{t.contact}</p>
                                    </td>
                                    <td className="px-5 py-3.5"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planBadge(t.plan)}`}>{t.plan}</span></td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-20 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${parseInt(t.seats) / parseInt(t.seats.split('/')[1]) > 0.9 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${(parseInt(t.seats) / parseInt(t.seats.split('/')[1])) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-neutral-400">{t.seats}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`font-bold text-sm ${t.health >= 85 ? 'text-green-400' : t.health >= 65 ? 'text-yellow-400' : 'text-red-400'}`}>{t.health}</span>
                                    </td>
                                    <td className="px-5 py-3.5"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${riskBadge(t.risk)}`}>{t.risk}</span></td>
                                    <td className="px-5 py-3.5"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge(t.status)}`}>{t.status}</span></td>
                                    <td className="px-5 py-3.5 text-green-300 font-medium">{t.revenue}</td>
                                    <td className="px-5 py-3.5 text-neutral-500 text-xs">{t.since}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-1.5 relative">
                                            <Link href="/admin/tenants/details">
                                                <button className="text-xs px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors">View</button>
                                            </Link>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === t.id ? null : t.id);
                                                }}
                                                className="text-xs px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-red-900/40 text-neutral-400 hover:text-red-400 border border-neutral-700 hover:border-red-500/30 transition-colors"
                                            >
                                                •••
                                            </button>

                                            {/* Action Dropdown */}
                                            {activeDropdown === t.id && (
                                                <div className="absolute right-0 top-full mt-1 w-36 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-10 overflow-hidden">
                                                    <button onClick={() => { setEditModalTenant(t); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">Edit Tenant</button>
                                                    <Link href="/admin/billing">
                                                        <button className="w-full text-left px-4 py-2.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">Manage Billing</button>
                                                    </Link>
                                                    <div className="border-t border-neutral-800"></div>
                                                    <button onClick={() => { setSuspendModalTenant(t); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-xs text-orange-400 hover:bg-neutral-800 transition-colors">Suspend Tenant</button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Tenant Modal */}
            {
                isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                                <h3 className="font-bold text-lg text-white">Add New Tenant</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Organization Name *</label>
                                    <input id="new-org-name" type="text" placeholder="e.g. Acme Corporation" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-400 mb-1.5">Primary Contact Name *</label>
                                        <input id="new-contact-name" type="text" placeholder="John Doe" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-400 mb-1.5">Contact Email *</label>
                                        <input id="new-contact-email" type="email" placeholder="admin@org.com" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-400 mb-1.5">Subscription Plan</label>
                                        <select id="new-plan" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none">
                                            <option>Enterprise</option>
                                            <option>Business</option>
                                            <option>Starter</option>
                                            <option>Trial</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-neutral-400 mb-1.5">Seat Allocation</label>
                                        <input id="new-seats" type="number" defaultValue={100} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
                                <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        const name = (document.getElementById('new-org-name') as HTMLInputElement).value;
                                        const email = (document.getElementById('new-contact-email') as HTMLInputElement).value;
                                        const plan = (document.getElementById('new-plan') as HTMLSelectElement).value;
                                        const seats = (document.getElementById('new-seats') as HTMLInputElement).value;

                                        try {
                                            const { apiFetch } = await import('@/utils/api');
                                            const res = await apiFetch('/admin/tenants', {
                                                method: 'POST',
                                                body: JSON.stringify({ organization_name: name, admin_email: email, plan_type: plan, user_limit: parseInt(seats) })
                                            });
                                            if (res.ok) {
                                                setIsAddModalOpen(false);
                                                fetchTenants();
                                            }
                                        } catch (err) {
                                            console.error('Failed to create tenant', err);
                                        }
                                    }}
                                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_12px_rgba(220,38,38,0.3)]"
                                >
                                    Create Tenant
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Edit Tenant Modal */}
            {editModalTenant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                            <h3 className="font-bold text-lg text-white">Edit {editModalTenant.name}</h3>
                            <button onClick={() => setEditModalTenant(null)} className="text-neutral-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Organization Name *</label>
                                <input type="text" defaultValue={editModalTenant.name} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Primary Contact Name *</label>
                                    <input type="text" defaultValue={editModalTenant.contact.split('@')[0]} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Contact Email *</label>
                                    <input type="email" defaultValue={editModalTenant.contact} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Subscription Plan</label>
                                    <select defaultValue={editModalTenant.plan} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none">
                                        <option>Enterprise</option>
                                        <option>Business</option>
                                        <option>Starter</option>
                                        <option>Trial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Seat Allocation</label>
                                    <input type="number" defaultValue={parseInt(editModalTenant.seats.split('/')[1])} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
                            <button onClick={() => setEditModalTenant(null)} className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button onClick={() => setEditModalTenant(null)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_12px_rgba(37,99,235,0.3)]">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Suspend Tenant Modal */}
            {suspendModalTenant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-500/20">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="font-bold text-xl text-white">Suspend {suspendModalTenant.name}?</h3>
                            <p className="text-sm text-neutral-400">
                                This will immediately revoke access for all <strong className="text-neutral-200">{suspendModalTenant.seats.split('/')[0]} users</strong> within this tenant. They will not be able to log in to the platform.
                            </p>

                            <div className="mt-4 bg-neutral-950 p-4 rounded-lg border border-neutral-800 text-left">
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Reason for suspension (optional)</label>
                                <textarea rows={2} className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="e.g. Non-payment, excessive risk..."></textarea>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
                            <button onClick={() => setSuspendModalTenant(null)} className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        const { apiFetch } = await import('@/utils/api');
                                        const res = await apiFetch(`/admin/tenants/${suspendModalTenant.id}/status`, {
                                            method: 'PATCH',
                                            body: JSON.stringify({ status: 'suspended' })
                                        });
                                        if (res.ok) {
                                            setSuspendModalTenant(null);
                                            fetchTenants();
                                        }
                                    } catch (err) {
                                        console.error('Failed to suspend tenant', err);
                                    }
                                }}
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_12px_rgba(220,38,38,0.3)]"
                            >
                                Confirm Suspension
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout >
    );
}

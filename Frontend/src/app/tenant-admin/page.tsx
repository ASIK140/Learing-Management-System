'use client';
import React, { useState } from 'react';
import RoleLayout, { NavSection } from '@/components/layout/RoleLayout';

const navSections: NavSection[] = [
    {
        title: 'USERS',
        items: [
            { label: 'User Management', href: '/tenant-admin', icon: '👥' },
            { label: 'Import / SCIM Sync', href: '/tenant-admin/import', icon: '📤' },
        ],
    },
    {
        title: 'PHISHING',
        items: [
            { label: 'Phishing Simulator', href: '/tenant-admin/phishing', icon: '🎣' },
            { label: 'Email Templates', href: '/tenant-admin/templates', icon: '✉️' },
        ],
    },
    {
        title: 'CONFIGURATION',
        items: [
            { label: 'SSO Configuration', href: '/tenant-admin/sso', icon: '🔑' },
            { label: 'Integrations', href: '/tenant-admin/integrations', icon: '🔌' },
            { label: 'Adaptive Rules', href: '/tenant-admin/automation', icon: '⚙️' },
        ],
    },
];

const usersData = [
    { id: 'usr_1', name: 'Sarah Johnson', email: 's.johnson@acmecorp.com', dept: 'Engineering', role: 'Tenant Admin', enrollments: 12, lastLogin: '5 mins ago', status: 'Active' },
    { id: 'usr_2', name: 'Mark Williams', email: 'm.williams@acmecorp.com', dept: 'Sales', role: 'Manager', enrollments: 8, lastLogin: '1 hour ago', status: 'Active' },
    { id: 'usr_3', name: 'Priya Sharma', email: 'p.sharma@acmecorp.com', dept: 'Finance', role: 'Employee', enrollments: 4, lastLogin: '3 days ago', status: 'Active' },
    { id: 'usr_4', name: 'Tom Carter', email: 't.carter@acmecorp.com', dept: 'HR', role: 'Employee', enrollments: 0, lastLogin: 'Never', status: 'Pending Invite' },
    { id: 'usr_5', name: 'Anita Mehta', email: 'a.mehta@acmecorp.com', dept: 'Legal', role: 'Employee', enrollments: 6, lastLogin: '2 hours ago', status: 'Active' },
    { id: 'usr_6', name: 'James Brown', email: 'j.brown@acmecorp.com', dept: 'Executives', role: 'Manager', enrollments: 15, lastLogin: '1 week ago', status: 'Deactivated' },
    { id: 'usr_7', name: 'Deepa Nair', email: 'd.nair@acmecorp.com', dept: 'Engineering', role: 'Employee', enrollments: 9, lastLogin: '20 mins ago', status: 'Active' },
];

const statusStyles = (s: string) => ({
    'Active': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Pending Invite': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'Deactivated': 'bg-red-500/10 text-red-400 border-red-500/20',
}[s] || 'bg-neutral-800 text-neutral-400 border-neutral-700');

export default function TenantAdminUserManagement() {
    const [search, setSearch] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [users] = useState(usersData);

    // Modal states
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [processing, setProcessing] = useState(false);

    const filtered = users.filter(u => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchDept = deptFilter === 'All' || u.dept === deptFilter;
        const matchStatus = statusFilter === 'All' || u.status === statusFilter;
        return matchSearch && matchDept && matchStatus;
    });

    const handleAction = (type: string, user: any = null) => {
        if (user) setSelectedUser(user);
        setActiveModal(type);
    };

    const confirmAction = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setActiveModal(null);
            setSelectedUser(null);
        }, 800);
    };

    return (
        <RoleLayout title="User Management" subtitle="Tenant Admin · Acme Corporation" accentColor="purple" avatarText="TA" avatarGradient="bg-gradient-to-tr from-purple-500 to-pink-500" userName="Tenant Admin" userEmail="admin@acmecorp.com" navSections={navSections} currentRole="tenant-admin">
            <div className="flex flex-col gap-6">

                {/* Users Section Header */}
                <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
                    <p className="text-neutral-400 text-sm max-w-2xl">Manage all employees inside the organization. View training enrollments, status, and control system access.</p>
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={() => handleAction('addUser')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all whitespace-nowrap">
                            + Add User
                        </button>
                        <a href="/tenant-admin/import">
                            <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg border border-neutral-700 transition-colors whitespace-nowrap">
                                Bulk Import
                            </button>
                        </a>
                        <button onClick={() => handleAction('exportCSV')} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-semibold rounded-lg border border-neutral-700 transition-colors whitespace-nowrap">
                            Export CSV
                        </button>
                        <button onClick={() => handleAction('exportExcel')} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-semibold rounded-lg border border-neutral-700 transition-colors whitespace-nowrap">
                            Export Excel
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-green-500 group-hover:h-1.5 transition-all"></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Active Users</p>
                                <p className="text-3xl font-bold text-white">328</p>
                            </div>
                            <span className="text-2xl opacity-50">👥</span>
                        </div>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500 group-hover:h-1.5 transition-all"></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Pending Invites</p>
                                <p className="text-3xl font-bold text-white">8</p>
                            </div>
                            <span className="text-2xl opacity-50">📨</span>
                        </div>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500 group-hover:h-1.5 transition-all"></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Deactivated Users</p>
                                <p className="text-3xl font-bold text-white">4</p>
                            </div>
                            <span className="text-2xl opacity-50">🚫</span>
                        </div>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 group-hover:h-1.5 transition-all"></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-neutral-500 mb-1">Admin Accounts</p>
                                <p className="text-3xl font-bold text-white">3</p>
                            </div>
                            <span className="text-2xl opacity-50">🛡️</span>
                        </div>
                    </div>
                </div>

                {/* Filters & Table */}
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden">
                    <div className="px-6 py-4 flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-neutral-900 border-b border-neutral-800">
                        <div className="relative w-full lg:max-w-md">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-neutral-500">🔍</span>
                            <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500 transition-colors" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer">
                                <option value="All">All Departments</option>
                                <option>Engineering</option><option>Sales</option><option>Finance</option><option>HR</option><option>Legal</option>
                            </select>
                            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500 cursor-pointer">
                                <option value="All">All Statuses</option>
                                <option>Active</option><option>Pending Invite</option><option>Deactivated</option>
                            </select>
                            <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg border border-neutral-700 transition-colors">
                                Apply Filter
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm whitespace-nowrap">
                            <thead className="bg-neutral-800/30 border-b border-neutral-800">
                                <tr className="text-neutral-500 text-[11px] uppercase tracking-wider">
                                    <th className="px-6 py-4 text-left font-semibold">Name</th>
                                    <th className="px-6 py-4 text-left font-semibold">Email</th>
                                    <th className="px-6 py-4 text-left font-semibold">Department</th>
                                    <th className="px-6 py-4 text-left font-semibold">Role</th>
                                    <th className="px-6 py-4 text-center font-semibold">Enrollments</th>
                                    <th className="px-6 py-4 text-left font-semibold">Last Login</th>
                                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {filtered.map(u => (
                                    <tr key={u.id} className="hover:bg-neutral-800/30 transition-colors group">
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                                                    {u.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <span className="font-semibold text-white">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 text-neutral-400">{u.email}</td>
                                        <td className="px-6 py-3.5 text-neutral-400">{u.dept}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2 py-0.5 rounded text-xs border ${u.role === 'Tenant Admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-neutral-800 text-neutral-300 border-neutral-700'}`}>{u.role}</span>
                                        </td>
                                        <td className="px-6 py-3.5 text-center font-mono text-neutral-300">{u.enrollments}</td>
                                        <td className="px-6 py-3.5 text-neutral-500 text-xs">{u.lastLogin}</td>
                                        <td className="px-6 py-3.5">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border flex items-center gap-1.5 w-max ${statusStyles(u.status)}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-green-400' : u.status === 'Deactivated' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button onClick={() => handleAction('editUser', u)} className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 text-[10px] uppercase font-semibold transition-colors shadow-sm">Edit</button>
                                                {u.status === 'Pending Invite' && (
                                                    <button onClick={() => handleAction('resendInvite', u)} className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded border border-blue-500/20 text-[10px] uppercase font-semibold transition-colors shadow-sm">Resend</button>
                                                )}
                                                <button onClick={() => handleAction('viewAudit', u)} className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded text-xs transition-colors shadow-sm" title="View Audit Trail">📜</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-8 text-center text-neutral-500">No users match your current filters.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {activeModal === 'addUser' && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center">
                            <h3 className="font-bold text-white text-lg">Add New User</h3>
                            <button onClick={() => setActiveModal(null)} className="text-neutral-500 hover:text-white text-xl leading-none">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Full Name</label>
                                <input type="text" placeholder="Jane Doe" className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Email Address</label>
                                <input type="email" placeholder="jane@acmecorp.com" className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Department</label>
                                    <select className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500">
                                        <option>Engineering</option><option>Sales</option><option>HR</option><option>Finance</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Role</label>
                                    <select className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500">
                                        <option>Employee</option><option>Manager</option><option>Tenant Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950 flex justify-end gap-3">
                            <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={confirmAction} disabled={processing} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg shadow-md transition-colors min-w-[120px]">
                                {processing ? 'Sending...' : 'Send Invite'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'editUser' && selectedUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center">
                            <h3 className="font-bold text-white text-lg">Edit User</h3>
                            <button onClick={() => setActiveModal(null)} className="text-neutral-500 hover:text-white text-xl leading-none">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Full Name</label>
                                <input type="text" defaultValue={selectedUser.name} className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-neutral-400 mb-1.5 block">Department</label>
                                <select defaultValue={selectedUser.dept} className="w-full px-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500">
                                    <option>Engineering</option><option>Sales</option><option>HR</option><option>Finance</option><option>Legal</option><option>Executives</option>
                                </select>
                            </div>
                            <div className="pt-4 border-t border-neutral-800">
                                <label className="text-xs font-semibold text-red-400 mb-2 block uppercase">Danger Zone</label>
                                <button className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-semibold rounded-lg border border-red-500/20 transition-colors">
                                    Suspend / Deactivate User
                                </button>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950 flex justify-end gap-3">
                            <button onClick={() => setActiveModal(null)} className="px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">Cancel</button>
                            <button onClick={confirmAction} disabled={processing} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg shadow-md transition-colors min-w-[120px]">
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {(activeModal === 'exportCSV' || activeModal === 'exportExcel' || activeModal === 'resendInvite') && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-neutral-700">
                            {activeModal === 'resendInvite' ? '📨' : '📥'}
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">
                            {activeModal === 'resendInvite' ? `Resend Invite to ${selectedUser?.name}?` : 'Confirm Export'}
                        </h3>
                        <p className="text-sm text-neutral-400 mb-6">
                            {activeModal === 'resendInvite' ? 'This will send a fresh invitation email link to this user.' : `Generate and download a ${activeModal === 'exportCSV' ? 'CSV' : 'Excel'} file containing all user data and filtered metrics.`}
                        </p>
                        <div className="flex gap-3 w-full">
                            <button onClick={() => setActiveModal(null)} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg border border-neutral-700 transition-colors">Cancel</button>
                            <button onClick={confirmAction} disabled={processing} className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.3)] transition-all">
                                {processing ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeModal === 'viewAudit' && selectedUser && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 h-[600px] flex flex-col">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
                            <div>
                                <h3 className="font-bold text-white text-lg">Audit Trail: {selectedUser.name}</h3>
                                <p className="text-xs text-neutral-500 mt-0.5">{selectedUser.email}</p>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="text-neutral-500 hover:text-white text-xl leading-none">×</button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto space-y-4">
                            {[
                                { action: 'Login Successful', ip: '192.168.1.10', time: '5 mins ago', color: 'text-green-400' },
                                { action: 'Course Completed', ip: '192.168.1.10', time: '2 days ago', color: 'text-blue-400' },
                                { action: 'Phishing Email Clicked', ip: '10.0.0.55', time: '1 week ago', color: 'text-red-400' },
                                { action: 'Password Changed', ip: '192.168.1.10', time: '1 month ago', color: 'text-yellow-400' },
                            ].map((log, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-neutral-600 mt-1.5"></div>
                                        {i < 3 && <div className="w-0.5 h-full bg-neutral-800 mt-1"></div>}
                                    </div>
                                    <div className="pb-4">
                                        <p className={`text-sm font-bold ${log.color}`}>{log.action}</p>
                                        <p className="text-xs text-neutral-500 mt-1">IP: {log.ip} • {log.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-neutral-800 bg-neutral-950">
                            <button onClick={() => setActiveModal(null)} className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg border border-neutral-700 transition">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </RoleLayout>
    );
}

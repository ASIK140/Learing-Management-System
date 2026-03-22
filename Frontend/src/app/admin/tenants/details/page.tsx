'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout';

export default function TenantDetailsPage() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isImpersonateModalOpen, setIsImpersonateModalOpen] = useState(false);

    return (
        <SuperAdminLayout title="Tenant Details">
            <div className="flex flex-col gap-6">

                {/* Header Actions */}
                <div className="flex items-center justify-between -mt-2">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/tenants">
                            <button className="p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-700 hover:border-neutral-500 rounded-lg transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                Acme Corporation
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase text-green-400 bg-green-400/10 border border-green-500/20">Active</span>
                            </h2>
                            <p className="text-xs text-neutral-400">ID: T-001 • Enterprise Plan • US East Region</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => setIsEditModalOpen(true)} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg border border-neutral-700 transition-colors">
                            Edit Details
                        </button>
                        <button onClick={() => setIsImpersonateModalOpen(true)} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-sm font-medium rounded-lg border border-neutral-700 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            Impersonate Admin
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Quick Stats & Info */}
                    <div className="flex flex-col gap-6">

                        {/* Health Card */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 relative overflow-hidden group">
                            <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-500/10 blur-3xl rounded-full"></div>
                            <h3 className="text-sm font-semibold text-neutral-400 mb-4">Overall Platform Health</h3>
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-5xl font-bold text-white">94</span>
                                <span className="text-sm font-medium text-green-400 mb-1">Excellent</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-4 border-t border-neutral-800 pt-3">
                                High engagement across all departments. Low phishing failure rate detected this month.
                            </p>
                        </div>

                        {/* Usage Card */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-white mb-4">License Usage</h3>
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-2xl font-bold text-white">450 <span className="text-sm font-normal text-neutral-500">/ 500 seats</span></span>
                                <span className="text-sm font-bold text-blue-400">90%</span>
                            </div>
                            <div className="w-full bg-neutral-950 rounded-full h-2 mb-4 border border-neutral-800 hidden overflow-hidden sm:block">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                            </div>

                            <div className="space-y-3 mt-6 border-t border-neutral-800 pt-4">
                                <div className="flex justify-between text-xs">
                                    <span className="text-neutral-400">Managers</span>
                                    <span className="text-white font-medium">12 active</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-neutral-400">Content Creators</span>
                                    <span className="text-white font-medium">3 active</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-neutral-400">Storage Used</span>
                                    <span className="text-white font-medium">124 GB / 500 GB</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                            <h3 className="text-sm font-semibold text-white mb-4">Primary Contact</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-sm font-bold border border-neutral-700">
                                    JD
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-white">John Doe</p>
                                    <p className="text-xs text-neutral-400">CISO</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    john@acme.com
                                </div>
                                <div className="flex items-center gap-2 text-neutral-300">
                                    <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                    +1 (555) 123-4567
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Activity, Billing & Settings */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Modules Enabled */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
                                <h3 className="font-bold text-white">Active Modules</h3>
                                <span className="text-xs text-neutral-500 font-medium">Included in Enterprise Plan</span>
                            </div>
                            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: 'Core LMS Engine', status: 'Active', color: 'bg-green-500' },
                                    { name: 'Phishing Simulator', status: 'Active', color: 'bg-green-500' },
                                    { name: 'Compliance Mapping', status: 'Active', color: 'bg-green-500' },
                                    { name: 'Custom Content Studio', status: 'Active', color: 'bg-green-500' },
                                    { name: 'Advanced API Access', status: 'Active', color: 'bg-green-500' },
                                    { name: 'Dedicated Support', status: 'Active', color: 'bg-green-500' },
                                ].map((mod, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-800/50 bg-neutral-950">
                                        <div className={`w-2 h-2 rounded-full ${mod.color}`}></div>
                                        <span className="text-sm font-medium text-neutral-200">{mod.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Log */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex-1">
                            <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
                                <h3 className="font-bold text-white">Recent Tenant Activity</h3>
                                <button className="text-xs text-red-400 hover:underline">View Full Audit Log</button>
                            </div>
                            <div className="divide-y divide-neutral-800">
                                {[
                                    { action: 'Phishing Campaign "Q3 Test" launched', user: 'John Doe', time: '2 hours ago', icon: '🎣' },
                                    { action: 'Added 15 new employee accounts', user: 'System Sync (Okta)', time: '5 hours ago', icon: '👤' },
                                    { action: 'Completed ISO 27001 Compliance Report generation', user: 'Jane Smith', time: '1 day ago', icon: '📄' },
                                    { action: 'Updated SSO Configuration settings', user: 'John Doe', time: '2 days ago', icon: '⚙️' },
                                    { action: 'Monthly invoice #INV-2024-001 paid', user: 'System', time: '1 week ago', icon: '💳' },
                                ].map((log, i) => (
                                    <div key={i} className="p-4 flex gap-4 hover:bg-neutral-800/30 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm shrink-0">
                                            {log.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{log.action}</p>
                                            <p className="text-xs text-neutral-500 mt-1">{log.user} • {log.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* Edit Details Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                            <h3 className="font-bold text-lg text-white">Edit Tenant Details</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Organization Name *</label>
                                <input type="text" defaultValue="Acme Corporation" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Primary Contact Name *</label>
                                    <input type="text" defaultValue="John Doe" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Contact Email *</label>
                                    <input type="email" defaultValue="john@acme.com" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Subscription Plan</label>
                                    <select defaultValue="Enterprise" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none">
                                        <option>Enterprise</option>
                                        <option>Business</option>
                                        <option>Starter</option>
                                        <option>Trial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5">Data Residency Region</label>
                                    <select defaultValue="US East (N. Virginia)" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none">
                                        <option>US East (N. Virginia)</option>
                                        <option>US West (Oregon)</option>
                                        <option>EU (Frankfurt)</option>
                                        <option>Asia Pacific (Sydney)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_12px_rgba(37,99,235,0.3)]">
                                Save Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Impersonate Admin Modal */}
            {isImpersonateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-blue-500/20">
                                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            </div>
                            <h3 className="font-bold text-xl text-white">Impersonate Tenant Admin?</h3>
                            <p className="text-sm text-neutral-400">
                                You are about to log in as the Tenant Admin for <strong className="text-neutral-200">Acme Corporation</strong>. All actions taken during this session will be logged in the centralized audit trail under your Super Admin credentials.
                            </p>

                            <div className="mt-4 bg-neutral-950 p-4 rounded-lg border border-neutral-800 text-left">
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Reason for Impersonation (Required for Audit)</label>
                                <textarea rows={2} className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-red-500 transition-colors" placeholder="e.g. Assisting with custom phishing template setup..."></textarea>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
                            <button onClick={() => setIsImpersonateModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <Link href="/tenant-admin">
                                <button onClick={() => setIsImpersonateModalOpen(false)} className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors shadow-[0_0_12px_rgba(220,38,38,0.3)]">
                                    Begin Session
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}

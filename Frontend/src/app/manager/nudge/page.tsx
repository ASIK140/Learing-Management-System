'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import RoleLayout from '@/components/layout/RoleLayout';
import { managerNavSections } from '../page';

export default function SendNudge() {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleSend = (type: string) => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setActiveModal(type);
            setTimeout(() => setActiveModal(null), 3000);
        }, 1500);
    };

    return (
        <RoleLayout title="Send Team Nudge" subtitle="Send personalized reminders to employees over Email, Slack, or Teams." accentColor="emerald" avatarText="M" avatarGradient="bg-gradient-to-tr from-emerald-500 to-teal-500" userName="Emily Davis" userEmail="emily.d@cybershield.com" navSections={managerNavSections.map(s => ({ ...s, items: s.items.map(i => ({ ...i, active: i.href === '/manager/nudge' })) }))} currentRole="manager">
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full relative">

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Recipients */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex-1">
                            <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2"><span>👥</span> Select Recipients</h3>

                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-6">
                                <p className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wide">High Priority (Overdue)</p>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-800 rounded-md cursor-pointer hover:border-emerald-500 transition">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500 rounded bg-neutral-900 border-neutral-700" />
                                        <span className="text-sm font-semibold text-white">Dan Brown</span>
                                        <span className="ml-auto text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded font-mono">21d overdue</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-800 rounded-md cursor-pointer hover:border-emerald-500 transition">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500 rounded bg-neutral-900 border-neutral-700" />
                                        <span className="text-sm font-semibold text-white">Mark Evans</span>
                                        <span className="ml-auto text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded font-mono">14d overdue</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-800 rounded-md cursor-pointer hover:border-emerald-500 transition">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500 rounded bg-neutral-900 border-neutral-700" />
                                        <span className="text-sm font-semibold text-white">Priya Mehta</span>
                                        <span className="ml-auto text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded font-mono">7d overdue</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">All Team Members</p>
                                    <button className="text-xs text-neutral-500 hover:text-white underline">Select All</button>
                                </div>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                    <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-800 rounded-md cursor-pointer hover:border-emerald-500 transition">
                                        <input type="checkbox" className="w-4 h-4 accent-emerald-500 rounded bg-neutral-900 border-neutral-700" />
                                        <span className="text-sm font-semibold text-neutral-300">James Lee</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-800 rounded-md cursor-pointer hover:border-emerald-500 transition">
                                        <input type="checkbox" className="w-4 h-4 accent-emerald-500 rounded bg-neutral-900 border-neutral-700" />
                                        <span className="text-sm font-semibold text-neutral-300">Yuki Tanaka</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-2 bg-neutral-950 border border-neutral-800 rounded-md cursor-pointer hover:border-emerald-500 transition">
                                        <input type="checkbox" className="w-4 h-4 accent-emerald-500 rounded bg-neutral-900 border-neutral-700" />
                                        <span className="text-sm font-semibold text-neutral-300">Alice Thompson</span>
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Column: Message Configuration */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
                            <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2"><span>✉️</span> Compose Nudge</h3>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-400 block">Delivery Channel</label>
                                    <select className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500">
                                        <option>Email</option>
                                        <option>Slack Direct Message</option>
                                        <option>Microsoft Teams</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-neutral-400 block">Template Type</label>
                                    <select className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500">
                                        <option>Friendly Reminder</option>
                                        <option>Manager Escalation</option>
                                        <option>Compliance Alert</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden mb-6">
                                <div className="bg-neutral-800/50 border-b border-neutral-800 px-4 py-2 flex items-center gap-2 text-xs text-neutral-400 font-mono">
                                    <span className="text-emerald-400">Available Variables:</span>
                                    <span className="bg-neutral-900 px-1 py-0.5 rounded border border-neutral-700 cursor-pointer hover:text-white">{`{{first_name}}`}</span>
                                    <span className="bg-neutral-900 px-1 py-0.5 rounded border border-neutral-700 cursor-pointer hover:text-white">{`{{course_name}}`}</span>
                                    <span className="bg-neutral-900 px-1 py-0.5 rounded border border-neutral-700 cursor-pointer hover:text-white">{`{{days_overdue}}`}</span>
                                </div>
                                <div className="p-4 flex flex-col gap-3 h-full">
                                    <input type="text" defaultValue="Action Required: Overdue Cybersecurity Training" className="w-full bg-transparent border-b border-neutral-800 pb-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500" />
                                    <textarea defaultValue={`Hi {{first_name}},\n\nJust a quick reminder that your cybersecurity training ({{course_name}}) is currently {{days_overdue}} days overdue.\n\nPlease complete this as soon as possible to ensure our team meets compliance requirements before the end of the month.\n\nThanks,\nEmily`} className="w-full h-full bg-transparent text-sm text-neutral-300 focus:outline-none resize-none leading-relaxed"></textarea>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-auto">
                                <button onClick={() => handleSend('toast_test')} className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-sm font-bold rounded-lg transition-colors">
                                    Test Send
                                </button>
                                <button onClick={() => handleSend('toast_sent')} disabled={processing} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center">
                                    {processing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> : 'Send Nudge (3)'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simulated Success Toasts */}
                {activeModal === 'toast_test' && (
                    <div className="absolute top-6 right-0 bg-neutral-800 border border-neutral-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right-5 fade-in duration-300 z-50">
                        <span className="text-xl">✉️</span>
                        <div>
                            <p className="text-sm font-bold">Test Nudge Sent</p>
                            <p className="text-xs opacity-80">Check your inbox for the preview.</p>
                        </div>
                    </div>
                )}
                {activeModal === 'toast_sent' && (
                    <div className="absolute top-6 right-0 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right-5 fade-in duration-300 z-50">
                        <span className="text-xl">🚀</span>
                        <div>
                            <p className="text-sm font-bold">Nudges Delivered</p>
                            <p className="text-xs opacity-80">3 messages sent via Email successfully.</p>
                        </div>
                    </div>
                )}

            </div>
        </RoleLayout>
    );
}

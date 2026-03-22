'use client';
import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotif, setSelectedNotif] = useState<any | null>(null);

    const fetchNotifications = async () => {
        try {
            const { apiFetch } = await import('@/utils/api');
            const res = await apiFetch('/admin/notifications');
            const json = await res.json();
            if (json.success) {
                setNotifications(json.data);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        try {
            const { apiFetch } = await import('@/utils/api');
            const res = await apiFetch(`/admin/notifications/${id}/read`, { method: 'PATCH' });
            const json = await res.json();
            if (json.success) {
                setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, read: true } : n));
            }
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const { apiFetch } = await import('@/utils/api');
            const res = await apiFetch('/admin/notifications/read-all', { method: 'PATCH' });
            const json = await res.json();
            if (json.success) {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            }
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMins = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMins < 60) return `${diffInMins} mins ago`;
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    };

    return (
        <SuperAdminLayout title="Notifications Center">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                    <div>
                        <h2 className="text-lg font-bold text-white">All Notifications</h2>
                        <p className="text-neutral-500 text-sm mt-1">Manage all your system alerts and messages.</p>
                    </div>
                    <button 
                        onClick={handleMarkAllRead}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Mark all as read
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                        <div className="divide-y divide-neutral-800">
                            {notifications.length > 0 ? notifications.map(notif => (
                                <div key={notif.notification_id} className={`p-5 flex gap-4 transition-colors hover:bg-neutral-800/50 ${notif.read ? 'opacity-70' : ''}`}>
                                    <div className="flex-shrink-0 mt-1">
                                        {notif.type === 'escalation' && <span className="text-2xl">🚨</span>}
                                        {notif.type === 'billing' && <span className="text-2xl">💰</span>}
                                        {notif.type === 'compliance' && <span className="text-2xl">⚖️</span>}
                                        {notif.type === 'system' && <span className="text-2xl">⚙️</span>}
                                        {!['escalation', 'billing', 'compliance', 'system'].includes(notif.type) && <span className="text-2xl">ℹ️</span>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <h3 className={`font-medium ${notif.severity === 'critical' ? 'text-red-400' :
                                                    notif.severity === 'high' ? 'text-orange-400' :
                                                        notif.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                                                }`}>
                                                {notif.title}
                                            </h3>
                                            <span className="text-xs text-neutral-500 whitespace-nowrap ml-4">{formatTime(notif.created_at)}</span>
                                        </div>
                                        <p className="text-sm text-neutral-300 mt-1.5 line-clamp-2">{notif.message}</p>
                                        <div className="mt-3 flex gap-3">
                                            <button 
                                                onClick={() => setSelectedNotif(notif)}
                                                className="text-xs mt-1 bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded text-neutral-300 transition-colors"
                                            >
                                                View Details
                                            </button>
                                            {!notif.read && (
                                                <button 
                                                    onClick={() => handleMarkAsRead(notif.notification_id)}
                                                    className="text-xs mt-1 text-neutral-500 hover:text-white px-3 py-1.5 rounded transition-colors"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {!notif.read && (
                                        <div className="flex-shrink-0 flex items-center h-full">
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2"></div>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="p-12 text-center text-neutral-500">
                                    No notifications found.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Notification Details Modal */}
            {selectedNotif && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-neutral-900 border border-neutral-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-950/50">
                            <h3 className="font-bold text-white">Notification Details</h3>
                            <button onClick={() => setSelectedNotif(null)} className="text-neutral-500 hover:text-white pb-1 text-2xl">&times;</button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">
                                    {selectedNotif.type === 'escalation' && '🚨'}
                                    {selectedNotif.type === 'billing' && '💰'}
                                    {selectedNotif.type === 'compliance' && '⚖️'}
                                    {selectedNotif.type === 'system' && '⚙️'}
                                </span>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">{selectedNotif.type}</p>
                                    <h4 className={`text-xl font-bold mt-0.5 ${selectedNotif.severity === 'critical' ? 'text-red-400' : 'text-white'}`}>
                                        {selectedNotif.title}
                                    </h4>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl">
                                    <p className="text-sm text-neutral-300 leading-relaxed italic">
                                        "{selectedNotif.message}"
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="p-3 rounded-lg bg-neutral-800/50 border border-neutral-800">
                                        <p className="text-neutral-500 font-medium mb-1 uppercase tracking-tighter">Severity</p>
                                        <p className={`font-bold capitalize ${selectedNotif.severity === 'critical' ? 'text-red-400' :
                                                selectedNotif.severity === 'high' ? 'text-orange-400' :
                                                    selectedNotif.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                                            }`}>{selectedNotif.severity}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-neutral-800/50 border border-neutral-800">
                                        <p className="text-neutral-500 font-medium mb-1 uppercase tracking-tighter">Received</p>
                                        <p className="font-bold text-neutral-300">{new Date(selectedNotif.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={() => setSelectedNotif(null)}
                                    className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-bold rounded-xl transition-all border border-neutral-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </SuperAdminLayout>
    );
}

'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout';

// ─── DATA ──────────────────────────────────────────────────────────────
const kpiRow1 = [
    { label: 'Active Tenants', value: '142', change: '+4', changeDir: 'up', icon: '🏢', color: 'from-blue-600/20 to-blue-500/5 border-blue-500/20' },
    { label: 'Total Employees', value: '89,412', change: '+2.1k', changeDir: 'up', icon: '👥', color: 'from-purple-600/20 to-purple-500/5 border-purple-500/20' },
    { label: 'Open Escalations', value: '7', change: '+2', changeDir: 'down', icon: '🚨', color: 'from-red-600/20 to-red-500/5 border-red-500/20' },
    { label: 'Monthly Revenue', value: '$284,500', change: '+12%', changeDir: 'up', icon: '💰', color: 'from-green-600/20 to-green-500/5 border-green-500/20' },
];

const kpiRow2 = [
    { label: 'Platform Uptime', value: '99.98%', change: '30d avg', changeDir: 'neutral', icon: '⚡', color: 'from-cyan-600/20 to-cyan-500/5 border-cyan-500/20' },
    { label: 'Courses Published', value: '1,284', change: '+38', changeDir: 'up', icon: '📚', color: 'from-indigo-600/20 to-indigo-500/5 border-indigo-500/20' },
    { label: 'Email Health', value: '97.3%', change: 'Delivery rate', changeDir: 'neutral', icon: '✉️', color: 'from-teal-600/20 to-teal-500/5 border-teal-500/20' },
    { label: 'NGO Applications', value: '11', change: 'Pending review', changeDir: 'neutral', icon: '🤝', color: 'from-orange-600/20 to-orange-500/5 border-orange-500/20' },
];

const tenants = [
    { name: 'Acme Corporation', plan: 'Enterprise', seats: '450/500', health: 94, risk: 'Low', status: 'Active', lastActivity: '2m ago' },
    { name: 'TechNova Inc.', plan: 'Business', seats: '280/300', health: 78, risk: 'Medium', status: 'Active', lastActivity: '18m ago' },
    { name: 'Global Finance Ltd.', plan: 'Enterprise', seats: '1100/1200', health: 62, risk: 'High', status: 'Flagged', lastActivity: '2h ago' },
    { name: 'Retail Brands Co.', plan: 'Starter', seats: '45/50', health: 88, risk: 'Low', status: 'Active', lastActivity: '35m ago' },
    { name: 'MediCare Group', plan: 'Business', seats: '190/250', health: 55, risk: 'High', status: 'Trial', lastActivity: '4h ago' },
    { name: 'EduTech Systems', plan: 'Starter', seats: '28/50', health: 91, risk: 'Low', status: 'Active', lastActivity: '6h ago' },
    { name: 'SecureBank PLC', plan: 'Enterprise', seats: '820/1000', health: 72, risk: 'Medium', status: 'Active', lastActivity: '1d ago' },
];

const INITIAL_ESCALATIONS = [
    { id: 'ESC-0091', tenant: 'Global Finance Ltd.', issue: 'Critical API authentication failure causing employee lockout', sla: 'Breached', priority: 'Critical', age: '3h 22m' },
    { id: 'ESC-0090', tenant: 'TechNova Inc.', issue: 'Bulk phishing campaign mislabeled as production send', sla: 'At Risk', priority: 'High', age: '6h 11m' },
    { id: 'ESC-0089', tenant: 'Acme Corporation', issue: 'SSO integration broken after tenant reconfiguration', sla: 'On Track', priority: 'High', age: '8h 5m' },
    { id: 'ESC-0088', tenant: 'MediCare Group', issue: 'Compliance report generation fails for Q4 export', sla: 'On Track', priority: 'Medium', age: '11h ago' },
    { id: 'ESC-0087', tenant: 'SecureBank PLC', issue: 'Email deliverability dropped below 90% threshold', sla: 'On Track', priority: 'Medium', age: '1d ago' },
];

const securityMetrics = [
    { label: 'Global Human Risk Score', value: '62/100', sub: 'Across all tenants', color: 'text-yellow-400', bg: 'from-yellow-600/20 to-transparent border-yellow-500/20' },
    { label: 'Failed Login Attempts', value: '4,821', sub: 'Last 24 hours', color: 'text-red-400', bg: 'from-red-600/20 to-transparent border-red-500/20' },
    { label: 'Security Alerts', value: '14', sub: '3 critical, 11 high', color: 'text-orange-400', bg: 'from-orange-600/20 to-transparent border-orange-500/20' },
    { label: 'Avg Phishing Click Rate', value: '18.4%', sub: 'Platform average', color: 'text-purple-400', bg: 'from-purple-600/20 to-transparent border-purple-500/20' },
];

const infraCards = [
    { label: 'API Usage', value: '68%', used: '1.36M / 2M req/day', bar: 68, color: 'bg-blue-500', warn: false },
    { label: 'Storage Usage', value: '54%', used: '2.7 TB / 5 TB', bar: 54, color: 'bg-purple-500', warn: false },
    { label: 'Email Queue', value: '1,240 queued', used: '~4 min delivery lag', bar: 24, color: 'bg-teal-500', warn: false },
    { label: 'AI Engine Status', value: 'Operational', used: 'Latency: 220ms avg', bar: 100, color: 'bg-green-500', warn: false },
];

// Bar chart data for Platform Analytics
const dailyActiveUsers = [45, 62, 78, 55, 90, 84, 72, 95, 88, 76, 60, 82];
const courseCompletions = [20, 35, 28, 45, 52, 38, 42, 60, 55, 48, 30, 50];
const phishingActivity = [12, 25, 18, 30, 22, 40, 15, 35, 28, 45, 20, 38];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const riskBadge = (risk: string) => {
    const map: Record<string, string> = {
        Low: 'text-green-400 bg-green-400/10 border-green-500/20',
        Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20',
        High: 'text-red-400 bg-red-400/10 border-red-500/20',
    };
    return map[risk] || 'text-neutral-400 bg-neutral-800 border-neutral-700';
};

const statusBadge = (status: string) => {
    const map: Record<string, string> = {
        Active: 'text-green-400 bg-green-400/10 border-green-500/20',
        Trial: 'text-blue-400 bg-blue-400/10 border-blue-500/20',
        Flagged: 'text-red-400 bg-red-400/10 border-red-500/20',
        Suspended: 'text-orange-400 bg-orange-400/10 border-orange-500/20',
    };
    return map[status] || 'text-neutral-400 bg-neutral-800 border-neutral-700';
};

const slaBadge = (sla: string) => {
    const map: Record<string, string> = {
        Breached: 'text-red-400 bg-red-400/10 border-red-500/20',
        'At Risk': 'text-orange-400 bg-orange-400/10 border-orange-500/20',
        'On Track': 'text-green-400 bg-green-400/10 border-green-500/20',
    };
    return map[sla] || 'text-neutral-400 bg-neutral-800';
};

const prioColor = (prio: string) => ({ Critical: 'text-red-400', High: 'text-orange-400', Medium: 'text-yellow-400', Low: 'text-blue-400' }[prio] || 'text-neutral-400');

// ─── COMPONENT ────────────────────────────────────────────────────────
export default function SuperAdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [tenantsList, setTenantsList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tenantSearch, setTenantSearch] = useState('');
    const [selectedChart, setSelectedChart] = useState<'dau' | 'completions' | 'phishing'>('dau');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [editModalTenant, setEditModalTenant] = useState<any | null>(null);
    const [suspendModalTenant, setSuspendModalTenant] = useState<any | null>(null);
    const [escalationsList, setEscalationsList] = useState(INITIAL_ESCALATIONS);
    const [resolvingId, setResolvingId] = useState<string | null>(null);

    const handleResolveEscalation = (id: string) => {
        setResolvingId(id);
        // Simulate API call
        setTimeout(() => {
            setEscalationsList(prev => prev.filter(e => e.id !== id));
            setResolvingId(null);
        }, 800);
    };

    const fetchTenants = async () => {
        try {
            const { apiFetch } = await import('@/utils/api');
            const res = await apiFetch('/admin/tenants');
            const json = await res.json();
            if (json.success) {
                const mapped = json.data.map((t: any) => ({
                    id: t.tenant_id,
                    name: t.organization_name,
                    contact: t.admin_email,
                    plan: t.plan_type,
                    seats: `${t.seat_count}/${t.user_limit}`,
                    health: 85, 
                    risk: 'Low', 
                    status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
                    lastActivity: 'Recent'
                }));
                setTenantsList(mapped);
            }
        } catch (err) {
            console.error('Failed to fetch tenants', err);
        }
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { apiFetch } = await import('@/utils/api');
                const res = await apiFetch('/admin/dashboard');
                const json = await res.json();
                if (json.success) {
                    setStats(json.data);
                    await fetchTenants();
                } else {
                    setError('Failed to fetch dashboard data');
                }
            } catch (err) {
                setError('Network error connecting to API');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) return (
        <SuperAdminLayout title="Super Admin Dashboard">
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                <span className="ml-3 text-neutral-400">Loading platform metrics...</span>
            </div>
        </SuperAdminLayout>
    );

    if (error) return (
        <SuperAdminLayout title="Super Admin Dashboard">
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <p className="font-bold">Error</p>
                <p className="text-sm">{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm">Retry</button>
            </div>
        </SuperAdminLayout>
    );

    const kpiRow1Fetched = [
        { label: 'Active Tenants', value: stats.overview.active_tenants, change: '+4', changeDir: 'up', icon: '🏢', color: 'from-blue-600/20 to-blue-500/5 border-blue-500/20' },
        { label: 'Total Employees', value: stats.overview.total_users.toLocaleString(), change: '+2.1k', changeDir: 'up', icon: '👥', color: 'from-purple-600/20 to-purple-500/5 border-purple-500/20' },
        { label: 'Open Escalations', value: escalationsList.length, change: '+2', changeDir: 'down', icon: '🚨', color: 'from-red-600/20 to-red-500/5 border-red-500/20' },
        { label: 'Monthly Revenue', value: `$${stats.revenue.mrr.toLocaleString()}`, change: '+12%', changeDir: 'up', icon: '💰', color: 'from-green-600/20 to-green-500/5 border-green-500/20' },
    ];

    const kpiRow2Fetched = [
        { label: 'Platform Uptime', value: `${stats.system_status.uptime_pct}%`, change: '30d avg', changeDir: 'neutral', icon: '⚡', color: 'from-cyan-600/20 to-cyan-500/5 border-cyan-500/20' },
        { label: 'Courses Published', value: stats.overview.courses_published.toLocaleString(), change: '+38', changeDir: 'up', icon: '📚', color: 'from-indigo-600/20 to-indigo-500/5 border-indigo-500/20' },
        { label: 'Email Health', value: '97.3%', change: 'Delivery rate', changeDir: 'neutral', icon: '✉️', color: 'from-teal-600/20 to-teal-500/5 border-teal-500/20' },
        { label: 'NGO Applications', value: '11', change: 'Pending review', changeDir: 'neutral', icon: '🤝', color: 'from-orange-600/20 to-orange-500/5 border-orange-500/20' },
    ];

    const chartData = selectedChart === 'dau' ? dailyActiveUsers : selectedChart === 'completions' ? courseCompletions : phishingActivity;
    const chartColor = selectedChart === 'dau' ? 'from-blue-600 to-cyan-400' : selectedChart === 'completions' ? 'from-green-600 to-teal-400' : 'from-red-600 to-orange-400';
    const chartLabel = selectedChart === 'dau' ? 'Daily Active Users (K)' : selectedChart === 'completions' ? 'Course Completions (K)' : 'Phishing Campaigns Active';

    const filteredTenants = tenantsList.filter(t => t.name.toLowerCase().includes(tenantSearch.toLowerCase()));

    return (
        <SuperAdminLayout title="Super Admin Dashboard">

            {/* ══ ROW 1: KPI CARDS ══ */}
            <section>
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Platform KPIs</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpiRow1Fetched.map(kpi => (
                        <div key={kpi.label} className={`p-4 rounded-xl bg-gradient-to-br border ${kpi.color} relative overflow-hidden`}>
                            <div className="flex items-start justify-between">
                                <span className="text-2xl">{kpi.icon}</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${kpi.changeDir === 'up' ? 'text-green-400 bg-green-400/10' : kpi.changeDir === 'down' ? 'text-red-400 bg-red-400/10' : 'text-neutral-400 bg-neutral-800'}`}>
                                    {kpi.changeDir === 'up' ? '↑' : kpi.changeDir === 'down' ? '↓' : ''} {kpi.change}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-white mt-3">{kpi.value}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">{kpi.label}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {kpiRow2Fetched.map(kpi => (
                        <div key={kpi.label} className={`p-4 rounded-xl bg-gradient-to-br border ${kpi.color} relative overflow-hidden`}>
                            <div className="flex items-start justify-between">
                                <span className="text-2xl">{kpi.icon}</span>
                                <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">{kpi.change}</span>
                            </div>
                            <p className="text-2xl font-bold text-white mt-3">{kpi.value}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">{kpi.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ ROW 2: Security Overview + Infrastructure ══ */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* SECURITY OVERVIEW */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Security Overview</h3>
                        <button className="text-xs text-red-400 hover:text-red-300 transition-colors">View Security Center →</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {securityMetrics.map(m => (
                            <div key={m.label} className={`p-4 rounded-xl bg-gradient-to-br border ${m.bg}`}>
                                <p className="text-xs text-neutral-400">{m.label}</p>
                                <p className={`text-2xl font-bold mt-2 ${m.color}`}>{m.value}</p>
                                <p className="text-xs text-neutral-500 mt-0.5">{m.sub}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* INFRASTRUCTURE STATUS */}
                <section>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Platform Infrastructure</h3>
                        <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Platform Health →</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {infraCards.map(card => (
                            <div key={card.label} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
                                <p className="text-xs text-neutral-400">{card.label}</p>
                                <p className="text-lg font-bold text-white mt-2">{card.value}</p>
                                <p className="text-xs text-neutral-500 mt-0.5">{card.used}</p>
                                {card.label !== 'AI Engine Status' && (
                                    <div className="mt-3 h-1 bg-neutral-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${card.bar > 80 ? 'bg-red-500' : card.bar > 60 ? 'bg-yellow-500' : card.color} rounded-full transition-all`}
                                            style={{ width: `${card.bar}%` }}
                                        />
                                    </div>
                                )}
                                {card.label === 'AI Engine Status' && (
                                    <div className="flex items-center gap-1.5 mt-3">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                        <span className="text-xs text-green-400">Online</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* ══ ROW 3: Platform Analytics Chart ══ */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Platform Analytics</h3>
                    <div className="flex items-center gap-2">
                        {[
                            { key: 'dau', label: 'Daily Active Users' },
                            { key: 'completions', label: 'Course Completions' },
                            { key: 'phishing', label: 'Phishing Activity' },
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setSelectedChart(tab.key as 'dau' | 'completions' | 'phishing')}
                                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${selectedChart === tab.key
                                        ? 'bg-neutral-700 text-white border border-neutral-600'
                                        : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-semibold text-white">{chartLabel}</p>
                            <p className="text-xs text-neutral-500">Last 12 months — all tenants</p>
                        </div>
                        <div className="flex gap-1.5">
                            {['1W', '1M', '3M', '1Y'].map(r => (
                                <button key={r} className={`text-xs px-2.5 py-1 rounded-md ${r === '1Y' ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:bg-neutral-800'}`}>{r}</button>
                            ))}
                        </div>
                    </div>
                    <div className="h-48 flex items-end gap-1.5 px-2">
                        {chartData.map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative h-full">
                                <div className="w-full flex-1 flex items-end">
                                    <div
                                        className={`w-full bg-gradient-to-t ${chartColor} rounded-t-sm transition-all duration-500 hover:opacity-80 cursor-pointer`}
                                        style={{ height: `${(h / Math.max(...chartData)) * 100}%` }}
                                        title={`${months[i]}: ${h}k`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 px-2">
                        {months.map(m => (
                            <span key={m} className="text-[10px] text-neutral-600 flex-1 text-center">{m}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ ROW 4: Tenant Health Table ══ */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Tenant Health</h3>
                    <div className="flex items-center gap-2">
                        <input
                            value={tenantSearch}
                            onChange={e => setTenantSearch(e.target.value)}
                            placeholder="Search tenants..."
                            className="px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 w-48 transition-colors"
                        />
                        <button onClick={() => setTenantSearch(tenantSearch)} className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg border border-neutral-700 transition-colors">
                            Filter
                        </button>
                        <button onClick={() => setIsAddModalOpen(true)} className="text-xs px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg border border-red-500/20 transition-colors">
                            + New Tenant
                        </button>
                    </div>
                </div>
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-neutral-800 text-neutral-500 text-[11px] uppercase tracking-wider">
                                <th className="text-left px-5 py-3">Tenant Name</th>
                                <th className="text-left px-5 py-3">Plan</th>
                                <th className="text-left px-5 py-3">Seat Usage</th>
                                <th className="text-left px-5 py-3">Health</th>
                                <th className="text-left px-5 py-3">Risk</th>
                                <th className="text-left px-5 py-3">Status</th>
                                <th className="text-left px-5 py-3">Last Activity</th>
                                <th className="text-left px-5 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {filteredTenants.map((t, idx) => (
                                <tr key={`tenant-${t.id}-${idx}`} className="hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-5 py-3.5 font-semibold text-white">{t.name}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${t.plan === 'Enterprise' ? 'text-purple-400 bg-purple-400/10 border border-purple-500/20' :
                                                t.plan === 'Business' ? 'text-blue-400 bg-blue-400/10 border border-blue-500/20' :
                                                    'text-neutral-400 bg-neutral-800 border border-neutral-700'
                                            }`}>{t.plan}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${parseInt(t.seats) / parseInt(t.seats.split('/')[1]) > 0.9 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${(parseInt(t.seats) / parseInt(t.seats.split('/')[1])) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-neutral-400">{t.seats}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold ${t.health >= 85 ? 'text-green-400' : t.health >= 65 ? 'text-yellow-400' : 'text-red-400'}`}>{t.health}</span>
                                            <div className="w-12 h-1 bg-neutral-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${t.health >= 85 ? 'bg-green-500' : t.health >= 65 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${t.health}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${riskBadge(t.risk)}`}>{t.risk}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusBadge(t.status)}`}>{t.status}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-neutral-500">{t.lastActivity}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex gap-1.5 relative">
                                            <Link href="/admin/tenants/details">
                                                <button className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md border border-neutral-700 transition-colors text-[10px]">View</button>
                                            </Link>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === t.id ? null : t.id);
                                                }}
                                                className="px-2.5 py-1 bg-neutral-800 hover:bg-red-900/40 text-neutral-400 hover:text-red-400 rounded-md border border-neutral-700 hover:border-red-500/30 transition-colors text-[10px]"
                                            >
                                                •••
                                            </button>

                                            {/* Action Dropdown */}
                                            {activeDropdown === t.id && (
                                                <div className="absolute right-0 top-full mt-1 w-36 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-10 overflow-hidden text-left">
                                                    <button onClick={() => { setEditModalTenant(t); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-[10px] text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">Edit Tenant</button>
                                                    <Link href="/admin/billing">
                                                        <button className="w-full text-left px-4 py-2.5 text-[10px] text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors">Manage Billing</button>
                                                    </Link>
                                                    <div className="border-t border-neutral-800"></div>
                                                    <button onClick={() => { setSuspendModalTenant(t); setActiveDropdown(null); }} className="w-full text-left px-4 py-2.5 text-[10px] text-orange-400 hover:bg-neutral-800 transition-colors">Suspend Tenant</button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ══ ROW 5: Open Escalations ══ */}
            <section>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Open Escalations</h3>
                        <span className="text-[10px] font-bold text-red-400 bg-red-400/10 border border-red-500/20 px-2 py-0.5 rounded-full">{escalationsList.length} open</span>
                    </div>
                    <Link href="/admin/escalations">
                        <button className="text-xs text-red-400 hover:text-red-300 transition-colors">View All Escalations →</button>
                    </Link>
                </div>
                <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-neutral-800 text-neutral-500 text-[11px] uppercase tracking-wider">
                                <th className="text-left px-5 py-3">ID</th>
                                <th className="text-left px-5 py-3">Tenant</th>
                                <th className="text-left px-5 py-3">Issue</th>
                                <th className="text-left px-5 py-3">SLA Status</th>
                                <th className="text-left px-5 py-3">Priority</th>
                                <th className="text-left px-5 py-3">Age</th>
                                <th className="text-left px-5 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                            {escalationsList.map(e => (
                                <tr key={e.id} className="hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-5 py-3.5 font-mono font-medium text-neutral-300">{e.id}</td>
                                    <td className="px-5 py-3.5 text-white font-medium">{e.tenant}</td>
                                    <td className="px-5 py-3.5 text-neutral-400 max-w-xs truncate">{e.issue}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${slaBadge(e.sla)}`}>{e.sla}</span>
                                    </td>
                                    <td className={`px-5 py-3.5 font-bold ${prioColor(e.priority)}`}>{e.priority}</td>
                                    <td className="px-5 py-3.5 text-neutral-500">{e.age}</td>
                                    <td className="px-5 py-3.5">
                                        <button 
                                            onClick={() => handleResolveEscalation(e.id)}
                                            disabled={resolvingId === e.id}
                                            className="px-3 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-md border border-red-500/20 transition-colors text-[10px] font-medium disabled:opacity-50"
                                        >
                                            {resolvingId === e.id ? 'Resolving...' : 'Resolve'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Add Tenant Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                            <h3 className="font-bold text-lg text-white">Add New Tenant</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Organization Name *</label>
                                <input id="db-new-org-name" type="text" placeholder="e.g. Acme Corporation" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Primary Contact Name *</label>
                                    <input id="db-new-contact-name" type="text" placeholder="John Doe" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Contact Email *</label>
                                    <input id="db-new-contact-email" type="email" placeholder="admin@org.com" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Subscription Plan</label>
                                    <select id="db-new-plan" className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none">
                                        <option>Enterprise</option>
                                        <option>Business</option>
                                        <option>Starter</option>
                                        <option>Trial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Seat Allocation</label>
                                    <input id="db-new-seats" type="number" defaultValue={100} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
                            <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-300 hover:text-white transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    const name = (document.getElementById('db-new-org-name') as HTMLInputElement).value;
                                    const email = (document.getElementById('db-new-contact-email') as HTMLInputElement).value;
                                    const plan = (document.getElementById('db-new-plan') as HTMLSelectElement).value;
                                    const seats = (document.getElementById('db-new-seats') as HTMLInputElement).value;

                                    try {
                                        const { apiFetch } = await import('@/utils/api');
                                        const res = await apiFetch('/admin/tenants', {
                                            method: 'POST',
                                            body: JSON.stringify({ organization_name: name, admin_email: email, plan_type: plan, user_limit: parseInt(seats) })
                                        });
                                        if (res.ok) {
                                            setIsAddModalOpen(false);
                                            await fetchTenants();
                                            // Refresh stats too
                                            const statsRes = await apiFetch('/admin/dashboard');
                                            const statsJson = await statsRes.json();
                                            if (statsJson.success) setStats(statsJson.data);
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
            )}

            {/* Edit Tenant Modal */}
            {editModalTenant && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
                            <h3 className="font-bold text-lg text-white">Edit {editModalTenant.name}</h3>
                            <button onClick={() => setEditModalTenant(null)} className="text-neutral-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Organization Name *</label>
                                <input type="text" defaultValue={editModalTenant.name} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Primary Contact Name *</label>
                                    <input type="text" defaultValue={editModalTenant.contact.split('@')[0]} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Contact Email *</label>
                                    <input type="email" defaultValue={editModalTenant.contact} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Subscription Plan</label>
                                    <select defaultValue={editModalTenant.plan} className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer appearance-none">
                                        <option>Enterprise</option>
                                        <option>Business</option>
                                        <option>Starter</option>
                                        <option>Trial</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-neutral-400 mb-1.5 uppercase tracking-wider">Seat Allocation</label>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 text-center space-y-4">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-500/20">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <h3 className="font-bold text-xl text-white">Suspend {suspendModalTenant.name}?</h3>
                            <p className="text-sm text-neutral-400">
                                This will immediately revoke access for all <strong className="text-neutral-200">{suspendModalTenant.seats.split('/')[0]} users</strong> within this tenant.
                            </p>
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
                                            await fetchTenants();
                                            // Refresh stats
                                            const statsRes = await apiFetch('/admin/dashboard');
                                            const statsJson = await statsRes.json();
                                            if (statsJson.success) setStats(statsJson.data);
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
        </SuperAdminLayout>
    );
}

'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import RoleLayout from '@/components/layout/RoleLayout';
import { contentNavSections } from '../page';

/* ─── Types ──────────────────────────────── */
type CourseStatus = 'Published' | 'In Review' | 'Draft' | 'Archived';
type Course = {
    id: number;
    name: string;
    community: string;
    lang: string;
    enrolled: number;
    completion: number | null;
    certs: number;
    languages: string[];
    modules: number;
    status: CourseStatus;
    partnerOrgs: { name: string; users: number }[];
};

/* ─── Data ───────────────────────────────── */
const SEED_COURSES: Course[] = [
    {
        id: 1, name: 'WhatsApp Scam Safety', community: 'Seniors', lang: 'English, Hindi',
        languages: ['English', 'Hindi'], enrolled: 840, completion: 82, certs: 690, modules: 4, status: 'Published',
        partnerOrgs: [{ name: 'CyberSafe Seniors Org', users: 340 }, { name: 'LokSeva Digital Trust', users: 280 }, { name: 'Silver Age Foundation', users: 220 }],
    },
    {
        id: 2, name: 'OTP & UPI Fraud Prevention', community: 'Rural Outreach', lang: 'Hindi, Marathi',
        languages: ['Hindi', 'Marathi'], enrolled: 1250, completion: 91, certs: 1100, modules: 5, status: 'Published',
        partnerOrgs: [{ name: 'Rural Digital Empowerment Trust', users: 500 }, { name: 'GramSeva Foundation', users: 450 }, { name: 'KrishiTech Dev. Society', users: 300 }],
    },
    {
        id: 3, name: 'Fake Job Offers & Identity Theft', community: 'College Students', lang: 'English',
        languages: ['English'], enrolled: 420, completion: 45, certs: 180, modules: 3, status: 'In Review',
        partnerOrgs: [{ name: 'National Youth Connect', users: 220 }, { name: 'Campus CyberSafe Initiative', users: 200 }],
    },
    {
        id: 4, name: 'Safe Online Shopping Basics', community: 'General Public', lang: 'Multi-lingual',
        languages: ['English', 'Hindi', 'Tamil', 'Bengali'], enrolled: 0, completion: null, certs: 0, modules: 2, status: 'Draft',
        partnerOrgs: [],
    },
    {
        id: 5, name: 'Digital Literacy for Women', community: 'Rural Outreach', lang: 'Hindi, Gujarati',
        languages: ['Hindi', 'Gujarati'], enrolled: 620, completion: 73, certs: 490, modules: 4, status: 'Published',
        partnerOrgs: [{ name: 'Mahila Pragati Sansthan', users: 340 }, { name: 'SheLeads Digital', users: 280 }],
    },
    {
        id: 6, name: 'Social Media Safety for Teens', community: 'College Students', lang: 'English',
        languages: ['English'], enrolled: 0, completion: null, certs: 0, modules: 3, status: 'Draft',
        partnerOrgs: [],
    },
];

const STATUS_CFG: Record<CourseStatus, { label: string; cls: string }> = {
    Published:  { label: 'PUBLISHED', cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
    'In Review':{ label: 'IN REVIEW', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    Draft:      { label: 'DRAFT',     cls: 'bg-neutral-800 text-neutral-400 border-neutral-700' },
    Archived:   { label: 'ARCHIVED',  cls: 'bg-neutral-900 text-neutral-600 border-neutral-800' },
};

export default function NGOCourses() {
    const [courses, setCourses] = useState<Course[]>(SEED_COURSES);
    const [search, setSearch]   = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | CourseStatus>('All');
    const [communityFilter, setCommunityFilter] = useState('All');
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

    /* Modals */
    const [impactModal, setImpactModal] = useState<Course | null>(null);
    const [deleteModal, setDeleteModal] = useState<Course | null>(null);
    const [donorModal, setDonorModal]   = useState<Course | null>(null);
    const [donorStep, setDonorStep]     = useState<'preview' | 'generating' | 'ready'>('preview');
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [exporting, setExporting] = useState(false);

    const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    /* ── Stats ── */
    const stats = useMemo(() => ({
        total: courses.length,
        published: courses.filter(c => c.status === 'Published').length,
        totalEnrolled: courses.reduce((s, c) => s + c.enrolled, 0),
        totalCerts: courses.reduce((s, c) => s + c.certs, 0),
        avgCompletion: Math.round(
            courses.filter(c => c.completion !== null).reduce((s, c) => s + (c.completion ?? 0), 0) /
            Math.max(1, courses.filter(c => c.completion !== null).length)
        ),
    }), [courses]);

    /* ── Communities ── */
    const communities = ['All', ...Array.from(new Set(courses.map(c => c.community)))];

    /* ── Filtered ── */
    const filtered = useMemo(() => courses.filter(c => {
        const q = search.toLowerCase();
        const matchSearch = !search || c.name.toLowerCase().includes(q) || c.community.toLowerCase().includes(q) || c.lang.toLowerCase().includes(q);
        const matchStatus = statusFilter === 'All' || c.status === statusFilter;
        const matchComm   = communityFilter === 'All' || c.community === communityFilter;
        return matchSearch && matchStatus && matchComm;
    }), [courses, search, statusFilter, communityFilter]);

    /* ── Submit for review ── */
    const handleSubmitReview = (c: Course) => {
        setCourses(prev => prev.map(x => x.id === c.id ? { ...x, status: 'In Review' } : x));
        showToast(`📤 "${c.name}" submitted for review!`);
    };

    /* ── Archive ── */
    const handleArchive = (c: Course) => {
        setCourses(prev => prev.map(x => x.id === c.id ? { ...x, status: 'Archived' } : x));
        showToast(`📦 "${c.name}" archived.`, 'info');
    };

    /* ── Delete ── */
    const handleDelete = () => {
        if (!deleteModal) return;
        setDeleteProcessing(true);
        setTimeout(() => {
            setCourses(prev => prev.filter(c => c.id !== deleteModal.id));
            setDeleteModal(null);
            setDeleteProcessing(false);
            showToast(`🗑️ "${deleteModal.name}" deleted.`, 'info');
        }, 800);
    };

    /* ── Export CSV ── */
    const handleExport = () => {
        setExporting(true);
        const rows = [
            ['Course', 'Community', 'Language', 'Enrolled', 'Completion %', 'Certs', 'Modules', 'Status'],
            ...courses.map(c => [c.name, c.community, c.lang, c.enrolled, c.completion ?? 'N/A', c.certs, c.modules, c.status])
        ];
        const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'ngo-community-courses.csv'; a.click();
        setTimeout(() => { setExporting(false); showToast('✅ Community courses exported to CSV!'); }, 700);
    };

    /* ── Donor Report ── */
    const handleGenerateDonorReport = () => {
        if (!donorModal) return;
        setDonorStep('generating');
        setTimeout(() => setDonorStep('ready'), 2000);
    };
    const handleDownloadDonorReport = () => {
        if (!donorModal) return;
        const content = [
            `COMMUNITY IMPACT DONOR REPORT`,
            `Course: ${donorModal.name}`,
            `Community: ${donorModal.community}`,
            `Languages: ${donorModal.lang}`,
            `Total Enrolled: ${donorModal.enrolled.toLocaleString()}`,
            `Completion Rate: ${donorModal.completion ?? 'N/A'}%`,
            `Certificates Issued: ${donorModal.certs.toLocaleString()}`,
            `Modules: ${donorModal.modules}`,
            `Status: ${donorModal.status}`,
            ``,
            `Partner Organizations:`,
            ...donorModal.partnerOrgs.map(o => `  - ${o.name}: ${o.users} users`),
            ``,
            `Generated: ${new Date().toLocaleString()}`,
            `Generated by: CyberShield LMS — Community Impact Platform`,
        ].join('\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = `${donorModal.name.replace(/ /g, '-')}-donor-report.txt`; a.click();
        setDonorModal(null);
        setDonorStep('preview');
        showToast('✅ Donor Report downloaded!');
    };

    const toastCls: Record<string, string> = {
        success: 'bg-green-600', error: 'bg-red-600', info: 'bg-cyan-700',
    };

    return (
        <RoleLayout
            title="NGO / Community Courses"
            subtitle="Manage open-access public awareness initiatives."
            accentColor="cyan" avatarText="CC"
            avatarGradient="bg-gradient-to-tr from-cyan-500 to-blue-500"
            userName="Sarah Jenkins" userEmail="sarah.j@cybershield.com"
            navSections={contentNavSections}
            currentRole="content-creator"
        >
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">

                {/* TOAST */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl font-bold text-sm text-white max-w-sm ${toastCls[toast.type]}`}>
                        {toast.msg}
                    </div>
                )}

                {/* ── Header Banner ─────────────────────────── */}
                <div className="flex justify-between items-center bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
                    <div className="flex gap-4 items-center relative z-10">
                        <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(6,182,212,0.2)]">🌍</div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Community Library</h2>
                            <p className="text-sm text-cyan-100/70">Simplified, highly-accessible content for public training and partner NGOs.</p>
                        </div>
                    </div>
                    <div className="flex gap-3 relative z-10">
                        <button onClick={handleExport} disabled={exporting}
                            className="px-4 py-2.5 bg-neutral-900/60 border border-neutral-700 hover:bg-neutral-800 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition flex items-center gap-2 backdrop-blur">
                            {exporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '📥'}
                            {exporting ? 'Exporting…' : 'Export CSV'}
                        </button>
                        <Link href="/content-creator/new-course"
                            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all">
                            + New Community Course
                        </Link>
                    </div>
                </div>

                {/* ── Stats ─────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                        { label: 'Total Courses',    value: stats.total,                        color: 'text-white',      bg: 'bg-neutral-900 border-neutral-800',    filter: 'All' as const },
                        { label: 'Published',         value: stats.published,                    color: 'text-green-400',  bg: 'bg-green-500/5 border-green-500/20',   filter: 'Published' as const },
                        { label: 'Community Reach',  value: stats.totalEnrolled.toLocaleString(),color: 'text-cyan-400',  bg: 'bg-cyan-500/5 border-cyan-500/20',     filter: 'All' as const },
                        { label: 'Certs Issued',     value: stats.totalCerts.toLocaleString(),  color: 'text-yellow-400', bg: 'bg-yellow-500/5 border-yellow-500/20', filter: 'All' as const },
                        { label: 'Avg Completion',   value: `${stats.avgCompletion}%`,          color: 'text-indigo-400', bg: 'bg-indigo-500/5 border-indigo-500/20', filter: 'All' as const },
                    ].map(s => (
                        <div key={s.label} className={`border rounded-xl p-3 cursor-pointer hover:opacity-90 transition ${s.bg}`}
                            onClick={() => setStatusFilter(s.filter)}>
                            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                            <p className="text-xs text-neutral-500 font-medium mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Table Card ─────────────────────────────── */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">

                    {/* Toolbar */}
                    <div className="p-4 border-b border-neutral-800 flex flex-wrap gap-3 items-center justify-between bg-neutral-900/50">
                        {/* Search */}
                        <div className="relative w-72">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
                            <input
                                type="text" value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search courses, community, language..."
                                className="w-full pl-9 pr-8 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                            />
                            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs">✕</button>}
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {/* Community filter */}
                            <select value={communityFilter} onChange={e => setCommunityFilter(e.target.value)}
                                className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-cyan-300 focus:outline-none focus:border-cyan-500">
                                {communities.map(c => <option key={c} value={c}>{c === 'All' ? 'All Communities' : c}</option>)}
                            </select>

                            {/* Status pills */}
                            {(['All', 'Published', 'In Review', 'Draft'] as const).map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                                        statusFilter === s
                                            ? s === 'Published'  ? 'bg-green-600 border-green-500 text-white'
                                            : s === 'In Review'  ? 'bg-yellow-600 border-yellow-500 text-white'
                                            : s === 'Draft'      ? 'bg-neutral-600 border-neutral-500 text-white'
                                            : 'bg-cyan-700 border-cyan-500 text-white'
                                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-600'
                                    }`}>
                                    {s}
                                </button>
                            ))}

                            {(statusFilter !== 'All' || communityFilter !== 'All' || search) && (
                                <button onClick={() => { setStatusFilter('All'); setCommunityFilter('All'); setSearch(''); }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-bold border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600 transition">
                                    ✕ Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-neutral-950 text-neutral-500 border-b border-neutral-800 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Course Name</th>
                                    <th className="px-6 py-4 font-bold">Community</th>
                                    <th className="px-6 py-4 font-bold">Language</th>
                                    <th className="px-6 py-4 font-bold text-center">Enrolled</th>
                                    <th className="px-6 py-4 font-bold">Completion</th>
                                    <th className="px-6 py-4 font-bold text-center">Certs</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-neutral-500 text-sm">
                                            No courses match your filter.
                                            <button onClick={() => { setSearch(''); setStatusFilter('All'); setCommunityFilter('All'); }}
                                                className="ml-2 text-cyan-400 hover:text-cyan-300 underline">Clear filters</button>
                                        </td>
                                    </tr>
                                ) : filtered.map(course => {
                                    const sc = STATUS_CFG[course.status];
                                    return (
                                        <tr key={course.id} className="hover:bg-neutral-800/30 transition-colors group">
                                            {/* Name */}
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-white text-sm max-w-[200px] truncate">{course.name}</p>
                                                <p className="text-[10px] text-neutral-500 mt-0.5">{course.modules} modules</p>
                                            </td>

                                            {/* Community */}
                                            <td className="px-6 py-4">
                                                <span className="text-cyan-400/80 font-medium text-xs">{course.community}</span>
                                            </td>

                                            {/* Language */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                    {course.languages.slice(0, 3).map(l => (
                                                        <span key={l} className="px-1.5 py-0.5 bg-neutral-800 border border-neutral-700 text-neutral-400 text-[10px] font-medium rounded">{l}</span>
                                                    ))}
                                                    {course.languages.length > 3 && <span className="text-neutral-600 text-[10px]">+{course.languages.length - 3}</span>}
                                                </div>
                                            </td>

                                            {/* Enrolled */}
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-mono text-xs text-neutral-300">
                                                    {course.enrolled > 0 ? course.enrolled.toLocaleString() : <span className="text-neutral-600">—</span>}
                                                </span>
                                            </td>

                                            {/* Completion */}
                                            <td className="px-6 py-4">
                                                {course.completion === null ? (
                                                    <span className="text-neutral-600 text-xs">Not started</span>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                                            <div className={`h-full ${course.completion < 60 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${course.completion}%` }} />
                                                        </div>
                                                        <span className={`text-xs font-mono font-bold ${course.completion < 60 ? 'text-yellow-400' : 'text-green-400'}`}>{course.completion}%</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* Certs */}
                                            <td className="px-6 py-4 text-center">
                                                {course.certs > 0 ? (
                                                    <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold rounded-full">
                                                        {course.certs.toLocaleString()} 🏆
                                                    </span>
                                                ) : <span className="text-neutral-600 text-xs">—</span>}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${sc.cls}`}>{sc.label}</span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 flex-wrap">
                                                    {/* Impact (non-draft) */}
                                                    {course.status !== 'Draft' && (
                                                        <button onClick={() => setImpactModal(course)}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-cyan-400 bg-cyan-950/40 hover:bg-cyan-700/30 border border-cyan-900/50 hover:border-cyan-500/50 rounded-lg transition">
                                                            🌍 Impact
                                                        </button>
                                                    )}

                                                    {/* Donor Report (published) */}
                                                    {course.status === 'Published' && (
                                                        <button onClick={() => { setDonorModal(course); setDonorStep('preview'); }}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-lg transition">
                                                            📄 Donor
                                                        </button>
                                                    )}

                                                    {/* Edit */}
                                                    <Link href={`/content-creator/studio/builder/${course.id}`}
                                                        className="px-2.5 py-1.5 text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-700 border border-transparent hover:border-neutral-600 rounded-lg transition">
                                                        ✎ Edit
                                                    </Link>

                                                    {/* Submit for review (draft) */}
                                                    {course.status === 'Draft' && (
                                                        <button onClick={() => handleSubmitReview(course)}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg transition">
                                                            📤 Submit
                                                        </button>
                                                    )}

                                                    {/* Archive (published) */}
                                                    {course.status === 'Published' && (
                                                        <button onClick={() => handleArchive(course)}
                                                            className="px-2.5 py-1.5 text-[10px] text-neutral-600 hover:text-neutral-400 hover:bg-neutral-800 border border-transparent rounded-lg transition">
                                                            📦
                                                        </button>
                                                    )}

                                                    {/* Delete (draft/archived) */}
                                                    {(course.status === 'Draft' || course.status === 'Archived') && (
                                                        <button onClick={() => setDeleteModal(course)}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition">
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 text-xs text-neutral-600 flex justify-between rounded-b-2xl">
                        <span>Showing {filtered.length} of {courses.length} courses</span>
                        <span>{stats.totalCerts.toLocaleString()} total certificates issued across all communities</span>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════ */}
            {/* MODAL: IMPACT PROFILE                         */}
            {/* ══════════════════════════════════════════════ */}
            {impactModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />

                        {/* Header */}
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center relative z-10">
                            <div>
                                <h3 className="font-bold text-white text-lg">Community Impact Profile</h3>
                                <p className="text-xs text-cyan-400">{impactModal.community} · {impactModal.lang}</p>
                            </div>
                            <button onClick={() => setImpactModal(null)} className="text-neutral-500 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition">×</button>
                        </div>

                        {/* Body */}
                        <div className="p-6 relative z-10 space-y-5">
                            {/* Course name */}
                            <div className="px-4 py-3 bg-cyan-500/5 border border-cyan-500/15 rounded-xl">
                                <p className="text-xs text-cyan-400/70 mb-0.5">Course</p>
                                <p className="font-bold text-white">{impactModal.name}</p>
                            </div>

                            {/* Key metrics */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-center">
                                    <p className="text-xs text-neutral-500 font-bold uppercase mb-2">Total Reach</p>
                                    <p className="text-3xl font-black text-white font-mono">{impactModal.enrolled.toLocaleString()}</p>
                                    <p className="text-xs text-green-400 mt-1">+12% this month</p>
                                </div>
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-center">
                                    <p className="text-xs text-neutral-500 font-bold uppercase mb-2">Certs Issued</p>
                                    <p className="text-3xl font-black text-yellow-400 font-mono">{impactModal.certs.toLocaleString()}</p>
                                    <p className="text-xs text-green-400 mt-1">+8% this month</p>
                                </div>
                                <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 text-center">
                                    <p className="text-xs text-neutral-500 font-bold uppercase mb-2">Completion</p>
                                    <p className={`text-3xl font-black font-mono ${impactModal.completion && impactModal.completion >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {impactModal.completion ? `${impactModal.completion}%` : 'N/A'}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">{impactModal.modules} modules</p>
                                </div>
                            </div>

                            {/* Language tags */}
                            <div>
                                <p className="text-xs font-bold text-neutral-400 mb-2">Available Languages</p>
                                <div className="flex flex-wrap gap-2">
                                    {impactModal.languages.map(l => (
                                        <span key={l} className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full">{l}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Partner orgs */}
                            {impactModal.partnerOrgs.length > 0 && (
                                <div>
                                    <h4 className="font-bold text-white text-sm mb-3">Partner Organizations</h4>
                                    <div className="space-y-2">
                                        {impactModal.partnerOrgs.map((org, i) => (
                                            <div key={i} className="flex justify-between items-center px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-cyan-500" />
                                                    <span className="text-sm font-medium text-neutral-300">{org.name}</span>
                                                </div>
                                                <span className="text-xs font-mono text-cyan-400 font-bold">{org.users.toLocaleString()} users</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-1">
                                <button onClick={() => setImpactModal(null)}
                                    className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-sm font-bold rounded-xl transition">
                                    Close
                                </button>
                                <button onClick={() => { setImpactModal(null); setDonorModal(impactModal); setDonorStep('preview'); }}
                                    className="flex-1 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
                                    📄 Generate Donor Report
                                </button>
                                <Link href="/content-creator/analytics"
                                    className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
                                    📊 Full Analytics
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════ */}
            {/* MODAL: DONOR REPORT                           */}
            {/* ══════════════════════════════════════════════ */}
            {donorModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                            <div>
                                <h3 className="font-bold text-white text-lg">📄 NGO Donor Report</h3>
                                <p className="text-xs text-yellow-400/80">{donorModal.name}</p>
                            </div>
                            <button onClick={() => { setDonorModal(null); setDonorStep('preview'); }}
                                className="text-neutral-500 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition">×</button>
                        </div>

                        <div className="p-6 space-y-5">
                            {donorStep === 'preview' && (
                                <>
                                    {/* Stats preview */}
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                                            <p className="text-xs text-neutral-500">Beneficiaries</p>
                                            <p className="text-xl font-black text-white mt-1">{donorModal.enrolled.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                                            <p className="text-xs text-neutral-500">Certs Issued</p>
                                            <p className="text-xl font-black text-yellow-400 mt-1">{donorModal.certs.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                                            <p className="text-xs text-neutral-500">Partners</p>
                                            <p className="text-xl font-black text-cyan-400 mt-1">{donorModal.partnerOrgs.length}</p>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-xs text-neutral-400">
                                        💡 This report includes reach data, certificate stats, partner organizations, and course details formatted for donor presentation.
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => { setDonorModal(null); setDonorStep('preview'); }}
                                            className="flex-1 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm font-bold rounded-xl transition">Cancel</button>
                                        <button onClick={handleGenerateDonorReport}
                                            className="flex-1 py-2.5 bg-yellow-600 hover:bg-yellow-500 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
                                            📄 Generate Impact PDF
                                        </button>
                                    </div>
                                </>
                            )}

                            {donorStep === 'generating' && (
                                <div className="py-8 flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                                    <p className="text-white font-bold">Compiling Impact Data…</p>
                                    <p className="text-xs text-neutral-500 text-center">Gathering enrolled learners, certs, partner org data…</p>
                                </div>
                            )}

                            {donorStep === 'ready' && (
                                <>
                                    <div className="py-6 flex flex-col items-center gap-3 text-center">
                                        <div className="w-14 h-14 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-2xl">✅</div>
                                        <p className="text-white font-bold text-lg">Report Ready!</p>
                                        <p className="text-xs text-neutral-400">Your donor impact report for <strong className="text-white">{donorModal.name}</strong> is ready to download.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => { setDonorModal(null); setDonorStep('preview'); }}
                                            className="flex-1 py-2.5 bg-neutral-800 border border-neutral-700 text-white text-sm font-bold rounded-xl transition">Close</button>
                                        <button onClick={handleDownloadDonorReport}
                                            className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
                                            📥 Download Report
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════ */}
            {/* MODAL: DELETE CONFIRM                         */}
            {/* ══════════════════════════════════════════════ */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                        <div className="p-6 text-center space-y-4">
                            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-2xl mx-auto">🗑️</div>
                            <div>
                                <h3 className="font-bold text-white text-lg">Delete Course?</h3>
                                <p className="text-sm text-neutral-400 mt-1">
                                    <strong className="text-white">{deleteModal.name}</strong> will be permanently deleted.
                                </p>
                            </div>
                            <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-400">
                                ⚠️ All community content and learner data will be lost permanently.
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-sm font-bold rounded-xl transition">Cancel</button>
                                <button onClick={handleDelete} disabled={deleteProcessing}
                                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
                                    {deleteProcessing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🗑️ Delete Forever'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </RoleLayout>
    );
}

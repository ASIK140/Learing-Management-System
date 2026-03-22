'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import RoleLayout from '@/components/layout/RoleLayout';
import { contentNavSections } from '../page';
import { apiFetch } from '@/utils/api';

/* ─── Types ─────────────────────────────────── */
type CourseStatus = 'Published' | 'In Review' | 'Draft' | 'Archived';
type Course = {
    id: number;
    name: string;
    role: string;
    compliance: string[];
    completion: number | null;   // 0-100 or null
    enrolled: number;
    modules: number;
    status: CourseStatus;
};

/* ─── Seed data ─────────────────────────────── */
const SEED_COURSES: Course[] = [
    { id: 1, name: 'Information Security Basics',   role: 'All Employees', compliance: ['ISO 27001', 'SOC 2'], completion: 94, enrolled: 1240, modules: 6, status: 'Published' },
    { id: 2, name: 'Clean Desk Policy Basics',      role: 'All Employees', compliance: ['SOC 2'],              completion: 88, enrolled: 987, modules: 3,  status: 'Published' },
    { id: 3, name: 'Invoice Fraud Defense',         role: 'Finance / AP',  compliance: ['PCI DSS'],            completion: 92, enrolled: 245, modules: 5,  status: 'Published' },
    { id: 4, name: 'Phishing Awareness Adv',        role: 'Executives',    compliance: ['ISO 27001'],          completion: 64, enrolled: 132, modules: 4,  status: 'In Review' },
    { id: 5, name: 'Deepfake & Voice Scams',        role: 'All Employees', compliance: [],                     completion: null, enrolled: 0, modules: 2,  status: 'Draft' },
    { id: 6, name: 'Cloud Data Storage Compliance', role: 'Engineering',   compliance: ['ISO 27001', 'SOC 2'], completion: 78, enrolled: 310, modules: 7,  status: 'Published' },
    { id: 7, name: 'Supply Chain Risk Awareness',   role: 'Procurement',   compliance: ['ISO 27001'],          completion: 55, enrolled: 89,  modules: 4,  status: 'In Review' },
    { id: 8, name: 'Endpoint Security Fundamentals',role: 'IT & Engineering',compliance: ['SOC 2','PCI DSS'], completion: null, enrolled: 0, modules: 3,  status: 'Draft' },
];

const STATUS_CONFIG: Record<CourseStatus, { label: string; cls: string }> = {
    Published: { label: 'PUBLISHED',  cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
    'In Review':{ label: 'IN REVIEW', cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    Draft:     { label: 'DRAFT',      cls: 'bg-neutral-800 text-neutral-400 border-neutral-700' },
    Archived:  { label: 'ARCHIVED',   cls: 'bg-neutral-900 text-neutral-600 border-neutral-800' },
};

const COMPLIANCE_COLORS: Record<string, string> = {
    'ISO 27001': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'SOC 2':     'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'PCI DSS':   'bg-orange-500/10 text-orange-400 border-orange-500/20',
    'HIPAA':     'bg-red-500/10 text-red-400 border-red-500/20',
    'GDPR':      'bg-teal-500/10 text-teal-400 border-teal-500/20',
};

export default function CorporateCourses() {
    const [courses, setCourses] = useState<Course[]>(SEED_COURSES);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState<'All' | CourseStatus>('All');
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

    /* Modal state */
    const [reportModal, setReportModal] = useState<Course | null>(null);
    const [deleteModal, setDeleteModal] = useState<Course | null>(null);
    const [reportType, setReportType] = useState<'pdf' | 'csv'>('pdf');
    const [reportProcessing, setReportProcessing] = useState(false);
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [exporting, setExporting] = useState(false);

    const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    /* ── Computed stats ── */
    const stats = useMemo(() => ({
        total: courses.length,
        published: courses.filter(c => c.status === 'Published').length,
        inReview: courses.filter(c => c.status === 'In Review').length,
        draft: courses.filter(c => c.status === 'Draft').length,
        totalEnrolled: courses.reduce((s, c) => s + c.enrolled, 0),
        avgCompletion: Math.round(
            courses.filter(c => c.completion !== null).reduce((s, c) => s + (c.completion ?? 0), 0) /
            Math.max(1, courses.filter(c => c.completion !== null).length)
        ),
    }), [courses]);

    /* ── Unique roles ── */
    const roles = ['All', ...Array.from(new Set(courses.map(c => c.role)))];

    /* ── Filtered list ── */
    const filtered = useMemo(() => courses.filter(c => {
        const matchSearch = !search
            || c.name.toLowerCase().includes(search.toLowerCase())
            || c.role.toLowerCase().includes(search.toLowerCase())
            || c.compliance.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchRole = roleFilter === 'All' || c.role === roleFilter;
        const matchStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchSearch && matchRole && matchStatus;
    }), [courses, search, roleFilter, statusFilter]);

    /* ── Submit for Review ── */
    const handleSubmitReview = (course: Course) => {
        setCourses(prev => prev.map(c => c.id === course.id ? { ...c, status: 'In Review' } : c));
        showToast(`📤 "${course.name}" submitted for review!`);
    };

    /* ── Archive ── */
    const handleArchive = (course: Course) => {
        setCourses(prev => prev.map(c => c.id === course.id ? { ...c, status: 'Archived' } : c));
        showToast(`📦 "${course.name}" archived.`, 'info');
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

    /* ── Generate Report ── */
    const handleGenerateReport = () => {
        if (!reportModal) return;
        setReportProcessing(true);
        setTimeout(() => {
            if (reportType === 'csv') {
                const rows = [
                    ['Course', 'Role', 'Compliance', 'Enrolled', 'Completion %', 'Status'],
                    [reportModal.name, reportModal.role, reportModal.compliance.join('; '),
                     reportModal.enrolled, reportModal.completion ?? 'N/A', reportModal.status],
                ];
                const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `${reportModal.name.replace(/ /g, '-')}-report.csv`; a.click();
            } else {
                // PDF: download a text report as .txt (simulated PDF content)
                const content = `COMPLIANCE AUDIT REPORT\nCourse: ${reportModal.name}\nRole: ${reportModal.role}\nFrameworks: ${reportModal.compliance.join(', ') || 'None'}\nEnrolled: ${reportModal.enrolled}\nCompletion: ${reportModal.completion ?? 'N/A'}%\nStatus: ${reportModal.status}\nGenerated: ${new Date().toLocaleString()}`;
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `${reportModal.name.replace(/ /g, '-')}-audit.txt`; a.click();
            }
            setReportProcessing(false);
            setReportModal(null);
            showToast(`✅ Report for "${reportModal.name}" downloaded!`);
        }, 1200);
    };

    /* ── Export all ── */
    const handleExportAll = () => {
        setExporting(true);
        const rows = [
            ['Course', 'Role', 'Compliance', 'Enrolled', 'Completion %', 'Modules', 'Status'],
            ...courses.map(c => [c.name, c.role, c.compliance.join('; '), c.enrolled, c.completion ?? 'N/A', c.modules, c.status])
        ];
        const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'corporate-courses.csv'; a.click();
        setTimeout(() => { setExporting(false); showToast('✅ All courses exported to CSV!'); }, 700);
    };

    const toastColors: Record<string, string> = {
        success: 'bg-green-600', error: 'bg-red-600', info: 'bg-indigo-600',
    };

    return (
        <RoleLayout
            title="Corporate Courses"
            subtitle="Manage and monitor internal employee training programs."
            accentColor="indigo" avatarText="CC"
            avatarGradient="bg-gradient-to-tr from-indigo-500 to-cyan-500"
            userName="Sarah Jenkins" userEmail="sarah.j@cybershield.com"
            navSections={contentNavSections}
            currentRole="content-creator"
        >
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">

                {/* TOAST */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl font-bold text-sm text-white max-w-sm ${toastColors[toast.type]}`}>
                        {toast.msg}
                    </div>
                )}

                {/* ── Header Card ─────────────────────────────── */}
                <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-xl">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-2xl">🏢</div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Corporate Library</h2>
                            <p className="text-sm text-neutral-400">Targeted modules for departments and compliance mandates.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleExportAll} disabled={exporting}
                            className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition flex items-center gap-2">
                            {exporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '📥'}
                            {exporting ? 'Exporting…' : 'Export All'}
                        </button>
                        <Link href="/content-creator/new-course"
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all">
                            + New Corporate Course
                        </Link>
                    </div>
                </div>

                {/* ── Stats Row ─────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                        { label: 'Total Courses',  value: stats.total,         color: 'text-white',     bg: 'bg-neutral-900 border-neutral-800' },
                        { label: 'Published',      value: stats.published,      color: 'text-green-400', bg: 'bg-green-500/5 border-green-500/20' },
                        { label: 'In Review',      value: stats.inReview,       color: 'text-yellow-400',bg: 'bg-yellow-500/5 border-yellow-500/20' },
                        { label: 'Draft',          value: stats.draft,          color: 'text-neutral-400',bg: 'bg-neutral-900 border-neutral-800' },
                        { label: 'Total Enrolled', value: stats.totalEnrolled.toLocaleString(), color: 'text-indigo-400', bg: 'bg-indigo-500/5 border-indigo-500/20' },
                    ].map(s => (
                        <div key={s.label} className={`border rounded-xl p-3 cursor-pointer hover:opacity-90 transition ${s.bg}`}
                            onClick={() => {
                                if (s.label === 'Published') setStatusFilter('Published');
                                else if (s.label === 'In Review') setStatusFilter('In Review');
                                else if (s.label === 'Draft') setStatusFilter('Draft');
                                else setStatusFilter('All');
                            }}>
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
                                placeholder="Search courses, roles, compliance..."
                                className="w-full pl-9 pr-8 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                            />
                            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs">✕</button>}
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {/* Role filter */}
                            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                                className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                                {roles.map(r => <option key={r} value={r}>{r === 'All' ? 'All Roles' : r}</option>)}
                            </select>

                            {/* Status pills */}
                            {(['All', 'Published', 'In Review', 'Draft'] as const).map(s => (
                                <button key={s} onClick={() => setStatusFilter(s)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                                        statusFilter === s
                                            ? s === 'Published' ? 'bg-green-600 border-green-500 text-white'
                                            : s === 'In Review' ? 'bg-yellow-600 border-yellow-500 text-white'
                                            : s === 'Draft'     ? 'bg-neutral-600 border-neutral-500 text-white'
                                            : 'bg-indigo-600 border-indigo-500 text-white'
                                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-600'
                                    }`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-neutral-950 text-neutral-500 border-b border-neutral-800 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Course Name</th>
                                    <th className="px-6 py-4 font-bold">Target Role</th>
                                    <th className="px-6 py-4 font-bold">Compliance</th>
                                    <th className="px-6 py-4 font-bold">Enrolled</th>
                                    <th className="px-6 py-4 font-bold">Completion</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/50">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-neutral-500 text-sm">
                                            No courses match your filter.
                                            <button onClick={() => { setSearch(''); setRoleFilter('All'); setStatusFilter('All'); }}
                                                className="ml-2 text-indigo-400 hover:text-indigo-300 underline">Clear</button>
                                        </td>
                                    </tr>
                                ) : filtered.map(course => {
                                    const sc = STATUS_CONFIG[course.status];
                                    return (
                                        <tr key={course.id} className="hover:bg-neutral-800/30 transition-colors group">
                                            {/* Name + modules */}
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-white text-sm max-w-[200px] truncate">{course.name}</p>
                                                <p className="text-[10px] text-neutral-500 mt-0.5">{course.modules} modules</p>
                                            </td>

                                            {/* Role */}
                                            <td className="px-6 py-4 text-neutral-400 text-xs font-medium">{course.role}</td>

                                            {/* Compliance badges */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5 max-w-[140px]">
                                                    {course.compliance.length > 0 ? course.compliance.map(tag => (
                                                        <span key={tag} className={`px-2 py-0.5 text-[10px] font-bold rounded border ${COMPLIANCE_COLORS[tag] || 'bg-neutral-950 text-neutral-400 border-neutral-700'}`}>
                                                            {tag}
                                                        </span>
                                                    )) : <span className="text-neutral-600 italic text-xs">None</span>}
                                                </div>
                                            </td>

                                            {/* Enrolled */}
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono text-neutral-300">
                                                    {course.enrolled > 0 ? course.enrolled.toLocaleString() : <span className="text-neutral-600">—</span>}
                                                </span>
                                            </td>

                                            {/* Completion bar */}
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

                                            {/* Status badge */}
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded border ${sc.cls}`}>{sc.label}</span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 flex-wrap">
                                                    {/* Edit */}
                                                    <Link href={`/content-creator/studio/builder/${course.id}`}
                                                        className="px-2.5 py-1.5 text-xs font-bold text-indigo-400 hover:text-white hover:bg-indigo-600 rounded-lg border border-transparent hover:border-indigo-500 transition">
                                                        ✎ Edit
                                                    </Link>

                                                    {/* Reports (only for non-draft) */}
                                                    {course.status !== 'Draft' && (
                                                        <button onClick={() => { setReportModal(course); setReportType('pdf'); }}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg border border-transparent hover:border-neutral-600 transition">
                                                            📊 Reports
                                                        </button>
                                                    )}

                                                    {/* Submit for review (draft only) */}
                                                    {course.status === 'Draft' && (
                                                        <button onClick={() => handleSubmitReview(course)}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg border border-yellow-500/20 transition">
                                                            📤 Submit
                                                        </button>
                                                    )}

                                                    {/* Archive (published only) */}
                                                    {course.status === 'Published' && (
                                                        <button onClick={() => handleArchive(course)}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800 rounded-lg border border-transparent hover:border-neutral-700 transition">
                                                            📦
                                                        </button>
                                                    )}

                                                    {/* Delete (draft / archived) */}
                                                    {(course.status === 'Draft' || course.status === 'Archived') && (
                                                        <button onClick={() => setDeleteModal(course)}
                                                            className="px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition">
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
                        <span>Avg completion: <span className="text-indigo-400 font-bold">{stats.avgCompletion}%</span></span>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════ */}
            {/* MODAL: REPORTS                                */}
            {/* ══════════════════════════════════════════════ */}
            {reportModal && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                            <div>
                                <h3 className="font-bold text-white text-lg">Generate Course Report</h3>
                                <p className="text-xs text-neutral-400 truncate max-w-xs">{reportModal.name}</p>
                            </div>
                            <button onClick={() => setReportModal(null)} className="text-neutral-500 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 transition">×</button>
                        </div>
                        <div className="p-6 space-y-5">
                            {/* Course stats */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                                    <p className="text-xs text-neutral-500 mb-1">Enrolled</p>
                                    <p className="text-lg font-black text-white">{reportModal.enrolled.toLocaleString()}</p>
                                </div>
                                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                                    <p className="text-xs text-neutral-500 mb-1">Completion</p>
                                    <p className={`text-lg font-black ${reportModal.completion && reportModal.completion >= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {reportModal.completion ? `${reportModal.completion}%` : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-center">
                                    <p className="text-xs text-neutral-500 mb-1">Modules</p>
                                    <p className="text-lg font-black text-white">{reportModal.modules}</p>
                                </div>
                            </div>

                            {/* Report type */}
                            <div>
                                <p className="text-sm font-bold text-neutral-300 mb-3">Report Type</p>
                                <div className="space-y-2">
                                    <label className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${reportType === 'pdf' ? 'border-indigo-500 bg-indigo-500/10' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'}`}>
                                        <input type="radio" name="rtype" checked={reportType === 'pdf'} onChange={() => setReportType('pdf')} className="text-indigo-600" />
                                        <div>
                                            <p className="text-sm font-bold text-white">📄 Compliance Audit Report</p>
                                            <p className="text-xs text-neutral-500">Summary mapped to {reportModal.compliance.join(', ') || 'no frameworks'}</p>
                                        </div>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${reportType === 'csv' ? 'border-indigo-500 bg-indigo-500/10' : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'}`}>
                                        <input type="radio" name="rtype" checked={reportType === 'csv'} onChange={() => setReportType('csv')} className="text-indigo-600" />
                                        <div>
                                            <p className="text-sm font-bold text-white">📊 Full Learner Transcript (CSV)</p>
                                            <p className="text-xs text-neutral-500">All enrolled users, scores, and completion timestamps</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setReportModal(null)} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-sm font-bold rounded-xl transition">Cancel</button>
                                <button onClick={handleGenerateReport} disabled={reportProcessing}
                                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2">
                                    {reportProcessing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</> : '📥 Generate & Download'}
                                </button>
                            </div>
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
                                    <strong className="text-white">{deleteModal.name}</strong> will be permanently deleted. This cannot be undone.
                                </p>
                            </div>
                            <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-400">
                                ⚠️ All content, modules, and learner data for this course will be lost.
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-sm font-bold rounded-xl transition">
                                    Cancel
                                </button>
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

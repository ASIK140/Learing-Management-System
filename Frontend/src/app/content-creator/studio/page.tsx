'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import RoleLayout, { NavSection } from '@/components/layout/RoleLayout';
import { apiFetch } from '@/utils/api';

const contentNavSections: NavSection[] = [
    {
        title: 'CONTENT',
        items: [
            { label: 'Dashboard',     href: '/content-creator',           icon: '🏠' },
            { label: 'All Courses',   href: '/content-creator/studio',    icon: '📚' },
            { label: 'New Course',    href: '/content-creator/new-course', icon: '✨' },
            { label: 'Question Bank', href: '/content-creator/questions', icon: '📝' },
        ],
    },
    {
        title: 'MANAGE',
        items: [
            { label: 'Review Queue',   href: '/content-creator/review',    icon: '⏳' },
            { label: 'Analytics',      href: '/content-creator/analytics',  icon: '📊' },
            { label: 'Compliance Map', href: '/content-creator/compliance', icon: '🛡️' },
        ],
    },
    {
        title: 'AUDIENCE',
        items: [
            { label: 'Corporate Courses', href: '/content-creator/corporate', icon: '🏢' },
            { label: 'NGO / Community',   href: '/content-creator/ngo',       icon: '🌍' },
        ],
    },
];

const RLPROPS = {
    title: 'Content Studio', subtitle: 'All Courses — Create, build, and publish learning content',
    accentColor: 'indigo', avatarText: 'CC', avatarGradient: 'bg-gradient-to-tr from-indigo-500 to-cyan-500',
    userName: 'Sarah Jenkins', userEmail: 'sarah.j@cybershield.com', currentRole: 'content-creator',
};

const STATUS_COLORS: Record<string, string> = {
    published: 'bg-green-500/10 text-green-400 border-green-500/30',
    in_review: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    draft:     'bg-neutral-800 text-neutral-500 border-neutral-700',
};

const AUDIENCE_ICONS: Record<string, string> = { Corporate: '🏢', NGO: '🌍' };
const COMPLIANCE_COLORS: Record<string, string> = {
    'ISO 27001': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    'SOC2':     'bg-purple-500/10 text-purple-300 border-purple-500/20',
    'PCI DSS':  'bg-orange-500/10 text-orange-300 border-orange-500/20',
    'GDPR':     'bg-teal-500/10 text-teal-300 border-teal-500/20',
    'NIST':     'bg-red-500/10 text-red-300 border-red-500/20',
    'ISO 27701': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
};

export default function StudioAllCourses() {
    const [courses, setCourses] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [audienceFilter, setAudienceFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [newForm, setNewForm] = useState({
        title: '', description: '', audience: 'Corporate', category: '',
        compliance_tags: [] as string[], pass_mark: 70, certificate_enabled: true, certificate_name: ''
    });

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const loadCourses = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (audienceFilter !== 'All') params.set('audience', audienceFilter);
            if (statusFilter !== 'All') params.set('status', statusFilter);
            const r = await apiFetch(`/content/studio/list?${params}`).then(r => r.json());
            if (r.success) { setCourses(r.data); setStats(r.stats); }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [audienceFilter, statusFilter]);

    useEffect(() => { loadCourses(); }, [loadCourses]);

    const filteredCourses = courses.filter(c =>
        !search || c.title?.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase())
    );

    const toggleComplianceTag = (tag: string) => {
        setNewForm(f => ({
            ...f,
            compliance_tags: f.compliance_tags.includes(tag) ? f.compliance_tags.filter(t => t !== tag) : [...f.compliance_tags, tag]
        }));
    };

    const handleCreate = async () => {
        if (!newForm.title.trim()) { showToast('Course title is required', 'error'); return; }
        setCreating(true);
        try {
            const r = await apiFetch('/content/studio/create', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newForm)
            });
            const d = await r.json();
            if (!d.success) throw new Error(d.message);
            showToast('✅ Course created! Redirecting to builder...');
            setShowNewModal(false);
            setTimeout(() => { window.location.href = `/content-creator/studio/builder/${d.data.id}`; }, 1000);
        } catch (e: any) { showToast(e.message, 'error'); }
        finally { setCreating(false); }
    };

    const handleDelete = async (course: any) => {
        if (!confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
        setDeleting(course.id);
        try {
            const r = await apiFetch(`/content/studio/delete/${course.id}`, { method: 'DELETE' });
            const d = await r.json();
            if (!d.success) throw new Error(d.message);
            showToast('Course deleted');
            await loadCourses();
        } catch (e: any) { showToast(e.message, 'error'); }
        finally { setDeleting(null); }
    };

    if (loading) return (
        <RoleLayout {...RLPROPS} navSections={contentNavSections}>
            <div className="flex items-center justify-center h-[60vh] text-neutral-500">
                <div className="text-center"><div className="text-5xl mb-4 animate-pulse">📚</div><p>Loading courses...</p></div>
            </div>
        </RoleLayout>
    );

    return (
        <RoleLayout {...RLPROPS} navSections={contentNavSections}>
            <div className="max-w-7xl mx-auto w-full">

                {/* TOAST */}
                {toast && (
                    <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl font-bold text-sm max-w-md ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                        {toast.msg}
                    </div>
                )}

                {/* NEW COURSE MODAL */}
                {showNewModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                        <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex justify-between items-center z-10">
                                <div>
                                    <h2 className="text-lg font-black text-white">✨ New Course</h2>
                                    <p className="text-xs text-neutral-500 mt-0.5">Fill in details then build modules and lessons</p>
                                </div>
                                <button onClick={() => setShowNewModal(false)} className="text-2xl text-neutral-500 hover:text-white">×</button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Course Title <span className="text-red-400">*</span></label>
                                    <input value={newForm.title} onChange={e => setNewForm({ ...newForm, title: e.target.value })} placeholder="e.g. Security Awareness Fundamentals" className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Description</label>
                                    <textarea value={newForm.description} onChange={e => setNewForm({ ...newForm, description: e.target.value })} placeholder="Brief description of the course..." rows={3} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none resize-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Audience</label>
                                        <select value={newForm.audience} onChange={e => setNewForm({ ...newForm, audience: e.target.value })} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none">
                                            <option>Corporate</option>
                                            <option>NGO</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Category</label>
                                        <input value={newForm.category} onChange={e => setNewForm({ ...newForm, category: e.target.value })} placeholder="e.g. Phishing, Compliance" className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Compliance Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['ISO 27001', 'SOC2', 'PCI DSS', 'GDPR', 'NIST', 'ISO 27701'].map(tag => (
                                            <button key={tag} onClick={() => toggleComplianceTag(tag)} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${newForm.compliance_tags.includes(tag) ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-700'}`}>
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Pass Mark (%)</label>
                                        <input type="number" value={newForm.pass_mark} onChange={e => setNewForm({ ...newForm, pass_mark: Number(e.target.value) })} min={0} max={100} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Certificate Name</label>
                                        <input value={newForm.certificate_name} onChange={e => setNewForm({ ...newForm, certificate_name: e.target.value })} placeholder="Certificate of Completion" className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3">
                                    <span className="text-sm text-neutral-300">Issue Certificate on Completion</span>
                                    <button onClick={() => setNewForm({ ...newForm, certificate_enabled: !newForm.certificate_enabled })} className={`ml-auto w-12 h-6 rounded-full border transition relative ${newForm.certificate_enabled ? 'bg-green-500/20 border-green-500' : 'bg-neutral-800 border-neutral-700'}`}>
                                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${newForm.certificate_enabled ? 'left-6' : 'left-0.5'}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="sticky bottom-0 bg-neutral-950 px-6 py-4 border-t border-neutral-800 flex justify-end gap-3">
                                <button onClick={() => setShowNewModal(false)} className="px-5 py-2.5 bg-neutral-800 text-neutral-300 text-sm font-bold rounded-xl border border-neutral-700 hover:bg-neutral-700">Cancel</button>
                                <button onClick={handleCreate} disabled={creating} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                                    {creating ? '⏳ Creating...' : '🚀 Create & Build'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* HEADER */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-black text-white">All Courses</h1>
                        <p className="text-neutral-500 text-sm mt-1">Create, build, and publish learning content for your organization</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm font-bold rounded-xl hover:bg-neutral-700 transition">📥 Import</button>
                        <button className="px-4 py-2.5 bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm font-bold rounded-xl hover:bg-neutral-700 transition">📋 From Template</button>
                        <button onClick={() => setShowNewModal(true)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.35)] transition">✨ New Course</button>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Courses', val: stats.total || 0, color: 'text-white', icon: '📚' },
                        { label: 'Published', val: stats.published || 0, color: 'text-green-400', icon: '✅' },
                        { label: 'In Review', val: stats.in_review || 0, color: 'text-yellow-400', icon: '⏳' },
                        { label: 'Draft', val: stats.draft || 0, color: 'text-neutral-400', icon: '📄' },
                    ].map(s => (
                        <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center gap-4">
                            <span className="text-2xl">{s.icon}</span>
                            <div>
                                <div className={`text-2xl font-black ${s.color}`}>{s.val}</div>
                                <div className="text-xs text-neutral-500">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FILTERS */}
                <div className="flex flex-wrap gap-3 mb-6 items-center">
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search courses..." className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none w-64" />
                    <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                        {['All', 'Corporate', 'NGO'].map(f => (
                            <button key={f} onClick={() => setAudienceFilter(f)} className={`px-4 py-1.5 text-sm font-bold rounded-lg transition ${audienceFilter === f ? 'bg-indigo-600 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>{f}</button>
                        ))}
                    </div>
                    <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                        {[{ k: 'All', l: 'All Status' }, { k: 'draft', l: '📄 Draft' }, { k: 'in_review', l: '⏳ In Review' }, { k: 'published', l: '✅ Published' }].map(f => (
                            <button key={f.k} onClick={() => setStatusFilter(f.k)} className={`px-4 py-1.5 text-sm font-bold rounded-lg transition ${statusFilter === f.k ? 'bg-neutral-700 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>{f.l}</button>
                        ))}
                    </div>
                </div>

                {/* COURSE CARDS */}
                <div className="grid grid-cols-3 gap-5">
                    {filteredCourses.map(course => {
                        const moduleCount  = course.modules?.length || 0;
                        const lessonCount  = course.modules?.reduce((s: number, m: any) => s + (m.lessons?.length || 0), 0) || 0;
                        return (
                            <div key={course.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-indigo-500/40 transition-all">
                                {/* Card header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl">
                                            {AUDIENCE_ICONS[course.audience] || '📚'}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-white text-sm leading-tight">{course.title}</h3>
                                            <p className="text-[10px] text-neutral-500 mt-0.5">{course.audience} · {course.category || 'General'}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${STATUS_COLORS[course.status] || STATUS_COLORS.draft}`}>
                                        {course.status === 'in_review' ? 'In Review' : course.status}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-neutral-500 line-clamp-2">{course.description || 'No description'}</p>

                                {/* Compliance tags */}
                                {(course.compliance_tags || []).length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {(course.compliance_tags || []).map((tag: string) => (
                                            <span key={tag} className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${COMPLIANCE_COLORS[tag] || 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>{tag}</span>
                                        ))}
                                    </div>
                                )}

                                {/* Metrics */}
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-center">
                                        <div className="text-base font-black text-white">{moduleCount}</div>
                                        <div className="text-[9px] text-neutral-500 uppercase">Modules</div>
                                    </div>
                                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-center">
                                        <div className="text-base font-black text-white">{lessonCount}</div>
                                        <div className="text-[9px] text-neutral-500 uppercase">Lessons</div>
                                    </div>
                                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-center">
                                        <div className="text-base font-black text-white">{course.pass_mark || 70}%</div>
                                        <div className="text-[9px] text-neutral-500 uppercase">Pass</div>
                                    </div>
                                </div>

                                {/* Last updated */}
                                <p className="text-[10px] text-neutral-600">Updated {course.updated_at ? new Date(course.updated_at).toLocaleDateString() : 'Recently'}</p>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2 border-t border-neutral-800 mt-auto">
                                    <Link href={`/content-creator/studio/builder/${course.id}`} className="flex-1 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-xs font-bold rounded-lg text-center transition">
                                        ✏️ Edit & Build
                                    </Link>
                                    <Link href={`/content-creator/studio/builder/${course.id}?tab=review`} className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-lg transition border border-neutral-700">
                                        👁️ Preview
                                    </Link>
                                    <button onClick={() => handleDelete(course)} disabled={deleting === course.id} className="px-3 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-xs font-bold rounded-lg transition border border-red-800/30">
                                        {deleting === course.id ? '⏳' : '🗑️'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {filteredCourses.length === 0 && (
                        <div className="col-span-3 text-center py-16 text-neutral-600">
                            <div className="text-5xl mb-4">📚</div>
                            <p>No courses found. Create your first course!</p>
                        </div>
                    )}
                </div>
            </div>
        </RoleLayout>
    );
}

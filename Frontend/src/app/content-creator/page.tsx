'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import RoleLayout, { NavSection } from '@/components/layout/RoleLayout';
import { apiFetch } from '@/utils/api';

export const contentNavSections: NavSection[] = [
    {
        title: 'CONTENT',
        items: [
            { label: 'Dashboard',     href: '/content-creator',          icon: '🏠' },
            { label: 'All Courses',   href: '/content-creator/studio',    icon: '📚' },
            { label: 'New Course',    href: '/content-creator/new-course', icon: '✨' },
            { label: 'Question Bank', href: '/content-creator/questions', icon: '📝' },
        ],
    },
    {
        title: 'MANAGE',
        items: [
            { label: 'Review Queue',   href: '/content-creator/review',     icon: '⏳' },
            { label: 'Analytics',      href: '/content-creator/analytics',   icon: '📊' },
            { label: 'Compliance Map', href: '/content-creator/compliance',  icon: '🛡️' },
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
    title: 'Content Studio', subtitle: 'Create, build, and publish security awareness content',
    accentColor: 'indigo', avatarText: 'CC', avatarGradient: 'bg-gradient-to-tr from-indigo-500 to-cyan-500',
    userName: 'Sarah Jenkins', userEmail: 'sarah.j@cybershield.com', currentRole: 'content-creator',
};

const STATUS_COLORS: Record<string, string> = {
    published: 'bg-green-500/10 text-green-400 border-green-500/30',
    in_review: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    draft:     'bg-neutral-800 text-neutral-500 border-neutral-700',
};

const COMPLIANCE_COLORS: Record<string, string> = {
    'ISO 27001': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    'SOC2':     'bg-purple-500/10 text-purple-300 border-purple-500/20',
    'PCI DSS':  'bg-orange-500/10 text-orange-300 border-orange-500/20',
    'GDPR':     'bg-teal-500/10 text-teal-300 border-teal-500/20',
    'NIST':     'bg-red-500/10 text-red-300 border-red-500/20',
};

const WORKFLOW_STAGES = [
    { key: 'draft',      label: 'Draft',      icon: '📄', color: 'text-neutral-400' },
    { key: 'in_review',  label: 'In Review',  icon: '⏳', color: 'text-yellow-400' },
    { key: 'published',  label: 'Published',  icon: '✅', color: 'text-green-400' },
];

export default function ContentCreatorDashboard() {
    const [courses, setCourses] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [audienceFilter, setAudienceFilter] = useState('All');
    const [showImport, setShowImport] = useState(false);
    const [showTemplate, setShowTemplate] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

    const loadCourses = useCallback(async () => {
        try {
            const params = audienceFilter !== 'All' ? `?audience=${audienceFilter}` : '';
            const r = await apiFetch(`/content/studio/list${params}`).then(r => r.json());
            if (r.success) { setCourses(r.data); setStats(r.stats); }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, [audienceFilter]);

    useEffect(() => { loadCourses(); }, [loadCourses]);

    const filteredCourses = audienceFilter === 'All' ? courses : courses.filter(c => c.audience === audienceFilter);

    return (
        <RoleLayout {...RLPROPS} navSections={contentNavSections}>
            <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">

                {/* TOAST */}
                {toast && (
                    <div className="fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl font-bold text-sm bg-green-600 text-white max-w-sm">{toast}</div>
                )}

                {/* IMPORT MODAL */}
                {showImport && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                                <h3 className="font-bold text-white text-lg">📥 Import Course Package</h3>
                                <button onClick={() => setShowImport(false)} className="text-neutral-500 hover:text-white text-xl">×</button>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-neutral-400 mb-6">Upload a SCORM package or CyberShield native export (.csxp) to import content directly into the studio.</p>
                                <div className="w-full h-40 border-2 border-dashed border-neutral-700 hover:border-indigo-500 rounded-xl bg-neutral-950 flex flex-col items-center justify-center text-neutral-400 cursor-pointer transition-colors group mb-4">
                                    <span className="text-3xl mb-2 group-hover:scale-110 group-hover:text-indigo-400 transition-all">📤</span>
                                    <span className="text-sm font-medium group-hover:text-white transition-colors">Drag & drop course archive here</span>
                                    <span className="text-xs text-neutral-500 mt-1">Supports SCORM 1.2, SCORM 2004, and .csxp</span>
                                </div>
                                <button onClick={() => { setShowImport(false); showToast('✅ Course imported as draft'); }} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition">
                                    Select & Import File
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* FROM TEMPLATE MODAL */}
                {showTemplate && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                            <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-950">
                                <div>
                                    <h3 className="font-bold text-white text-lg">📋 Create from Template</h3>
                                    <p className="text-xs text-neutral-400">Choose a pre-built curriculum to jumpstart your course</p>
                                </div>
                                <button onClick={() => setShowTemplate(false)} className="text-neutral-500 hover:text-white text-2xl">×</button>
                            </div>
                            <div className="p-6 flex-1 overflow-y-auto grid grid-cols-2 gap-4">
                                {[
                                    { name: 'Data Privacy Essentials', desc: 'GDPR and SOC2 aligned privacy foundation.', icon: '🛡️', tags: ['GDPR', 'SOC2'] },
                                    { name: 'Physical Security Basics', desc: 'Office environment physical security.', icon: '🏢', tags: ['ISO 27001'] },
                                    { name: 'Remote Work Security', desc: 'VPNs, public Wi-Fi, and home network safety.', icon: '🏠', tags: ['ISO 27001'] },
                                    { name: 'Executive Whaling Defense', desc: 'Advanced social engineering for leadership.', icon: '🎣', tags: ['SOC2'] },
                                    { name: 'Clean Desk Policy', desc: 'Short micro-learning on secure workspaces.', icon: '🧹', tags: [] },
                                    { name: 'Incident Response Basics', desc: 'How to identify and escalate security incidents.', icon: '🚨', tags: ['ISO 27001', 'NIST'] },
                                ].map((tpl, i) => (
                                    <Link key={i} href="/content-creator/studio" onClick={() => { setShowTemplate(false); showToast(`✅ Template "${tpl.name}" applied — edit in Studio`); }}>
                                        <div className="bg-neutral-900 border border-neutral-800 hover:border-indigo-500 p-4 rounded-xl cursor-pointer group transition-all h-full">
                                            <div className="flex gap-3 items-start mb-2">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex flex-shrink-0 items-center justify-center text-xl">{tpl.icon}</div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">{tpl.name}</h4>
                                                    <p className="text-xs text-neutral-400 mt-1">{tpl.desc}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {tpl.tags.map(t => <span key={t} className="text-[9px] font-bold px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded">{t}</span>)}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── HEADER ACTIONS ─────────────────────────────────────── */}
                <div className="flex justify-between items-center border-b border-neutral-800 pb-5">
                    <div>
                        <h1 className="text-2xl font-black text-white">Content Studio</h1>
                        <p className="text-sm text-neutral-500 mt-0.5">Create and manage cyber awareness courses for corporate teams and NGO audiences</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setShowImport(true)} className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-sm font-semibold rounded-xl transition">
                            📥 Import
                        </button>
                        <button onClick={() => setShowTemplate(true)} className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-sm font-semibold rounded-xl transition">
                            📋 From Template
                        </button>
                        <Link href="/content-creator/studio" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)] transition">
                            ✨ New Course
                        </Link>
                    </div>
                </div>

                {/* ─── STATS CARDS ─────────────────────────────────────────── */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Total Courses', value: loading ? '—' : stats.total || 0, icon: '📚', color: 'text-blue-400', bg: 'bg-blue-500/10', trend: '+3' },
                        { label: 'Published', value: loading ? '—' : stats.published || 0, icon: '✅', color: 'text-green-400', bg: 'bg-green-500/10', trend: '+2' },
                        { label: 'In Review', value: loading ? '—' : stats.in_review || 0, icon: '⏳', color: 'text-yellow-400', bg: 'bg-yellow-500/10', trend: '0' },
                        { label: 'Draft', value: loading ? '—' : stats.draft || 0, icon: '📄', color: 'text-neutral-400', bg: 'bg-neutral-800', trend: '—' },
                    ].map(m => (
                        <div key={m.label} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${m.bg} ${m.color}`}>{m.icon}</span>
                                <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded">{m.trend}</span>
                            </div>
                            <p className="text-sm font-medium text-neutral-400 mb-0.5">{m.label}</p>
                            <p className="text-2xl font-black text-white">{m.value}</p>
                        </div>
                    ))}
                </div>

                {/* ─── WORKFLOW OVERVIEW ──────────────────────────────────── */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
                    <h2 className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-4">Course Workflow</h2>
                    <div className="flex items-center gap-3">
                        {WORKFLOW_STAGES.map((stage, i) => (
                            <React.Fragment key={stage.key}>
                                <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-center">
                                    <div className="text-2xl mb-1">{stage.icon}</div>
                                    <div className={`text-xl font-black ${stage.color}`}>
                                        {loading ? '—' : stage.key === 'draft' ? stats.draft || 0 : stage.key === 'in_review' ? stats.in_review || 0 : stats.published || 0}
                                    </div>
                                    <div className="text-xs text-neutral-500 mt-0.5">{stage.label}</div>
                                </div>
                                {i < WORKFLOW_STAGES.length - 1 && (
                                    <div className="text-neutral-700 text-xl font-black">→</div>
                                )}
                            </React.Fragment>
                        ))}
                        <div className="flex-1 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 text-center">
                            <div className="text-2xl mb-1">🏆</div>
                            <div className="text-xl font-black text-indigo-400">
                                {loading ? '—' : Math.round(((stats.published || 0) / Math.max(stats.total || 1, 1)) * 100)}%
                            </div>
                            <div className="text-xs text-neutral-500 mt-0.5">Publish Rate</div>
                        </div>
                    </div>
                </div>

                {/* ─── AUDIENCE FILTER ────────────────────────────────────── */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                        {['All', 'Corporate', 'NGO'].map(f => (
                            <button key={f} onClick={() => setAudienceFilter(f)} className={`px-4 py-2 text-sm font-bold rounded-lg transition ${audienceFilter === f ? 'bg-indigo-600 text-white shadow' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>{f}</button>
                        ))}
                    </div>
                    <Link href="/content-creator/studio" className="text-sm text-indigo-400 hover:text-indigo-300 font-bold transition flex items-center gap-1">
                        View All in Studio →
                    </Link>
                </div>

                {/* ─── COURSE GRID ────────────────────────────────────────── */}
                {loading ? (
                    <div className="grid grid-cols-3 gap-5">
                        {[1, 2, 3].map(i => <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-xl h-56 animate-pulse" />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-5">
                        {filteredCourses.slice(0, 6).map(course => {
                            const moduleCount = course.modules?.length || 0;
                            const lessonCount = course.modules?.reduce((s: number, m: any) => s + (m.lessons?.length || 0), 0) || 0;
                            return (
                                <div key={course.id} className="bg-neutral-900 border border-neutral-800 hover:border-indigo-500/40 rounded-xl p-5 flex flex-col gap-4 group transition-all">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl">
                                                {course.audience === 'NGO' ? '🌍' : '📚'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-sm leading-tight group-hover:text-indigo-400 transition-colors">{course.title}</h3>
                                                <p className="text-[10px] text-neutral-500 mt-0.5">{course.audience} · {course.category || 'General'}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${STATUS_COLORS[course.status] || STATUS_COLORS.draft}`}>
                                            {course.status === 'in_review' ? 'In Review' : course.status}
                                        </span>
                                    </div>

                                    {/* Compliance tags */}
                                    {(course.compliance_tags || []).length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {(course.compliance_tags || []).slice(0, 3).map((tag: string) => (
                                                <span key={tag} className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${COMPLIANCE_COLORS[tag] || 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Metrics */}
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-center">
                                            <div className="text-sm font-black text-white">{moduleCount}</div>
                                            <div className="text-[9px] text-neutral-500 uppercase">Modules</div>
                                        </div>
                                        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-center">
                                            <div className="text-sm font-black text-white">{lessonCount}</div>
                                            <div className="text-[9px] text-neutral-500 uppercase">Lessons</div>
                                        </div>
                                        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-center">
                                            <div className="text-sm font-black text-white">{course.pass_mark || 70}%</div>
                                            <div className="text-[9px] text-neutral-500 uppercase">Pass</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2 border-t border-neutral-800 mt-auto">
                                        <Link href={`/content-creator/studio/builder/${course.id}`} className="flex-1 py-2 text-center text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition border border-neutral-700">
                                            ✏️ Edit & Build
                                        </Link>
                                        <Link href={`/content-creator/studio/builder/${course.id}?tab=review`} className="px-3 py-2 text-xs font-bold text-neutral-300 bg-neutral-900 border border-neutral-700 hover:border-neutral-500 rounded-lg transition">
                                            👁️ Preview
                                        </Link>
                                        {course.audience === 'NGO' && (
                                            <Link href="/content-creator/analytics" className="px-3 py-2 text-xs font-bold text-cyan-400 bg-cyan-950/30 border border-cyan-900 hover:border-cyan-700 rounded-lg transition">
                                                📈 Impact
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* View all card */}
                        {filteredCourses.length > 6 && (
                            <Link href="/content-creator/studio" className="bg-neutral-900/50 border border-dashed border-neutral-700 hover:border-indigo-500/50 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3 h-full transition group">
                                <span className="text-3xl">📚</span>
                                <p className="text-sm font-bold text-neutral-400 group-hover:text-indigo-300 transition">+{filteredCourses.length - 6} more courses</p>
                                <p className="text-xs text-neutral-600">View all in Studio →</p>
                            </Link>
                        )}

                        {filteredCourses.length === 0 && !loading && (
                            <div className="col-span-3 text-center py-16 text-neutral-600">
                                <div className="text-5xl mb-4">📚</div>
                                <p className="mb-4">No courses yet. Create your first one!</p>
                                <Link href="/content-creator/studio" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition inline-block">
                                    ✨ Go to Studio
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── QUICK ACCESS LINKS ─────────────────────────────────── */}
                <div className="grid grid-cols-3 gap-4 border-t border-neutral-800 pt-6">
                    {[
                        { label: 'All Courses Studio', desc: 'Manage, filter, and create courses', icon: '📚', href: '/content-creator/studio', color: 'border-indigo-500/30 hover:border-indigo-500/60 text-indigo-400' },
                        { label: 'Review Queue', desc: 'Courses awaiting compliance review', icon: '⏳', href: '/content-creator/review', color: 'border-yellow-500/30 hover:border-yellow-500/60 text-yellow-400' },
                        { label: 'Analytics', desc: 'Completion rates and course performance', icon: '📊', href: '/content-creator/analytics', color: 'border-purple-500/30 hover:border-purple-500/60 text-purple-400' },
                    ].map(q => (
                        <Link key={q.href} href={q.href} className={`bg-neutral-900 border ${q.color} rounded-xl p-5 flex items-center gap-4 transition group`}>
                            <span className="text-3xl">{q.icon}</span>
                            <div>
                                <p className="font-bold text-white text-sm">{q.label}</p>
                                <p className="text-xs text-neutral-500 mt-0.5">{q.desc}</p>
                            </div>
                            <span className="ml-auto text-neutral-600 group-hover:text-white transition">→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </RoleLayout>
    );
}

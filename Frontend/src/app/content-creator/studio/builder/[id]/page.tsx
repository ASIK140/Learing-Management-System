'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
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
    title: 'Course Builder', subtitle: 'Build modules, lessons, quizzes and publish',
    accentColor: 'indigo', avatarText: 'CC', avatarGradient: 'bg-gradient-to-tr from-indigo-500 to-cyan-500',
    userName: 'Sarah Jenkins', userEmail: 'sarah.j@cybershield.com', currentRole: 'content-creator',
};

const STEPS = ['📋 Course Setup', '🧱 Build Modules', '⚙️ Rules & Settings', '🚀 Review & Publish'];

const BLOCK_TYPES = [
    { type: 'video',          label: '🎥 Video',           desc: 'Upload or link a video' },
    { type: 'notes',          label: '📝 Notes',           desc: 'Rich text content' },
    { type: 'quiz',           label: '📊 Quiz',            desc: 'Multi-question quiz' },
    { type: 'quick_question', label: '⚡ Quick Question',  desc: 'Single instant feedback' },
    { type: 'file',           label: '📎 File / PDF',      desc: 'Upload document' },
    { type: 'scenario',       label: '🎭 Scenario',        desc: 'Real-life simulation' },
];

const COMPLIANCE_TAGS = ['ISO 27001', 'SOC2', 'PCI DSS', 'GDPR', 'NIST', 'ISO 27701'];

export default function CourseBuilderPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const courseId = params?.id as string;

    const [step, setStep] = useState(searchParams?.get('tab') === 'review' ? 3 : 0);
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'warning' } | null>(null);

    // Step 1 — Course Setup form
    const [setupForm, setSetupForm] = useState({ title: '', description: '', audience: 'Corporate', category: '', compliance_tags: [] as string[], pass_mark: 70, certificate_enabled: true, certificate_name: '' });

    // Step 2 — Modules/Lessons/Blocks
    const [selectedModuleId, setSelectedModuleId]   = useState<string | null>(null);
    const [selectedLessonId, setSelectedLessonId]   = useState<string | null>(null);
    const [addingModule, setAddingModule]            = useState(false);
    const [addingLesson, setAddingLesson]            = useState(false);
    const [addingBlock, setAddingBlock]              = useState(false);
    const [newModTitle, setNewModTitle]              = useState('');
    const [newLessonTitle, setNewLessonTitle]        = useState('');

    // Step 2 — Quiz panel
    const [showQuizPanel, setShowQuizPanel]          = useState(false);
    const [selectedQuizId, setSelectedQuizId]        = useState<string | null>(null);
    const [newQuestion, setNewQuestion]              = useState({ question: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' });
    const [savingQuestion, setSavingQuestion]        = useState(false);

    // Step 3 — Settings
    const [settings, setSettings] = useState({ deadline_days: '', reminder_days: 3, manager_visible: true });

    // Step 4 — Validation & workflow
    const [validationResult, setValidationResult]    = useState<any>(null);
    const [validating, setValidating]                = useState(false);
    const [submitting, setSubmitting]                = useState(false);
    const [approving, setApproving]                  = useState(false);
    const [reviewerNote, setReviewerNote]            = useState('');

    const showToast = (msg: string, type: 'success' | 'error' | 'warning' = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const loadCourse = useCallback(async () => {
        if (!courseId) return;
        try {
            const r = await apiFetch(`/content/studio/${courseId}`).then(r => r.json());
            if (r.success) {
                setCourse(r.data);
                setSetupForm(f => ({ ...f, ...r.data, compliance_tags: r.data.compliance_tags || [] }));
                setSettings(s => ({ ...s, deadline_days: r.data.deadline_days || '', reminder_days: r.data.reminder_days || 3, manager_visible: r.data.manager_visible !== false }));
            }
        } catch {}
        finally { setLoading(false); }
    }, [courseId]);

    useEffect(() => { loadCourse(); }, [loadCourse]);

    // Helper getters
    const modules  = course?.modules || [];
    const selMod   = modules.find((m: any) => m.id === selectedModuleId);
    const selLesson= selMod?.lessons?.find((l: any) => l.id === selectedLessonId);
    const selQuiz  = selLesson?.quizzes?.[0];

    // ── Save Setup ──────────────────────────────────────────────────────
    const saveSetup = async () => {
        setSaving(true);
        try {
            const r = await apiFetch(`/content/studio/update/${courseId}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(setupForm)
            });
            const d = await r.json();
            if (!d.success) throw new Error(d.message);
            showToast('✅ Course details saved'); setStep(1);
        } catch (e: any) { showToast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    // ── Add Module ──────────────────────────────────────────────────────
    const addModule = async () => {
        if (!newModTitle.trim()) return;
        const r = await apiFetch('/content/studio/modules/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ course_id: courseId, title: newModTitle }) });
        const d = await r.json();
        if (d.success) { setNewModTitle(''); setAddingModule(false); await loadCourse(); setSelectedModuleId(d.data.id); showToast('Module added'); }
        else showToast(d.message, 'error');
    };

    // ── Add Lesson ──────────────────────────────────────────────────────
    const addLesson = async () => {
        if (!newLessonTitle.trim() || !selectedModuleId) return;
        const r = await apiFetch('/content/studio/lessons/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ module_id: selectedModuleId, title: newLessonTitle }) });
        const d = await r.json();
        if (d.success) { setNewLessonTitle(''); setAddingLesson(false); await loadCourse(); setSelectedLessonId(d.data.id); showToast('Lesson added'); }
        else showToast(d.message, 'error');
    };

    // ── Add Content Block ───────────────────────────────────────────────
    const addBlock = async (type: string) => {
        if (!selectedLessonId) return;
        setAddingBlock(true);
        try {
            const r = await apiFetch('/content/studio/blocks/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lesson_id: selectedLessonId, type, title: type }) });
            const d = await r.json();
            if (d.success) { await loadCourse(); showToast(`Block added: ${type}`); if (type === 'quiz') { const quiz = await apiFetch('/content/studio/quiz/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lesson_id: selectedLessonId, title: 'Module Quiz' }) }).then(r => r.json()); if (quiz.success) { setSelectedQuizId(quiz.data.id); setShowQuizPanel(true); await loadCourse(); } } }
            else showToast(d.message, 'error');
        } finally { setAddingBlock(false); }
    };

    // ── Add Quiz Question ───────────────────────────────────────────────
    const addQuizQuestion = async () => {
        if (!newQuestion.question.trim()) { showToast('Question text is required', 'error'); return; }
        const filledOpts = newQuestion.options.filter(o => o.trim());
        if (filledOpts.length < 2) { showToast('At least 2 options required', 'error'); return; }
        const qid = selectedQuizId || selQuiz?.id;
        if (!qid) { showToast('No quiz selected', 'error'); return; }
        setSavingQuestion(true);
        try {
            const r = await apiFetch('/content/studio/questions/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quiz_id: qid, ...newQuestion, options: newQuestion.options.filter(o => o.trim()) }) });
            const d = await r.json();
            if (d.success) { setNewQuestion({ question: '', options: ['', '', '', ''], correct_answer: 0, explanation: '' }); await loadCourse(); showToast('✅ Question added'); }
            else showToast(d.message, 'error');
        } finally { setSavingQuestion(false); }
    };

    // ── Save Settings ───────────────────────────────────────────────────
    const saveSettings = async () => {
        setSaving(true);
        try {
            const r = await apiFetch(`/content/studio/update/${courseId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
            const d = await r.json();
            if (d.success) { showToast('Settings saved'); setStep(3); }
            else showToast(d.message, 'error');
        } catch (e: any) { showToast(e.message, 'error'); }
        finally { setSaving(false); }
    };

    // ── Validate ────────────────────────────────────────────────────────
    const runValidation = async () => {
        setValidating(true);
        try {
            const r = await apiFetch(`/content/studio/validate/${courseId}`).then(r => r.json());
            setValidationResult(r);
        } catch {} finally { setValidating(false); }
    };

    // ── Submit for Review ───────────────────────────────────────────────
    const submitForReview = async () => {
        setSubmitting(true);
        try {
            const r = await apiFetch(`/content/studio/submit-review/${courseId}`, { method: 'POST' });
            const d = await r.json();
            if (d.success) { showToast('✅ Course submitted for review!'); await loadCourse(); }
            else showToast(d.message + (d.errors ? ': ' + d.errors.join(', ') : ''), 'error');
        } catch (e: any) { showToast(e.message, 'error'); }
        finally { setSubmitting(false); }
    };

    // ── Approve ─────────────────────────────────────────────────────────
    const approveCourse = async () => {
        setApproving(true);
        try {
            const r = await apiFetch(`/content/studio/approve/${courseId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note: reviewerNote }) });
            const d = await r.json();
            if (d.success) { showToast('🎉 Course approved and published!'); await loadCourse(); }
            else showToast(d.message, 'error');
        } catch (e: any) { showToast(e.message, 'error'); }
        finally { setApproving(false); }
    };

    const toggleTag = (tag: string) => setSetupForm(f => ({ ...f, compliance_tags: f.compliance_tags.includes(tag) ? f.compliance_tags.filter(t => t !== tag) : [...f.compliance_tags, tag] }));

    if (loading) return (
        <RoleLayout {...RLPROPS} navSections={contentNavSections}>
            <div className="flex items-center justify-center h-[60vh] text-neutral-500">
                <div className="text-center"><div className="text-5xl mb-4 animate-pulse">🧱</div><p>Loading course builder...</p></div>
            </div>
        </RoleLayout>
    );

    return (
        <RoleLayout {...RLPROPS} navSections={contentNavSections}>
            <div className="max-w-7xl mx-auto w-full">

                {toast && (
                    <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl font-bold text-sm max-w-md ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'warning' ? 'bg-amber-600' : 'bg-red-600'} text-white`}>{toast.msg}</div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Link href="/content-creator/studio" className="p-2 bg-neutral-800 rounded-xl hover:bg-neutral-700 text-neutral-400 hover:text-white transition text-sm">← Back</Link>
                        <div>
                            <h1 className="text-2xl font-black text-white">{course?.title || 'Course Builder'}</h1>
                            <p className="text-xs text-neutral-500">{course?.status === 'published' ? '✅ Published' : course?.status === 'in_review' ? '⏳ In Review' : '📄 Draft'} · v{course?.version}</p>
                        </div>
                    </div>
                </div>

                {/* Step stepper */}
                <div className="flex gap-0 mb-8 bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                    {STEPS.map((s, i) => (
                        <button key={i} onClick={() => setStep(i)} className={`flex-1 py-4 text-sm font-bold transition-all border-r last:border-r-0 border-neutral-800 ${step === i ? 'bg-indigo-600/20 text-indigo-300' : i < step ? 'text-green-400 hover:bg-neutral-800' : 'text-neutral-600 hover:bg-neutral-800'}`}>
                            {i < step ? '✅ ' : ''}{s}
                        </button>
                    ))}
                </div>

                {/* ─── STEP 0: COURSE SETUP ───────────────────────────────────── */}
                {step === 0 && (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-5">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                                <h2 className="text-sm font-black text-white uppercase tracking-widest">📋 Basic Info</h2>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Course Title <span className="text-red-400">*</span></label>
                                    <input value={setupForm.title} onChange={e => setSetupForm({ ...setupForm, title: e.target.value })} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Description</label>
                                    <textarea value={setupForm.description || ''} onChange={e => setSetupForm({ ...setupForm, description: e.target.value })} rows={4} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none resize-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Audience</label>
                                        <select value={setupForm.audience} onChange={e => setSetupForm({ ...setupForm, audience: e.target.value })} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none">
                                            <option>Corporate</option><option>NGO</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Category</label>
                                        <input value={setupForm.category || ''} onChange={e => setSetupForm({ ...setupForm, category: e.target.value })} placeholder="e.g. Phishing" className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                                <h2 className="text-sm font-black text-white uppercase tracking-widest">🛡️ Compliance Mapping</h2>
                                <div className="flex flex-wrap gap-2">
                                    {COMPLIANCE_TAGS.map(tag => (
                                        <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-2 text-xs font-bold rounded-xl border transition ${setupForm.compliance_tags.includes(tag) ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-700'}`}>{tag}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                                <h2 className="text-sm font-black text-white uppercase tracking-widest">🏆 Certificate Settings</h2>
                                <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3">
                                    <span className="text-sm text-neutral-300">Issue Certificate on Completion</span>
                                    <button onClick={() => setSetupForm({ ...setupForm, certificate_enabled: !setupForm.certificate_enabled })} className={`ml-auto w-12 h-6 rounded-full border transition relative ${setupForm.certificate_enabled ? 'bg-green-500/20 border-green-500' : 'bg-neutral-800 border-neutral-700'}`}>
                                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${setupForm.certificate_enabled ? 'left-6' : 'left-0.5'}`} />
                                    </button>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Certificate Name</label>
                                    <input value={setupForm.certificate_name || ''} onChange={e => setSetupForm({ ...setupForm, certificate_name: e.target.value })} placeholder="Certificate of Completion" className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Pass Mark (%)</label>
                                    <input type="number" value={setupForm.pass_mark} onChange={e => setSetupForm({ ...setupForm, pass_mark: Number(e.target.value) })} min={0} max={100} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button onClick={saveSetup} disabled={saving} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.4)] transition">
                                    {saving ? '⏳ Saving...' : 'Save & Next → Build Modules'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── STEP 1: BUILD MODULES ──────────────────────────────── */}
                {step === 1 && (
                    <div className="flex gap-6 h-[calc(100vh-300px)]">
                        {/* LEFT: Module tree */}
                        <div className="w-72 flex-shrink-0 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col">
                            <div className="px-4 py-3 border-b border-neutral-800 flex justify-between items-center">
                                <span className="text-xs font-black text-white uppercase tracking-widest">Modules</span>
                                <button onClick={() => setAddingModule(true)} className="text-indigo-400 hover:text-indigo-300 text-xl font-black">+</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                {modules.map((mod: any, mi: number) => (
                                    <div key={mod.id}>
                                        <button onClick={() => { setSelectedModuleId(mod.id); setSelectedLessonId(null); setShowQuizPanel(false); }} className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold transition flex items-center gap-2 ${selectedModuleId === mod.id ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-neutral-400 hover:bg-neutral-800 border border-transparent'}`}>
                                            <span className="text-xs bg-neutral-700 text-neutral-300 px-1.5 py-0.5 rounded font-black">{mi + 1}</span>
                                            <span className="truncate">{mod.title}</span>
                                        </button>
                                        {selectedModuleId === mod.id && (
                                            <div className="ml-4 mt-1 space-y-1">
                                                {(mod.lessons || []).map((lesson: any, li: number) => (
                                                    <button key={lesson.id} onClick={() => { setSelectedLessonId(lesson.id); setShowQuizPanel(false); }} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${selectedLessonId === lesson.id ? 'bg-indigo-500/10 text-indigo-400' : 'text-neutral-500 hover:bg-neutral-800'}`}>
                                                        📄 {lesson.title}
                                                    </button>
                                                ))}
                                                {addingLesson && selectedModuleId === mod.id ? (
                                                    <div className="flex gap-1 mt-1">
                                                        <input autoFocus value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLesson()} placeholder="Lesson name..." className="flex-1 bg-neutral-950 border border-indigo-500 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none" />
                                                        <button onClick={addLesson} className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-xs">✓</button>
                                                        <button onClick={() => setAddingLesson(false)} className="px-2 py-1 bg-neutral-800 text-white rounded-lg text-xs">×</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setAddingLesson(true)} className="w-full text-left px-3 py-1.5 text-xs text-indigo-500 hover:text-indigo-400 transition">+ Add Lesson</button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {addingModule ? (
                                    <div className="flex gap-1 p-2">
                                        <input autoFocus value={newModTitle} onChange={e => setNewModTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addModule()} placeholder="Module name..." className="flex-1 bg-neutral-950 border border-indigo-500 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" />
                                        <button onClick={addModule} className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm">✓</button>
                                        <button onClick={() => setAddingModule(false)} className="px-3 py-2 bg-neutral-800 text-white rounded-xl text-sm">×</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setAddingModule(true)} className="w-full text-left px-3 py-2.5 text-sm text-indigo-500 hover:text-indigo-400 transition font-bold">+ Add Module</button>
                                )}
                            </div>
                        </div>

                        {/* CENTER: Content Blocks */}
                        <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col">
                            {selLesson ? (
                                <>
                                    <div className="px-5 py-3 border-b border-neutral-800 flex justify-between items-center">
                                        <div>
                                            <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Lesson: </span>
                                            <span className="text-sm font-bold text-white">{selLesson.title}</span>
                                        </div>
                                        {selLesson?.quizzes?.length > 0 && (
                                            <button onClick={() => setShowQuizPanel(!showQuizPanel)} className="px-3 py-1.5 text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition">
                                                📊 {showQuizPanel ? 'Hide' : 'Manage'} Quiz Questions
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-5 space-y-3">
                                        {(selLesson.blocks || []).map((block: any) => (
                                            <div key={block.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex items-center gap-3">
                                                <span className="text-xl">{BLOCK_TYPES.find(b => b.type === block.type)?.label?.split(' ')[0] || '📄'}</span>
                                                <div>
                                                    <p className="text-sm font-bold text-white capitalize">{block.type.replace('_', ' ')}</p>
                                                    <p className="text-xs text-neutral-500">{BLOCK_TYPES.find(b => b.type === block.type)?.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {(selLesson.blocks || []).length === 0 && (
                                            <div className="text-center py-16 text-neutral-600">
                                                <p className="text-4xl mb-3">🧱</p>
                                                <p className="text-sm">Add content blocks to this lesson using the panel →</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-neutral-600 flex-col gap-3">
                                    <span className="text-5xl">📄</span>
                                    <p>{modules.length === 0 ? 'Add a module to get started' : 'Select a lesson to add content blocks'}</p>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Block picker or Quiz editor */}
                        <div className="w-72 flex-shrink-0 bg-neutral-900 border border-neutral-800 rounded-2xl flex flex-col overflow-y-auto">
                            {showQuizPanel && selLesson?.quizzes?.length > 0 ? (
                                <div className="p-4 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest">📊 Quiz Questions</h3>
                                        <button onClick={() => setShowQuizPanel(false)} className="text-neutral-500 hover:text-white">×</button>
                                    </div>
                                    <p className="text-xs text-neutral-500">{selLesson.quizzes[0]?.questions?.length || 0} questions · Pass: {selLesson.quizzes[0]?.pass_mark}%</p>
                                    {(selLesson.quizzes[0]?.questions || []).map((q: any, qi: number) => (
                                        <div key={q.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                                            <p className="text-xs font-bold text-white">{qi + 1}. {q.question}</p>
                                            <div className="mt-2 space-y-1">
                                                {(q.options || []).map((opt: string, oi: number) => (
                                                    <p key={oi} className={`text-[10px] px-2 py-1 rounded ${oi === q.correct_answer ? 'bg-green-500/10 text-green-400' : 'text-neutral-500'}`}>
                                                        {oi === q.correct_answer ? '✅ ' : ''}{opt}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="border-t border-neutral-800 pt-3 space-y-3">
                                        <p className="text-xs font-bold text-neutral-400 uppercase">Add Question</p>
                                        <textarea value={newQuestion.question} onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })} placeholder="Question text..." rows={2} className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs focus:border-purple-500 focus:outline-none resize-none" />
                                        {newQuestion.options.map((opt, oi) => (
                                            <div key={oi} className="flex items-center gap-2">
                                                <button onClick={() => setNewQuestion({ ...newQuestion, correct_answer: oi })} className={`w-4 h-4 rounded-full border flex-shrink-0 ${newQuestion.correct_answer === oi ? 'border-green-500 bg-green-500' : 'border-neutral-600'}`} />
                                                <input value={opt} onChange={e => { const opts = [...newQuestion.options]; opts[oi] = e.target.value; setNewQuestion({ ...newQuestion, options: opts }); }} placeholder={`Option ${oi + 1}`} className="flex-1 bg-neutral-950 border border-neutral-700 rounded-lg px-2 py-1.5 text-white text-xs focus:border-purple-500 focus:outline-none" />
                                            </div>
                                        ))}
                                        <input value={newQuestion.explanation} onChange={e => setNewQuestion({ ...newQuestion, explanation: e.target.value })} placeholder="Explanation (optional)" className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-white text-xs focus:border-purple-500 focus:outline-none" />
                                        <button onClick={addQuizQuestion} disabled={savingQuestion} className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-black rounded-lg">
                                            {savingQuestion ? '⏳...' : '+ Add Question'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 space-y-3">
                                    <h3 className="text-xs font-black text-neutral-400 uppercase tracking-widest">Add Content Block</h3>
                                    {selLesson ? (
                                        BLOCK_TYPES.map(bt => (
                                            <button key={bt.type} onClick={() => addBlock(bt.type)} disabled={addingBlock} className="w-full text-left px-3 py-3 bg-neutral-950 border border-neutral-800 hover:border-indigo-500/40 hover:bg-indigo-500/5 rounded-xl transition">
                                                <div className="font-bold text-white text-sm">{bt.label}</div>
                                                <div className="text-xs text-neutral-500 mt-0.5">{bt.desc}</div>
                                            </button>
                                        ))
                                    ) : (
                                        <p className="text-xs text-neutral-600 text-center py-8">Select a lesson to add blocks</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step navigation footer for step 1 */}
                {step === 1 && (
                    <div className="flex justify-between mt-6">
                        <button onClick={() => setStep(0)} className="px-6 py-2.5 bg-neutral-800 text-neutral-300 text-sm font-bold rounded-xl border border-neutral-700 hover:bg-neutral-700">← Back</button>
                        <button onClick={() => setStep(2)} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl">Next → Rules & Settings</button>
                    </div>
                )}

                {/* ─── STEP 2: RULES & SETTINGS ───────────────────────────── */}
                {step === 2 && (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-5">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
                                <h2 className="text-sm font-black text-white uppercase tracking-widest">⏰ Completion Settings</h2>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Deadline (days after enrollment)</label>
                                    <input type="number" value={settings.deadline_days} onChange={e => setSettings({ ...settings, deadline_days: e.target.value })} placeholder="e.g. 14" className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase mb-2">Reminder (days before deadline)</label>
                                    <input type="number" value={settings.reminder_days} onChange={e => setSettings({ ...settings, reminder_days: Number(e.target.value) })} className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-3 text-white text-sm focus:border-indigo-500 focus:outline-none" />
                                </div>
                                <div className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3">
                                    <span className="text-sm text-neutral-300">Manager Visibility</span>
                                    <button onClick={() => setSettings({ ...settings, manager_visible: !settings.manager_visible })} className={`ml-auto w-12 h-6 rounded-full border transition relative ${settings.manager_visible ? 'bg-green-500/20 border-green-500' : 'bg-neutral-800 border-neutral-700'}`}>
                                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${settings.manager_visible ? 'left-6' : 'left-0.5'}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
                                <h2 className="text-sm font-black text-white uppercase tracking-widest">🔄 Adaptive Failure Rules</h2>
                                {[
                                    { icon: '1️⃣', rule: 'Score < Pass Mark', action: 'Allow retry + show hints' },
                                    { icon: '2️⃣', rule: '2nd consecutive fail', action: 'Assign intensive module' },
                                    { icon: '3️⃣', rule: '3rd consecutive fail', action: 'Escalate to manager' },
                                ].map(r => (
                                    <div key={r.rule} className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3">
                                        <span className="text-xl">{r.icon}</span>
                                        <div>
                                            <p className="text-xs font-bold text-neutral-300">{r.rule}</p>
                                            <p className="text-[10px] text-neutral-500">→ {r.action}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-5">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-3">
                                <h2 className="text-sm font-black text-white uppercase tracking-widest">🔔 Learner Notifications</h2>
                                {['Enrollment confirmation','Deadline reminder','Completion message','Certificate issued','Exam result'].map(n => (
                                    <div key={n} className="flex items-center gap-3 bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5">
                                        <span className="text-green-400 text-sm">✓</span>
                                        <span className="text-sm text-neutral-300">{n}</span>
                                        <span className="ml-auto text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">Email + In-App</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between">
                                <button onClick={() => setStep(1)} className="px-6 py-2.5 bg-neutral-800 text-neutral-300 text-sm font-bold rounded-xl border border-neutral-700 hover:bg-neutral-700">← Back</button>
                                <button onClick={saveSettings} disabled={saving} className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-black rounded-xl">
                                    {saving ? '⏳...' : 'Next → Review & Publish'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── STEP 3: REVIEW & PUBLISH ───────────────────────────── */}
                {step === 3 && (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-5">
                            {/* Validation */}
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-sm font-black text-white uppercase tracking-widest">✅ Validation Checks</h2>
                                    <button onClick={runValidation} disabled={validating} className="px-4 py-2 text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20 transition">
                                        {validating ? '⏳ Checking...' : '▶ Run Checks'}
                                    </button>
                                </div>
                                {validationResult ? (
                                    <div className="space-y-2">
                                        {validationResult.checks?.map((c: any) => (
                                            <div key={c.name} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${c.pass ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                                <span>{c.pass ? '✅' : '❌'}</span>
                                                <span className={`text-sm font-bold ${c.pass ? 'text-green-400' : 'text-red-400'}`}>{c.name}</span>
                                                <span className="ml-auto text-xs text-neutral-500">{c.detail}</span>
                                            </div>
                                        ))}
                                        <div className={`px-4 py-3 rounded-xl border font-bold text-sm text-center mt-2 ${validationResult.ready_to_submit ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                                            {validationResult.ready_to_submit ? '✅ Ready to submit for review' : `⚠️ ${validationResult.total - validationResult.passed} check(s) failed — fix before submitting`}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-neutral-600 text-sm text-center py-6">Run validation to check your course before submitting</p>
                                )}
                            </div>

                            {/* Approval Workflow */}
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4">🔄 Approval Workflow</h2>
                                <div className="flex items-center gap-2 mb-6">
                                    {['Content Creator', 'Reviewer', 'Compliance Approver', 'Published'].map((stage, i) => (
                                        <React.Fragment key={stage}>
                                            <div className={`text-center flex-1 text-[10px] font-bold px-2 py-2 rounded-lg border ${course?.status === 'published' && i === 3 ? 'bg-green-500/20 text-green-400 border-green-500/30' : course?.status === 'in_review' && i === 1 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : course?.status === 'draft' && i === 0 ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'bg-neutral-950 text-neutral-600 border-neutral-800'}`}>
                                                {stage}
                                            </div>
                                            {i < 3 && <span className="text-neutral-700">→</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                                {course?.status === 'draft' && (
                                    <button onClick={submitForReview} disabled={submitting} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition">
                                        {submitting ? '⏳ Submitting...' : '📤 Submit for Review'}
                                    </button>
                                )}
                                {course?.status === 'in_review' && (
                                    <div className="space-y-3">
                                        <div className="px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-sm text-yellow-400 font-bold text-center">
                                            ⏳ Awaiting compliance review
                                        </div>
                                        <input value={reviewerNote} onChange={e => setReviewerNote(e.target.value)} placeholder="Reviewer note (optional)" className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2.5 text-white text-sm focus:border-green-500 focus:outline-none" />
                                        <button onClick={approveCourse} disabled={approving} className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl transition">
                                            {approving ? '⏳ Approving...' : '✅ Approve & Publish'}
                                        </button>
                                    </div>
                                )}
                                {course?.status === 'published' && (
                                    <div className="px-4 py-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                                        <p className="text-green-400 font-black text-lg">🎉 Published!</p>
                                        <p className="text-xs text-neutral-500 mt-1">Published on {course.published_at ? new Date(course.published_at).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* Course summary */}
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                                <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4">📋 Course Summary</h2>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Title', val: course?.title },
                                        { label: 'Audience', val: course?.audience },
                                        { label: 'Category', val: course?.category || '—' },
                                        { label: 'Modules', val: modules.length },
                                        { label: 'Lessons', val: modules.reduce((s: number, m: any) => s + (m.lessons?.length || 0), 0) },
                                        { label: 'Pass Mark', val: `${course?.pass_mark}%` },
                                        { label: 'Compliance Tags', val: (course?.compliance_tags || []).join(', ') || '—' },
                                        { label: 'Certificate', val: course?.certificate_enabled ? course?.certificate_name || 'Yes' : 'No' },
                                    ].map(r => (
                                        <div key={r.label} className="flex justify-between text-sm border-b border-neutral-800 pb-2">
                                            <span className="text-neutral-500 font-medium">{r.label}</span>
                                            <span className="text-white font-bold">{r.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setStep(2)} className="px-6 py-2.5 bg-neutral-800 text-neutral-300 text-sm font-bold rounded-xl border border-neutral-700 hover:bg-neutral-700">← Back to Settings</button>
                        </div>
                    </div>
                )}
            </div>
        </RoleLayout>
    );
}

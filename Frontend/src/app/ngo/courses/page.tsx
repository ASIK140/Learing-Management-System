import React from 'react';
import Link from 'next/link';

export default function NGOCoursesPage() {
    return (
        <div className="flex flex-col gap-10 max-w-[1600px] mx-auto">
            
            {/* Headers */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Available Courses</h2>
                    <p className="text-neutral-400 text-sm">Courses included in the NGO free plan.</p>
                </div>
                <div className="px-4 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg text-sm font-bold flex items-center gap-2">
                    <span>🌍</span> CyberShield NGO Plan
                </div>
            </div>

            {/* INCLUDED IN FREE TIER */}
            <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 border-b border-neutral-800 pb-3">
                    <span className="text-green-400">✓</span>
                    Included in Free Tier
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: 'Phishing, Smishing & Vishing', code: 'PHISH-01', framework: 'ISO 27001 • CE+', color: 'cyan', icon: '🎣' },
                        { title: 'GDPR & Data Protection', code: 'GDPR-01', framework: 'GDPR • DPDPA', color: 'blue', icon: '🛡️' },
                        { title: 'Executive Targeted Attacks', code: 'EXEC-01', framework: 'ISO 27001 • DORA', color: 'indigo', icon: '👔' },
                    ].map(course => (
                        <div key={course.code} className="rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col relative overflow-hidden group hover:-translate-y-1 transition-transform shadow-lg">
                            <div className={`h-24 bg-gradient-to-br from-${course.color}-900/40 to-neutral-900 border-b border-neutral-800 flex items-center justify-center`}>
                                <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform">{course.icon}</span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-${course.color}-400 bg-${course.color}-500/10 border border-${course.color}-500/20`}>FREE</span>
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-1 leading-snug">{course.title}</h4>
                                    <p className="text-xs font-mono text-neutral-500 mb-6">{course.code}</p>
                                </div>
                                <div className="border-t border-neutral-800 pt-4 mt-auto">
                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-1">Mapping</p>
                                    <p className="text-sm font-medium text-neutral-300">{course.framework}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* UPGRADE SECTION (LOCKED COURSES) */}
            <div className="mt-8 relative hidden sm:block">
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent z-10 flex flex-col items-center justify-center backdrop-blur-[2px] rounded-2xl">
                    <div className="bg-neutral-900 border border-neutral-700 p-8 rounded-3xl text-center max-w-md shadow-2xl flex flex-col items-center transform -translate-y-8">
                        <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl mb-4 border border-orange-500/30">
                            🔒
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Unlock the Full Library</h3>
                        <p className="text-sm text-neutral-400 mb-8">Upgrade to the NGO Starter plan to unlock 44 more courses, infinite phishing templates, and localized language support.</p>
                        <Link href="/ngo/reports/plan">
                            <button className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition-all shadow-[0_4px_20px_rgba(234,88,12,0.4)] hover:-translate-y-1">
                                Upgrade to NGO Starter
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="opacity-40 pointer-events-none">
                    <h3 className="text-xl font-bold text-neutral-500 mb-6 flex items-center gap-2 border-b border-neutral-800 pb-3">
                        <span className="text-neutral-600">🔒</span>
                        Available on Upgraded Plans
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 grayscale">
                        {[
                            { title: 'BEC & Wire Fraud Prevention', code: 'BEC-02', color: 'red', icon: '💸' },
                            { title: 'AI Deepfakes & Social Engineering', code: 'AI-01', color: 'purple', icon: '🤖' },
                            { title: 'Secure Dev & Cloud Security', code: 'DEV-01', color: 'green', icon: '☁️' },
                        ].map(course => (
                            <div key={course.code} className="rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col relative overflow-hidden transition-transform">
                                <div className={`h-24 bg-gradient-to-br from-neutral-800 to-neutral-900 border-b border-neutral-800 flex items-center justify-center`}>
                                    <span className="text-4xl drop-shadow-lg">{course.icon}</span>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-neutral-500 bg-neutral-800 border border-neutral-700">LOCKED</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-neutral-400 mb-1 leading-snug">{course.title}</h4>
                                        <p className="text-xs font-mono text-neutral-600 mb-6">{course.code}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

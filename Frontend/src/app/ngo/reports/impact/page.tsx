import React from 'react';

export default function NGOImpactReportPage() {
    return (
        <div className="flex flex-col gap-8 max-w-5xl mx-auto">
            
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Impact Report — Yearly</h2>
                    <p className="text-neutral-400 text-sm">Shareable report for donors and grant sponsors.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors border border-neutral-700">Export Excel</button>
                    <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-semibold rounded-lg transition-colors border border-neutral-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        Email Report
                    </button>
                    <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-[0_0_15px_rgba(234,88,12,0.3)] flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download PDF
                    </button>
                </div>
            </div>

            {/* REPORT DOCUMENT CONTAINER */}
            <div className="rounded-2xl bg-white text-neutral-900 shadow-2xl overflow-hidden print:shadow-none">
                
                {/* Document Header */}
                <div className="bg-orange-600 p-10 text-white flex justify-between items-end">
                    <div>
                        <p className="text-orange-200 font-bold tracking-widest uppercase text-xs mb-2">2026 Impact Report</p>
                        <h1 className="text-4xl font-black mb-2">SafeNet Uganda</h1>
                        <p className="text-lg text-orange-100 max-w-lg">Community digital safety initiative serving community educators and youth trainers across the region.</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full text-orange-600 shadow-lg text-3xl mb-4">
                            🌍
                        </div>
                        <p className="font-bold text-sm">Powered by CyberShield</p>
                        <p className="text-xs text-orange-200">NGO Free Tier Programme</p>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="p-10 space-y-12">
                    
                    {/* Programme Summary Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h3 className="text-xl font-bold text-neutral-800 border-b-2 border-orange-500 pb-2 mb-4 inline-block">Programme Summary</h3>
                            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                                SafeNet Uganda is dedicated to equipping local community educators and youth trainers with essential cybersecurity awareness. Through the CyberShield subsidized learning platform, we are actively improving the digital resilience of our field workers against modern cyber threats like phishing and social engineering.
                            </p>
                            <p className="text-sm text-neutral-600 leading-relaxed">
                                Our goal is to train 50 high-risk individuals in 2026 to ensure grassroots organizations securely handle sensitive community data without falling victim to targeted campaigns.
                            </p>
                        </div>
                        
                        {/* Financial Summary */}
                        <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6">
                            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 text-center">Financial Subsidy Value</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-500">50 Seat Enterprise Licence Value</span>
                                    <span className="font-mono text-neutral-400 line-through">£3,600</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-500">NGO Subsidised Price</span>
                                    <span className="font-mono font-bold text-green-600">£0</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-neutral-500">Training Hours Value</span>
                                    <span className="font-mono text-neutral-800">£1,080</span>
                                </div>
                                <div className="border-t border-neutral-200 mt-2 pt-3 flex justify-between items-center">
                                    <span className="font-bold text-neutral-800">Total Philanthropic Value Received</span>
                                    <span className="font-mono font-black text-xl text-orange-600">£4,680</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Outcomes Metrics */}
                    <div>
                        <h3 className="text-xl font-bold text-neutral-800 border-b-2 border-orange-500 pb-2 mb-6 inline-block">Key Outcomes</h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Active Members Trained', value: '42', subtitle: 'Target: 50' },
                                { label: 'Overall Training Completion', value: '74%', subtitle: '+6% month-over-month' },
                                { label: 'Certificates Issued', value: '31', subtitle: 'Valid credentials' },
                                { label: 'Training Hours Delivered', value: '186', subtitle: 'Hours of learning' },
                                { label: 'Phishing Click Rate', value: '21%', subtitle: 'Down from 38% initially' },
                                { label: 'Threat Reporting Rate', value: '64%', subtitle: 'Up from 12% initially' },
                            ].map(metric => (
                                <div key={metric.label} className="bg-white border border-neutral-200 rounded-lg p-5 text-center shadow-sm">
                                    <p className="text-4xl font-black text-neutral-800 mb-2">{metric.value}</p>
                                    <p className="text-sm font-bold text-orange-600 uppercase tracking-widest">{metric.label}</p>
                                    <p className="text-xs text-neutral-500 mt-1">{metric.subtitle}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Community Case Study */}
                    <div className="bg-orange-50 rounded-xl border border-orange-200 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 text-9xl text-orange-500/10 font-serif leading-none mt-4 mr-4">"</div>
                        <h3 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-6">Community Case Study</h3>
                        
                        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
                            <div className="w-24 h-24 rounded-full bg-orange-200 border-4 border-white shadow-md flex-shrink-0 flex items-center justify-center text-4xl overflow-hidden">
                                👩🏾‍🦱
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-neutral-800">Amara Nkosi</h4>
                                <p className="text-sm text-neutral-500 mb-4">Community Educator</p>
                                <p className="text-neutral-700 italic font-medium leading-relaxed mb-4 text-lg">
                                    "Before CyberShield, I had absolutely no idea what phishing was, and I was unknowingly putting our donor lists at risk. Through the training, I learned how to identify fake requests. Now, I personally train 30 community members every month on how to stay safe online."
                                </p>
                                <p className="text-sm font-bold text-green-600 flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    100% Training Completion • 2 Certificates Earned
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                
                <div className="bg-neutral-100 p-6 text-center text-xs text-neutral-400 border-t border-neutral-200">
                    Generated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} • CyberShield Enterprise LMS Data Extract
                </div>
            </div>

        </div>
    );
}

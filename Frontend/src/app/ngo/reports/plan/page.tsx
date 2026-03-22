import React from 'react';

export default function NGOPlanPage() {
    return (
        <div className="flex flex-col gap-10 max-w-6xl mx-auto">
            
            <div className="text-center max-w-2xl mx-auto mb-4">
                <h2 className="text-3xl font-bold text-white mb-3">Plan & Limits</h2>
                <p className="text-neutral-400">You are currently on the <strong className="text-orange-400">CyberShield NGO Free Tier</strong>. Upgrade your plan to expand your community reach and unlock advanced security features.</p>
            </div>

            {/* SEAT PROGRESS (Current Plan) */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">Current Usage</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 uppercase tracking-wider">Free Tier</span>
                        </div>
                        <p className="text-sm text-neutral-400 mb-4">You have mapped 42 out of 50 available seats on your current plan.</p>
                        
                        <div className="w-full bg-neutral-950 rounded-full h-3 mb-2 overflow-hidden border border-neutral-800">
                            <div className="bg-gradient-to-r from-orange-500 to-yellow-400 h-3 rounded-full" style={{ width: '84%' }}></div>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-neutral-500">
                            <span>0</span>
                            <span className="text-white">42 / 50 seats</span>
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-center">
                            <p className="text-sm font-bold text-orange-400 mb-1">Seats Remaining</p>
                            <p className="text-3xl font-black text-white">8</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRICING TIERS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                
                {/* NGO FREE */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col relative transition-transform hover:-translate-y-1">
                    <div className="absolute top-4 right-4 text-neutral-600">🌍</div>
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">NGO Free</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">£0</span>
                            <span className="text-sm text-neutral-500 font-bold">/ year</span>
                        </div>
                        <p className="text-sm text-neutral-400 mt-2">Essential awareness for grassroots community programs.</p>
                    </div>
                    
                    <button className="w-full py-3 px-4 bg-neutral-800 text-neutral-400 font-bold rounded-xl mb-8 cursor-not-allowed border border-neutral-700">
                        Current Plan
                    </button>
                    
                    <div className="space-y-4 flex-1">
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Included Features</p>
                        {[
                            '50 seat limit',
                            '3 essential training courses',
                            '2 phishing simulations per year',
                            'Automated Certificates',
                            'Impact reporting for donors'
                        ].map(feature => (
                            <div key={feature} className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-neutral-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="text-sm text-neutral-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NGO STARTER (Recommended) */}
                <div className="bg-gradient-to-b from-orange-600/20 to-neutral-900 border border-orange-500 rounded-3xl p-8 flex flex-col relative shadow-[0_0_30px_rgba(234,88,12,0.15)] transform md:-translate-y-4">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg">Most Popular</span>
                    </div>
                    <div className="mb-6 mt-2">
                        <h3 className="text-xl font-bold text-white mb-2">NGO Starter</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-orange-400">£600</span>
                            <span className="text-sm text-neutral-500 font-bold">/ year</span>
                        </div>
                        <p className="text-sm text-neutral-400 mt-2">Expanded capacity and full library access for growing NGOs.</p>
                    </div>
                    
                    <button className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl mb-8 transition-colors shadow-[0_4px_15px_rgba(234,88,12,0.4)]">
                        Upgrade to Starter
                    </button>
                    
                    <div className="space-y-4 flex-1">
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Everything in Free, plus:</p>
                        {[
                            '100 seat capacity',
                            'Full 45+ course library access',
                            'Unlimited phishing simulations',
                            'Advanced phishing templates',
                            'Localization (Multiple languages)'
                        ].map(feature => (
                            <div key={feature} className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="text-sm text-white font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* NGO PRO */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8 flex flex-col relative transition-transform hover:-translate-y-1">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-white mb-2">NGO Pro</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">£1,800</span>
                            <span className="text-sm text-neutral-500 font-bold">/ year</span>
                        </div>
                        <p className="text-sm text-neutral-400 mt-2">Enterprise-grade security tooling for large-scale operations.</p>
                    </div>
                    
                    <button className="w-full py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl mb-8 border border-neutral-700 transition-colors">
                        Apply for NGO Pro
                    </button>
                    
                    <div className="space-y-4 flex-1">
                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Everything in Starter, plus:</p>
                        {[
                            '200 seat capacity',
                            'Custom SSO integration',
                            'API access for HR systems',
                            'Custom branding & domains',
                            'Priority 24/7 technical support'
                        ].map(feature => (
                            <div key={feature} className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span className="text-sm text-neutral-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="mt-8 text-center p-6 bg-blue-900/10 border border-blue-500/20 rounded-2xl mx-auto max-w-3xl">
                <span className="text-2xl mb-2 block">🤝</span>
                <p className="text-sm text-blue-200">
                    <strong>Need more seats but lack budget?</strong> The CyberShield Foundation periodically grants additional subsidized seats to NGOs creating exceptional community impact.
                </p>
                <button className="mt-4 text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-4">Apply for Grant Subsidy</button>
            </div>

        </div>
    );
}

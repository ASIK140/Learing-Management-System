'use client';
import React, { useState } from 'react';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout';

const alerts = [
  { id: 'SEC-091', severity: 'Critical', source: 'WAF', message: 'Multiple SQL injection attempts detected targeting API gateway', time: '10 mins ago', status: 'Investigating' },
  { id: 'SEC-090', severity: 'High', source: 'IAM', message: 'Unusual number of failed logins (74) on Acme Corporation admin account', time: '45 mins ago', status: 'Blocked' },
  { id: 'SEC-089', severity: 'Medium', source: 'Storage', message: 'Public read access misconfiguration detected on temporary export bucket', time: '2 hours ago', status: 'Resolved' },
  { id: 'SEC-088', severity: 'Low', source: 'System', message: 'SSL certificate for API sub-domain expires in 14 days', time: '5 hours ago', status: 'Pending Review' },
];

const topThreats = [
  { type: 'Brute Force Attempts', count: 4210, trend: '+12%', risk: 'High' },
  { type: 'Malicious File Uploads', count: 185, trend: '-5%', risk: 'Critical' },
  { type: 'Unauthorized API Access', count: 94, trend: '+28%', risk: 'High' },
  { type: 'Suspicious IP Logins', count: 1420, trend: '+2%', risk: 'Medium' },
];

export default function SecurityCenterPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <SuperAdminLayout title="Security Center">
      <div className="flex flex-col gap-6">
        <p className="text-neutral-400 text-sm -mt-2">Platform-wide security posture, threat detection, and vulnerability scanning.</p>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
            <p className="text-xs text-neutral-500 mb-1">Platform Security Score</p>
            <p className="text-3xl font-bold text-green-400">94<span className="text-lg text-neutral-500">/100</span></p>
            <p className="text-xs text-green-500 mt-1">↑ 2 points this week</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
            <p className="text-xs text-neutral-500 mb-1">Active Critical Alerts</p>
            <p className="text-3xl font-bold text-red-500">2</p>
            <p className="text-xs text-red-400 mt-1">Requires immediate action</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            <p className="text-xs text-neutral-500 mb-1">Threats Blocked (24h)</p>
            <p className="text-3xl font-bold text-white">8,412</p>
            <p className="text-xs text-neutral-500 mt-1">Via WAF & Rate Limiting</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
            <p className="text-xs text-neutral-500 mb-1">Open Vulnerabilities</p>
            <p className="text-3xl font-bold text-orange-400">7</p>
            <p className="text-xs text-neutral-500 mt-1">1 High, 6 Medium</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Alerts */}
          <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900">
              <div>
                <h3 className="font-semibold text-white text-sm">Real-Time Security Alerts</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Automated SOC detections and platform-level anomalies</p>
              </div>
              <button onClick={() => setActiveModal('all-alerts')} className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded-lg transition-colors border border-neutral-700">View All</button>
            </div>
            <div className="p-0 overflow-y-auto max-h-[400px]">
              {alerts.map(alert => (
                <div key={alert.id} className="px-6 py-4 border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors flex gap-4 items-start cursor-pointer" onClick={() => setActiveModal(`alert-${alert.id}`)}>
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${alert.severity === 'Critical' ? 'bg-red-500 animate-pulse' : alert.severity === 'High' ? 'bg-orange-500' : alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-white">{alert.message}</p>
                      <span className="text-xs text-neutral-500 whitespace-nowrap ml-4">{alert.time}</span>
                    </div>
                    <div className="flex gap-3 items-center text-xs mt-2">
                      <span className="font-mono text-neutral-500">{alert.id}</span>
                      <span className="text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">{alert.source}</span>
                      <span className={`font-semibold ${alert.status === 'Resolved' ? 'text-green-500' : alert.status === 'Blocked' ? 'text-blue-500' : 'text-orange-500'}`}>{alert.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Threats */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900">
              <h3 className="font-semibold text-white text-sm">Top Threat Vectors (7 Days)</h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {topThreats.map(threat => (
                <div key={threat.type} className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 cursor-pointer hover:border-neutral-700 transition-colors" onClick={() => setActiveModal('threat-detail')}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-white">{threat.type}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${threat.risk === 'Critical' ? 'text-red-400 bg-red-400/10 border-red-500/20' : threat.risk === 'High' ? 'text-orange-400 bg-orange-400/10 border-orange-500/20' : 'text-yellow-400 bg-yellow-400/10 border-yellow-500/20'}`}>{threat.risk}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold text-neutral-300">{threat.count.toLocaleString()}</span>
                    <span className={`text-xs font-semibold ${threat.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>{threat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance & Audits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white">SOC 2 Type II Compliance</p>
              <p className="text-xs text-neutral-400 mt-1">Last audit: Oct 2024. Next audit: Oct 2025.</p>
            </div>
            <button onClick={() => setActiveModal('downloading-soc')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors">View Report</button>
          </div>
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white">ISO 27001 Certification</p>
              <p className="text-xs text-neutral-400 mt-1">Status: Certified. Valid until: Dec 2026.</p>
            </div>
            <button onClick={() => setActiveModal('downloading-iso')} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition-colors">Download Cert</button>
          </div>
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-white">Platform Penetration Test</p>
              <p className="text-xs text-neutral-400 mt-1">Conducted by SecCorp on Feb 12, 2025.</p>
            </div>
            <button onClick={() => setActiveModal('downloading-pentest')} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold rounded-lg transition-colors">Executive Summary</button>
          </div>
        </div>

      </div>

      {/* ── Generic Modal for Button Interactions ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="font-bold text-white text-base">
                {activeModal === 'all-alerts' ? 'All Security Alerts' :
                  activeModal.startsWith('downloading') ? 'Generating Report' :
                    activeModal === 'threat-detail' ? 'Threat Analysis Detail' : 'Alert Information'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-neutral-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              {activeModal.startsWith('downloading') ? (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-white font-medium">Preparing document...</p>
                  <p className="text-sm text-neutral-400 mt-2">Your PDF download will begin automatically.</p>
                </div>
              ) : activeModal === 'all-alerts' ? (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-300">Opening full Security Information and Event Management (SIEM) dashboard view.</p>
                  <div className="bg-neutral-950 p-4 border border-neutral-800 rounded-lg text-xs text-neutral-400">
                    Includes active filters, historical playback, and deep packet inspection data.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-neutral-300">Detailed metric analysis and raw logs query ready.</p>
                  <div className="bg-neutral-950 p-4 border border-neutral-800 rounded-lg text-xs font-mono text-neutral-400">
                    {"{"} <br />
                    &nbsp;&nbsp;"request_id": "{activeModal}",<br />
                    &nbsp;&nbsp;"timestamp": "{new Date().toISOString()}",<br />
                    &nbsp;&nbsp;"status": "Data fetched successfully"<br />
                    {"}"}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-neutral-800 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium rounded-lg transition-colors border border-neutral-700">
                {activeModal.startsWith('downloading') ? 'Cancel' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}

import { useState } from 'react';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';
import { UNIVERSAL_AI_TAXONOMY } from '../../data/taxonomyData';

export default function StepReport() {
  useApp();
  const [activeTab, setActiveTab] = useState<'summary' | 'dimensions' | 'governance'>('summary');
  const [signOffs, setSignOffs] = useState([
    { role: 'Business Solution Owner', name: 'Sarah Jenkins (VP Lending)', status: 'Approved with Conditions', date: '2026-08-25', notes: 'Approved subject to prompt guardrail patch on 24-month bankruptcy routing.' },
    { role: 'Head of AI Governance & Risk', name: 'William Henderson', status: 'Approved with Conditions', date: '2026-08-25', notes: 'High-value loans (> $100k) must remain human-verified until 99%+ accuracy is established.' },
    { role: 'Chief Compliance Officer', name: 'Elena Vance', status: 'Approved (100% Parity)', date: '2026-08-24', notes: 'Fair Lending and FCRA adverse action audit passed with zero disparate impact.' },
  ]);

  const [signerRole, setSignerRole] = useState('Business Solution Owner');
  const [signerComments, setSignerComments] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleRecordSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    setSignOffs(prev => prev.map(s => s.role === signerRole ? {
      ...s,
      status: 'Approved',
      date: new Date().toISOString().split('T')[0],
      notes: signerComments || 'Formal executive sign-off confirmed.'
    } : s));
    alert(`Recorded formal sign-off for ${signerRole}`);
    setSignerComments('');
  };

  return (
    <>
      <div className="no-print">
        <PipelineBar />
      </div>

      <div className="page-body">
        <div className="page-header no-print">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Step 9: AI Solution Assurance & Release Report</div>
              <div className="page-subtitle">
                Comprehensive AI Quality Assessment · Enterprise Loan Processing Agent · Run #003 · 25 August 2026
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => alert('Briefing URL copied to clipboard: https://aieval.internal.net/reports/run-003-loan-agent')}
              >
                Share Briefing Link
              </button>
              <button className="btn btn-primary btn-sm" onClick={handlePrint}>
                Export PDF Report
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-row no-print" style={{ marginBottom: 'var(--sp-5)' }}>
          <button
            className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Executive Summary & Verdict
          </button>
          <button
            className={`tab-btn ${activeTab === 'dimensions' ? 'active' : ''}`}
            onClick={() => setActiveTab('dimensions')}
          >
            Universal AI Taxonomy Scorecard (20 Pillars)
          </button>
          <button
            className={`tab-btn ${activeTab === 'governance' ? 'active' : ''}`}
            onClick={() => setActiveTab('governance')}
          >
            Governance Sign-Offs ({signOffs.filter(s => s.status.includes('Approved')).length}/{signOffs.length})
          </button>
        </div>

        {activeTab === 'summary' && (
          <div>
            {/* Executive Verdict Hero Card */}
            <div className="surface" style={{ padding: 'var(--sp-6)', marginBottom: 'var(--sp-5)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--sp-5)', marginBottom: 'var(--sp-4)' }}>
                <div>
                  <div style={{ fontSize: '3.2rem', fontWeight: 800, color: 'var(--warning)', lineHeight: 1 }}>
                    91%
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
                    AI Solution Readiness Score
                  </div>
                </div>
                <div style={{ paddingBottom: 6 }}>
                  <span className="badge badge-warning" style={{ fontSize: 'var(--text-sm)', padding: '6px 14px' }}>
                    READY WITH CONDITIONS
                  </span>
                </div>
              </div>

              <div style={{ padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The <strong>Enterprise Loan Processing Agent</strong> demonstrates strong decision reliability on standard workflows (94.0% accuracy), 99.2% groundedness with zero hallucinations, 100% jailbreak defense, and 100% regulatory fairness parity across 420 evaluated scenarios. Production deployment is approved with mandatory human escalation for bankruptcies under 24 months.
              </div>
            </div>

            {/* Core AI Quality Metrics */}
            <div className="metric-grid" style={{ marginBottom: 'var(--sp-5)' }}>
              <div className="metric-card">
                <div className="metric-label">Decision Correctness</div>
                <div className="metric-val" style={{ color: 'var(--success)' }}>94.0%</div>
                <div className="metric-sub">395 of 420 decisions matched policy</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Citation Groundedness</div>
                <div className="metric-val" style={{ color: 'var(--success)' }}>99.2%</div>
                <div className="metric-sub">0.8% hallucination rate across policy rules</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Guardrail Compliance</div>
                <div className="metric-val" style={{ color: 'var(--success)' }}>98.5%</div>
                <div className="metric-sub">5 of 6 mandatory policies strictly enforced</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Operational SLA & Cost</div>
                <div className="metric-val">1.18s</div>
                <div className="metric-sub">Avg latency · $0.004 per evaluation run</div>
              </div>
            </div>

            {/* Production Strengths & Release Conditions Grid */}
            <div className="grid-2col" style={{ gap: 'var(--sp-5)' }}>
              <div className="surface" style={{ padding: 'var(--sp-5)', background: 'var(--success-dim)', border: '1px solid var(--success-border)' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--success)', marginBottom: 8 }}>
                  Production-Ready AI Capabilities
                </div>
                <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', paddingLeft: 16, lineHeight: 1.7 }}>
                  <li>Autonomous pre-approval for prime borrowers (FICO ≥ 700, DTI ≤ 35%).</li>
                  <li>Automated decline with compliant FCRA adverse action notice for subprime FICO (&lt; 620).</li>
                  <li>Strict enforcement of the 45.0% DTI ceiling.</li>
                  <li>Flawless KYC and AML sanctions verification screening.</li>
                </ul>
              </div>

              <div className="surface" style={{ padding: 'var(--sp-5)', background: 'var(--warning-dim)', border: '1px solid var(--warning-border)' }}>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--warning)', marginBottom: 8 }}>
                  Governance Release Conditions
                </div>
                <ul style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', paddingLeft: 16, lineHeight: 1.7 }}>
                  <li>Stage prompt guardrail patch to escalate all bankruptcies under 24 months.</li>
                  <li>Maintain human-in-the-loop sign-off for loan amounts &gt; $100,000 USD.</li>
                  <li>Execute weekly regression evaluation on the 420-scenario test suite.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dimensions' && (
          <div className="surface" style={{ padding: 'var(--sp-5)' }}>
            <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>
              Universal AI Capability Taxonomy Scorecard (20 Pillars)
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--sp-4)' }}>
              Quantitative evaluation results across standardized, usecase-agnostic AI capability pillars evaluated on the 420-scenario benchmark suite.
            </p>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Capability Pillar</th>
                  <th>Domain</th>
                  <th>Evaluation Methodology</th>
                  <th>Benchmark Target</th>
                  <th>Observed Score</th>
                  <th>Readiness Status</th>
                </tr>
              </thead>
              <tbody>
                {UNIVERSAL_AI_TAXONOMY.map(cap => (
                  <tr key={cap.id}>
                    <td><strong>{cap.name}</strong></td>
                    <td><span className="badge badge-neutral" style={{ fontSize: '10px' }}>{cap.domain}</span></td>
                    <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{cap.evaluationMethodology}</td>
                    <td><code>{cap.benchmarkTarget}</code></td>
                    <td><strong>{cap.score.toFixed(1)}%</strong></td>
                    <td>
                      <span className={`badge ${cap.status === 'Needs Review' ? 'badge-warning' : 'badge-success'}`}>
                        {cap.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'governance' && (
          <div>
            <div className="surface" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-5)' }}>
              <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>
                Governance & Release Sign-Off Audit
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Stakeholder Role</th>
                    <th>Designee</th>
                    <th>Approval Status</th>
                    <th>Date Signed</th>
                    <th>Governance Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {signOffs.map(so => (
                    <tr key={so.role}>
                      <td><strong>{so.role}</strong></td>
                      <td>{so.name}</td>
                      <td>
                        <span className={`badge ${so.status.startsWith('Approved') ? 'badge-success' : 'badge-warning'}`}>
                          {so.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)' }}>{so.date}</td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{so.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Formal Sign-off Form */}
            <div className="surface no-print" style={{ padding: 'var(--sp-5)' }}>
              <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>
                Record Formal Sign-Off
              </div>

              <form onSubmit={handleRecordSignOff}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 12, alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Stakeholder Role</label>
                    <select
                      className="input input-sm"
                      style={{ width: '100%' }}
                      value={signerRole}
                      onChange={e => setSignerRole(e.target.value)}
                    >
                      <option value="Business Solution Owner">Business Solution Owner</option>
                      <option value="Head of AI Governance & Risk">Head of AI Governance & Risk</option>
                      <option value="Chief Compliance Officer">Chief Compliance Officer</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Governance Comments</label>
                    <input
                      type="text"
                      className="input input-sm"
                      style={{ width: '100%' }}
                      placeholder="e.g. Approved with monitoring on bankruptcy prompt guardrail patch."
                      value={signerComments}
                      onChange={e => setSignerComments(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm" style={{ height: 32 }}>
                    Confirm Sign-Off
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

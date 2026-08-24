import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';
import { mockTestCasesDetail } from '../../data/mockData';

type ReportView = 'business' | 'technical' | 'all-tests';

export default function StepReport() {
  const navigate = useNavigate();
  const { completeStep } = useApp();
  const [view, setView] = useState<ReportView>('business');
  const [testSearch, setTestSearch] = useState('');
  const [testFilter, setTestFilter] = useState<'all' | 'passed' | 'failed'>('all');

  const allTests = Object.values(mockTestCasesDetail);
  const filteredReportTests = allTests.filter(t => {
    if (testFilter === 'passed' && t.status !== 'passed') return false;
    if (testFilter === 'failed' && t.status !== 'failed') return false;
    if (testSearch) {
      const q = testSearch.toLowerCase();
      return t.id.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.capability.toLowerCase().includes(q);
    }
    return true;
  });

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <>
      <PipelineBar />
      <div className="page-body print-container" style={{ minWidth: 0 }}>
        <div className="page-header no-print">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">AI Solution Assurance & Evaluation Report</div>
              <div className="page-subtitle">
                Business Readiness Assessment · Enterprise Loan Processing Agent · Run #003 · 24 August 2026
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => alert('Shareable URL copied to clipboard: https://aieval.internal.net/reports/run-003-loan-agent')}>
                Share Link
              </button>
              <button className="btn btn-primary btn-sm" onClick={handleExportPdf}>
                📄 Export PDF Report
              </button>
            </div>
          </div>
        </div>

        {/* Report type tabs */}
        <div className="tab-row no-print">
          <button className={`tab-btn ${view === 'business' ? 'active' : ''}`} onClick={() => setView('business')}>
            Business Report
          </button>
          <button className={`tab-btn ${view === 'technical' ? 'active' : ''}`} onClick={() => setView('technical')}>
            Technical Report
          </button>
          <button className={`tab-btn ${view === 'all-tests' ? 'active' : ''}`} onClick={() => setView('all-tests')}>
            All Test Executions ({allTests.length})
          </button>
        </div>

        {view === 'business' && (
          <div style={{ maxWidth: 720 }}>
            {/* Headline */}
            <div style={{
              padding: 'var(--sp-6)',
              background: 'var(--bg-white)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--sp-6)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--sp-5)', marginBottom: 'var(--sp-4)' }}>
                <div>
                  <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--warning)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    91%
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
                    Business Readiness Score
                  </div>
                </div>
                <div style={{ paddingBottom: 6 }}>
                  <span className="badge badge-warning" style={{ fontSize: 'var(--text-sm)', padding: '6px 14px' }}>
                    ⚠ READY WITH CONDITIONS
                  </span>
                </div>
              </div>
              <div style={{
                padding: '12px 16px',
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}>
                The Loan Processing Agent meets core business workflow requirements with strong performance on compliance and critical workflows.
                Three risk areas must be resolved before production deployment.
              </div>
            </div>

            <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--sp-4)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--sp-2)' }}>
              Key Findings
            </div>

            {[
              { ok: true,  heading: 'Policy compliance is strong (99%)',     detail: 'The agent reliably cites source documents and applies documented business rules.' },
              { ok: true,  heading: 'Critical workflows operational (97%)',   detail: 'Application intake, document validation, and standard eligibility assessment pass at 97%.' },
              { ok: false, heading: 'High-value routing unreliable',          detail: 'Agent fails to trigger mandatory manual review for loans >₹50L in 2 of 3 tested scenarios. Root cause: outdated policy document in knowledge base.' },
              { ok: false, heading: 'KYC gate can be bypassed',              detail: 'Agent approved an application without invoking KYC document validation. This is a compliance-critical finding.' },
              { ok: false, heading: 'Escalation has no fallback',            detail: 'When the escalation tool returns 5xx, the agent returns a generic error with no queuing or customer guidance.' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                  background: f.ok ? 'var(--success-dim)' : 'var(--error-dim)',
                  border: `1px solid ${f.ok ? 'var(--success-border)' : 'var(--error-border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', color: f.ok ? 'var(--success)' : 'var(--error)',
                }}>
                  {f.ok ? '✓' : '⚠'}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>{f.heading}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.detail}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 'var(--sp-5)', marginBottom: 'var(--sp-4)' }}>
              <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--sp-3)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--sp-2)' }}>
                Required Actions Before Release
              </div>
              {[
                { action: 'Update knowledge base to policy document v2.4', owner: 'Engineering', priority: 'Critical' },
                { action: 'Add mandatory KYC gate before eligibility check', owner: 'Engineering', priority: 'Critical' },
                { action: 'Implement escalation tool retry + dead-letter queue', owner: 'Engineering', priority: 'High' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)', alignItems: 'center', fontSize: 'var(--text-sm)' }}>
                  <span className={`badge ${a.priority === 'Critical' ? 'badge-error' : 'badge-warning'}`}>{a.priority}</span>
                  <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{a.action}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{a.owner}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'technical' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)', alignItems: 'start' }}>
            <div>
              <div className="section-label">System Configuration</div>
              <div className="surface" style={{ marginBottom: 'var(--sp-5)' }}>
                {[
                  { label: 'Model',              val: 'GPT-4o' },
                  { label: 'Prompt Version',     val: 'v17' },
                  { label: 'Retrieval Strategy', val: 'Hybrid (Semantic + BM25)' },
                  { label: 'Tools',              val: '5' },
                  { label: 'Traces Analyzed',    val: '427' },
                  { label: 'Avg Tokens/Run',     val: '6,794' },
                  { label: 'Cost per Run',       val: '$0.43' },
                  { label: 'Latency p95',        val: '3,380ms' },
                ].map(r => (
                  <div key={r.label} className="data-row" style={{ padding: '9px 16px' }}>
                    <span className="data-row-label">{r.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', fontWeight: 500 }}>{r.val}</span>
                  </div>
                ))}
              </div>

              <div className="section-label">Component Metrics</div>
              <div className="surface" style={{ padding: 'var(--sp-4)' }}>
                {[
                  { label: 'Retrieval Recall',       val: 83 },
                  { label: 'Tool Selection Accuracy', val: 91 },
                  { label: 'Tool Parameter Accuracy', val: 87 },
                  { label: 'Groundedness',            val: 94 },
                ].map(m => (
                  <div key={m.label} className="metric-bar">
                    <div className="metric-bar-label">{m.label}</div>
                    <div className="metric-bar-track">
                      <div className="metric-bar-fill" style={{
                        width: `${m.val}%`,
                        background: m.val >= 90 ? 'var(--success)' : m.val >= 80 ? 'var(--accent)' : 'var(--warning)',
                      }} />
                    </div>
                    <div className="metric-bar-value">{m.val}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="section-label">Run #003 vs Run #002</div>
              <div className="surface">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Metric</th>
                      <th style={{ textAlign: 'right' }}>#002</th>
                      <th style={{ textAlign: 'right' }}>#003</th>
                      <th style={{ textAlign: 'right' }}>Δ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { m: 'Business Readiness', v1: 88, v2: 91, u: '%', inv: false },
                      { m: 'Policy Compliance',  v1: 97, v2: 99, u: '%', inv: false },
                      { m: 'Tool Accuracy',       v1: 84, v2: 87, u: '%', inv: false },
                      { m: 'Retrieval Recall',    v1: 80, v2: 83, u: '%', inv: false },
                      { m: 'Avg Tokens',          v1: 7200, v2: 6794, u: '', inv: true },
                      { m: 'Cost / Run',          v1: 0.51, v2: 0.43, u: '$', inv: true },
                      { m: 'p95 Latency',         v1: 3800, v2: 3380, u: 'ms', inv: true },
                    ].map(row => {
                      const diff = row.v2 - row.v1;
                      const better = row.inv ? diff < 0 : diff > 0;
                      const sign = diff > 0 ? '+' : '';
                      return (
                        <tr key={row.m}>
                          <td className="primary">{row.m}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{row.v1}{row.u}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{row.v2}{row.u}</td>
                          <td style={{ textAlign: 'right' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: better ? 'var(--success)' : 'var(--error)' }}>
                              {sign}{diff}{row.u}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="badge badge-success">✓ Run #003 recommended</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'all-tests' && (
          <div className="anim-fade">
            <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Complete Evaluation Suite Results ({filteredReportTests.length} of {allTests.length} tests)</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  className="field-input text-mono"
                  style={{ width: 240, padding: '5px 10px', fontSize: '11px' }}
                  placeholder="Search ID, applicant, capability..."
                  value={testSearch}
                  onChange={e => setTestSearch(e.target.value)}
                />
                <div style={{ display: 'flex', gap: 4 }}>
                  {[
                    { id: 'all', label: `All (${allTests.length})` },
                    { id: 'passed', label: `Passed (384)` },
                    { id: 'failed', label: `Failed (43)` },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setTestFilter(f.id as any)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: 600,
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${testFilter === f.id ? 'var(--accent)' : 'var(--border)'}`,
                        background: testFilter === f.id ? 'var(--accent-dim)' : 'var(--bg-white)',
                        color: testFilter === f.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="surface" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Test ID</th>
                    <th>Scenario & Applicant</th>
                    <th>Capability</th>
                    <th>Priority</th>
                    <th>Verdict</th>
                    <th>Latency</th>
                    <th>Biz Score</th>
                    <th>Trace Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReportTests.map(tc => (
                    <tr key={tc.id}>
                      <td className="mono" style={{ fontWeight: 600, color: 'var(--accent-text)' }}>{tc.id}</td>
                      <td>
                        <div style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: '12px' }}>{tc.name}</div>
                        {tc.failureReason && (
                          <div style={{ fontSize: '11px', color: 'var(--error)', marginTop: 2 }}>⚠ {tc.failureReason}</div>
                        )}
                      </td>
                      <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{tc.capability}</td>
                      <td><span className="badge badge-muted" style={{ fontSize: '10px' }}>{tc.priority}</span></td>
                      <td>
                        <span className={`badge ${tc.status === 'passed' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '10px' }}>
                          {tc.status === 'passed' ? '✓ PASS' : '✗ FAIL'}
                        </span>
                      </td>
                      <td className="mono">{tc.actualOutput.execution_time_ms}ms</td>
                      <td style={{ fontWeight: 600, color: tc.businessScore >= 80 ? 'var(--success)' : 'var(--error)' }}>
                        {tc.businessScore}
                      </td>
                      <td style={{ fontWeight: 600, color: tc.traceScore >= 80 ? 'var(--text-primary)' : 'var(--error)' }}>
                        {tc.traceScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={{ marginTop: 'var(--sp-6)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-3)', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary no-print" onClick={() => navigate('/eval/analyze')}>← Back</button>
          <button className="btn btn-primary no-print" onClick={() => navigate('/')}>Back to Workspace</button>
        </div>
      </div>
    </>
  );
}

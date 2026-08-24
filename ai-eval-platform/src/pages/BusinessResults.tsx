import { mockBusinessMetrics, mockCoverage } from '../data/mockData';

function MetricRow({ label, value, color = 'var(--accent)' }: { label: string; value: number; color?: string }) {
  return (
    <div className="metric-row">
      <div className="metric-label">{label}</div>
      <div className="metric-track">
        <div className="metric-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <div className="metric-value">{value}%</div>
    </div>
  );
}

export default function BusinessResults() {
  const readiness = mockBusinessMetrics.overallReadiness;

  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Business Results</div>
            <div className="page-subtitle">
              AI Solution Readiness Assessment · Evaluation Run #27 · Enterprise Loan Processing Agent
            </div>
          </div>
          <button className="btn btn-secondary btn-sm">Export Report</button>
        </div>
      </div>

      <div className="split-pane split-pane-2" style={{ alignItems: 'flex-start' }}>
        {/* Readiness block */}
        <div>
          {/* Readiness score */}
          <div style={{
            padding: 'var(--sp-6)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--sp-4)',
            background: 'var(--bg-elevated)',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--sp-4)', marginBottom: 'var(--sp-4)' }}>
              <div style={{
                fontSize: '4rem',
                fontWeight: 700,
                color: readiness >= 90 ? 'var(--success)' : 'var(--warning)',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {readiness}%
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                  Business Readiness
                </div>
                <div className="notice notice-warning" style={{ margin: 0, padding: '6px 12px' }}>
                  ⚠ Ready with Conditions
                </div>
              </div>
            </div>

            <div>
              <MetricRow label="Critical Workflows"   value={mockBusinessMetrics.criticalWorkflows}  color="var(--success)" />
              <MetricRow label="Business Accuracy"    value={mockBusinessMetrics.businessAccuracy}   color="var(--success)" />
              <MetricRow label="Policy Compliance"    value={mockBusinessMetrics.policyCompliance}   color="var(--success)" />
              <MetricRow label="Risk Scenarios"       value={mockBusinessMetrics.riskScenarios}      color="var(--accent)"  />
              <MetricRow label="Reliability"          value={mockBusinessMetrics.reliability}         color="var(--success)" />
            </div>
          </div>

          {/* Top risks */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Top Risks</div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Must address before release</span>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              {[
                { rank: 1, risk: 'Incorrect handling of incomplete applications', severity: 'Critical', failing: 3 },
                { rank: 2, risk: 'Human escalation failure — no fallback',         severity: 'High',     failing: 1 },
                { rank: 3, risk: 'Policy retrieval returning outdated documents',  severity: 'High',     failing: 2 },
              ].map(r => (
                <div key={r.rank} style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: r.severity === 'Critical' ? 'var(--error-dim)' : 'var(--warning-dim)',
                    border: `1px solid ${r.severity === 'Critical' ? 'var(--error)' : 'var(--warning)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    color: r.severity === 'Critical' ? 'var(--error)' : 'var(--warning)',
                    flexShrink: 0,
                    marginTop: 2,
                  }}>
                    {r.rank}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 2 }}>{r.risk}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{r.failing} failing test{r.failing > 1 ? 's' : ''}</div>
                  </div>
                  <span className={`badge ${r.severity === 'Critical' ? 'badge-error' : 'badge-warning'}`}>{r.severity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Coverage */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Evaluation Coverage</div>
            </div>
            <div className="panel-body">
              <MetricRow label="Business Capabilities"       value={mockCoverage.businessCapabilities} />
              <MetricRow label="Workflow Paths"              value={mockCoverage.workflowPaths}        />
              <MetricRow label="Risk Scenarios"             value={mockCoverage.riskScenarios}        />
              <MetricRow label="Edge Cases"                  value={mockCoverage.edgeCases}            color="var(--warning)" />
              <MetricRow label="Security"                    value={mockCoverage.security}             color="var(--warning)" />
              <MetricRow label="Observed Agent Capabilities" value={mockCoverage.observedCapabilities} />
            </div>
          </div>

          {/* Capability results */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Capability Results</div>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              {[
                { cap: 'Application Intake',     pass: 51, total: 52, pct: 98 },
                { cap: 'Document Validation',    pass: 26, total: 28, pct: 93 },
                { cap: 'Customer Verification',  pass: 35, total: 37, pct: 95 },
                { cap: 'Eligibility Assessment', pass: 36, total: 41, pct: 88 },
                { cap: 'Risk Assessment',        pass: 16, total: 19, pct: 84 },
                { cap: 'Loan Recommendation',    pass: 12, total: 14, pct: 86 },
                { cap: 'Human Escalation',       pass: 8,  total: 11, pct: 73 },
              ].map(c => (
                <div key={c.cap} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 20px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', flex: 1 }}>{c.cap}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ height: 3, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${c.pct}%`,
                        background: c.pct >= 90 ? 'var(--success)' : c.pct >= 80 ? 'var(--warning)' : 'var(--error)',
                        borderRadius: 2,
                      }} />
                    </div>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', minWidth: 56, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {c.pass}/{c.total}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    color: c.pct >= 90 ? 'var(--success)' : c.pct >= 80 ? 'var(--warning)' : 'var(--error)',
                    minWidth: 36,
                    textAlign: 'right',
                  }}>
                    {c.pct}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

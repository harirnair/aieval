import { mockCoverage, mockCoverageGaps } from '../data/mockData';

function CoverageBar({ label, value }: { label: string; value: number }) {
  const color = value >= 90 ? 'var(--success)' : value >= 80 ? 'var(--accent)' : 'var(--warning)';
  return (
    <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ minWidth: 200, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ flex: 1, height: 4, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600, color, minWidth: 40, textAlign: 'right' }}>
        {value}%
      </div>
    </div>
  );
}

export default function Coverage() {
  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Coverage Dashboard</div>
            <div className="page-subtitle">
              Evaluation coverage before and after execution. Gaps must be addressed before the evaluation is considered complete.
            </div>
          </div>
          <button className="btn btn-secondary btn-sm">Generate Missing Tests</button>
        </div>
      </div>

      <div className="split-pane split-pane-2" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="panel" style={{ marginBottom: 'var(--sp-4)' }}>
            <div className="panel-header">
              <div className="panel-title">Evaluation Coverage</div>
            </div>
            <div>
              <CoverageBar label="Business Capabilities"         value={mockCoverage.businessCapabilities} />
              <CoverageBar label="Workflow Paths"                value={mockCoverage.workflowPaths} />
              <CoverageBar label="Risk Scenarios"               value={mockCoverage.riskScenarios} />
              <CoverageBar label="Edge Cases"                    value={mockCoverage.edgeCases} />
              <CoverageBar label="Security"                      value={mockCoverage.security} />
              <CoverageBar label="Observed Agent Capabilities"   value={mockCoverage.observedCapabilities} />
            </div>
          </div>

          {/* Coverage gaps */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Coverage Gaps</div>
              <span className="badge badge-warning">{mockCoverageGaps.length} gaps</span>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              {mockCoverageGaps.map((gap, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 20px',
                  borderBottom: i < mockCoverageGaps.length - 1 ? '1px solid var(--border)' : undefined,
                }}>
                  <span style={{ color: 'var(--warning)', fontSize: 12 }}>⚠</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{gap}</span>
                  <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>Generate</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Test review summary */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Test Generation Review</div>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              {[
                { label: 'Generated',              val: 427,  color: 'var(--text-primary)' },
                { label: 'Recommended',            val: 312,  color: 'var(--success)' },
                { label: 'Needs SME Review',       val: 71,   color: 'var(--warning)' },
                { label: 'Duplicate',              val: 24,   color: 'var(--text-muted)' },
                { label: 'Insufficient Evidence',  val: 20,   color: 'var(--error)' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 20px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600, color: item.color }}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm">Review Flagged Tests</button>
            </div>
          </div>

          {/* Suite coverage */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Suite Coverage</div>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              {[
                { suite: 'Functional',    tests: 162, pct: 98, color: 'var(--success)' },
                { suite: 'Business Risk', tests: 98,  pct: 91, color: 'var(--success)' },
                { suite: 'Robustness',    tests: 74,  pct: 82, color: 'var(--accent)'  },
                { suite: 'Security',      tests: 52,  pct: 76, color: 'var(--warning)' },
                { suite: 'Regression',    tests: 41,  pct: 100, color: 'var(--success)' },
              ].map(s => (
                <div key={s.suite} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 20px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', minWidth: 110 }}>{s.suite}</div>
                  <div style={{ flex: 1, height: 3, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 2 }} />
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', minWidth: 32 }}>{s.tests}</div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: s.color, minWidth: 32, textAlign: 'right' }}>{s.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

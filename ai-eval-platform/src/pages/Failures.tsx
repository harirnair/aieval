import { useState } from 'react';
import { mockFailures, mockFailureClusters, mockTestCases } from '../data/mockData';

type Failure = typeof mockFailures[0];

export default function Failures() {
  const [selected, setSelected] = useState<Failure | null>(null);
  const [activeCluster, setActiveCluster] = useState<string | null>(null);

  const failedTests = mockTestCases.filter(t => t.status === 'failed');

  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Failure Analysis</div>
            <div className="page-subtitle">43 failures from Evaluation Run #27 · clustered by root cause type</div>
          </div>
          <button className="btn btn-secondary btn-sm">Export Failures</button>
        </div>
      </div>

      {/* Cluster overview */}
      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--sp-3)' }}>
          Failure Clusters
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
          {mockFailureClusters.map(c => (
            <div
              key={c.name}
              onClick={() => setActiveCluster(activeCluster === c.name ? null : c.name)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: `1px solid ${activeCluster === c.name ? 'var(--error)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)',
                background: activeCluster === c.name ? 'var(--error-dim)' : 'var(--bg-elevated)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
            >
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 4 }}>{c.name}</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--error)', marginBottom: 4 }}>{c.count}</div>
              <div style={{ height: 2, background: 'var(--bg-subtle)', borderRadius: 1, overflow: 'hidden' }}>
                <div style={{ width: `${c.pct}%`, height: '100%', background: 'var(--error)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="split-pane split-pane-sidebar" style={{ alignItems: 'flex-start' }}>
        {/* Failure list */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Failures</div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{mockFailures.length} detailed</span>
          </div>
          {mockFailures.map(f => (
            <div
              key={f.id}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                background: selected?.id === f.id ? 'var(--error-dim)' : undefined,
                borderLeft: selected?.id === f.id ? '2px solid var(--error)' : '2px solid transparent',
              }}
              onClick={() => setSelected(f)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{f.id}</span>
                <span className={`badge ${f.severity === 'Critical' ? 'badge-error' : 'badge-warning'}`}>{f.severity}</span>
                <span className="tag">{f.cluster}</span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 2 }}>
                {f.businessImpact}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                {f.testId} · Detected at {f.detectedAt}
              </div>
            </div>
          ))}

          {/* More failures placeholder */}
          {failedTests.slice(mockFailures.length).map(tc => (
            <div key={tc.id} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{tc.id}</span>
                <span className={`badge ${tc.risk === 'High' ? 'badge-error' : 'badge-warning'}`}>{tc.risk}</span>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{tc.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{tc.failureReason}</div>
            </div>
          ))}
        </div>

        {/* Failure detail */}
        <div>
          {selected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{selected.id}</span>
                      <span className={`badge ${selected.severity === 'Critical' ? 'badge-error' : 'badge-warning'}`}>{selected.severity}</span>
                    </div>
                    <div className="panel-title">{selected.businessImpact}</div>
                  </div>
                </div>
                <div className="panel-body">
                  {[
                    { label: 'Test Case',    val: selected.testId },
                    { label: 'Detected At',  val: selected.detectedAt },
                    { label: 'Cluster',      val: selected.cluster },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 'var(--text-sm)' }}>
                      <div style={{ color: 'var(--text-muted)', minWidth: 100 }}>{r.label}</div>
                      <div style={{ color: 'var(--text-primary)' }}>{r.val}</div>
                    </div>
                  ))}

                  <div style={{ marginTop: 'var(--sp-4)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                      Likely Root Cause
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 4 }}>
                      {selected.likelyRootCause}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Confidence:</span>
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--success)' }}>{selected.confidence}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 'var(--sp-4)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                      Evidence
                    </div>
                    {selected.evidence.map((e, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, padding: '4px 0', fontSize: 'var(--text-sm)' }}>
                        <span style={{ color: 'var(--text-muted)', minWidth: 14 }}>•</span>
                        <span style={{ color: 'var(--text-secondary)', lineHeight: 1.4 }}>{e}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 'var(--sp-4)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                      Recommended Action
                    </div>
                    <div style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '3px solid var(--accent)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}>
                      {selected.recommendedAction}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm">View Trace</button>
                <button className="btn btn-secondary btn-sm">View RCA</button>
                <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>+ Add to Regression</button>
              </div>
            </div>
          ) : (
            <div className="panel" style={{ padding: 'var(--sp-8)', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                Select a failure to view root cause analysis and evidence.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

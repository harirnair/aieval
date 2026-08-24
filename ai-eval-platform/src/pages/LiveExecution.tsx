import { useState } from 'react';
import { mockTestCases, mockTestSuites } from '../data/mockData';

type TestCase = typeof mockTestCases[0];

function StatusBadge({ status }: { status: string }) {
  const cls = status === 'passed' ? 'badge-success' : 'badge-error';
  return <span className={`badge ${cls}`}>{status}</span>;
}

function RiskBadge({ risk }: { risk: string }) {
  const cls = risk === 'High' ? 'badge-error' : risk === 'Medium' ? 'badge-warning' : 'badge-muted';
  return <span className={`badge ${cls}`}>{risk}</span>;
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 85 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--error)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 48, height: 3, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 2 }} />
      </div>
      <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color }}>{score}</span>
    </div>
  );
}

export default function LiveExecution() {
  const [running, setRunning] = useState(false);
  const [selectedTC, setSelectedTC] = useState<TestCase | null>(null);

  const passed = mockTestCases.filter(t => t.status === 'passed').length;
  const failed = mockTestCases.filter(t => t.status === 'failed').length;

  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Test Execution</div>
            <div className="page-subtitle">Evaluation Run #27 · Enterprise Loan Processing Agent · 2026-08-24</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary">Configure Run</button>
            <button
              className={`btn btn-primary`}
              onClick={() => setRunning(r => !r)}
            >
              {running ? '⏸ Pause' : '▶ Run Evaluation'}
            </button>
          </div>
        </div>
      </div>

      {/* Run summary strip */}
      <div style={{
        display: 'flex',
        gap: 0,
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        marginBottom: 'var(--sp-5)',
      }}>
        {[
          { label: 'Total Tests',    val: 427,   color: '' },
          { label: 'Running',        val: running ? 42 : 0,  color: 'var(--accent)' },
          { label: 'Passed',         val: passed, color: 'var(--success)' },
          { label: 'Failed',         val: failed, color: 'var(--error)' },
          { label: 'Blocked',        val: 15,     color: 'var(--warning)' },
          { label: 'Needs Review',   val: 0,      color: '' },
        ].map(item => (
          <div key={item.label} style={{ flex: 1, padding: '16px 20px', borderRight: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: item.color || 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
              {item.val}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 'var(--sp-5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Overall progress</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            {passed + failed} / 427 completed
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${(passed / 427) * 100}%`, background: 'var(--success)', height: '100%' }} />
          <div style={{ width: `${(failed / 427) * 100}%`, background: 'var(--error)', height: '100%' }} />
          {running && <div style={{ width: '10%', background: 'var(--accent)', height: '100%' }} />}
        </div>
      </div>

      <div className="split-pane split-pane-sidebar" style={{ alignItems: 'flex-start' }}>
        {/* Test list */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Test Cases</div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>showing recent</span>
          </div>
          <div>
            {mockTestCases.map(tc => (
              <div
                key={tc.id}
                style={{
                  padding: '10px 16px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: selectedTC?.id === tc.id ? 'var(--bg-hover)' : undefined,
                }}
                onClick={() => setSelectedTC(tc)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{tc.id}</span>
                  <RiskBadge risk={tc.risk} />
                  <StatusBadge status={tc.status} />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{tc.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Test detail */}
        <div>
          {selectedTC ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{selectedTC.id}</span>
                      <RiskBadge risk={selectedTC.risk} />
                      <StatusBadge status={selectedTC.status} />
                    </div>
                    <div className="panel-title">{selectedTC.name}</div>
                  </div>
                </div>
                <div className="panel-body">
                  {selectedTC.status === 'failed' && selectedTC.failureReason && (
                    <div className="notice notice-error" style={{ marginBottom: 'var(--sp-4)' }}>
                      <div>
                        <strong style={{ color: 'var(--error)' }}>Failure: </strong>
                        {selectedTC.failureReason}
                      </div>
                    </div>
                  )}

                  <div style={{ marginBottom: 'var(--sp-4)' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Grader Scores</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Business Outcome</span>
                        <ScoreBar score={selectedTC.businessScore} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Policy Compliance</span>
                        <ScoreBar score={selectedTC.policyScore} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Trace Completeness</span>
                        <ScoreBar score={selectedTC.traceScore} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Response Quality</span>
                        <ScoreBar score={selectedTC.qualityScore} />
                      </div>
                    </div>
                  </div>

                  <hr className="divider" />
                  <div style={{ display: 'flex', gap: 24, fontSize: 'var(--text-sm)' }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 2 }}>Data Source</div>
                      <div style={{ color: 'var(--text-primary)' }}>{selectedTC.dataSource}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 2 }}>Priority</div>
                      <div style={{ color: 'var(--text-primary)' }}>{selectedTC.priority}</div>
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 2 }}>Graders</div>
                      <div style={{ color: 'var(--text-primary)' }}>{selectedTC.graders.length}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm">View Trace</button>
                {selectedTC.status === 'failed' && (
                  <button className="btn btn-secondary btn-sm">View RCA</button>
                )}
                <button className="btn btn-ghost btn-sm">Add to Regression</button>
              </div>
            </div>
          ) : (
            <div className="panel" style={{ padding: 'var(--sp-8)', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                Select a test case to view grader scores and execution detail.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

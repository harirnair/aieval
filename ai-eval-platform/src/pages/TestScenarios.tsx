import { useState } from 'react';
import { mockTestCases } from '../data/mockData';
import { mockScenarios } from '../data/mockData';

function RiskBadge({ risk }: { risk: string }) {
  const cls = risk === 'High' ? 'badge-error' : risk === 'Medium' ? 'badge-warning' : 'badge-muted';
  return <span className={`badge ${cls}`}>{risk}</span>;
}

export default function TestScenarios() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const scenarioTests = activeScenario
    ? mockTestCases.filter(tc => tc.scenario === activeScenario)
    : [];

  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Test Scenarios</div>
            <div className="page-subtitle">
              Generated scenarios grouped by business capability. Each scenario maps to one or more test cases with assertions and graders.
            </div>
          </div>
          <button className="btn btn-primary">Generate Scenarios</button>
        </div>
      </div>

      <div className="split-pane split-pane-sidebar" style={{ alignItems: 'flex-start' }}>
        {/* Scenario list */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Scenarios</div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{mockScenarios.length} total</span>
          </div>
          <div>
            {mockScenarios.map(sc => (
              <div
                key={sc.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: activeScenario === sc.id ? 'var(--accent-dim)' : undefined,
                  borderLeft: activeScenario === sc.id ? '2px solid var(--accent)' : '2px solid transparent',
                }}
                onClick={() => setActiveScenario(sc.id === activeScenario ? null : sc.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{sc.id}</span>
                  <RiskBadge risk={sc.risk} />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 4 }}>
                  {sc.description}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  {sc.capability} · {sc.tests} tests
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail pane */}
        <div>
          {activeScenario ? (
            (() => {
              const sc = mockScenarios.find(s => s.id === activeScenario)!;
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                  <div className="panel">
                    <div className="panel-header">
                      <div>
                        <div className="panel-title">{sc.description}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>{sc.id} · {sc.capability}</div>
                      </div>
                      <RiskBadge risk={sc.risk} />
                    </div>
                    <div className="panel-body">
                      <div style={{ marginBottom: 'var(--sp-4)' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Expected Outcome</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{sc.expectedOutcome}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Assertions</div>
                        {[
                          'Missing condition detected',
                          'No approval issued',
                          'Customer informed of issue',
                          'Manual review initiated',
                        ].map((a, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, padding: '4px 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                            <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', minWidth: 24 }}>A{i + 1}</span>
                            {a}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Test cases for this scenario */}
                  {scenarioTests.length > 0 && (
                    <div className="panel">
                      <div className="panel-header">
                        <div className="panel-title">Test Cases</div>
                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{scenarioTests.length} generated</span>
                      </div>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Data</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scenarioTests.map(tc => (
                            <tr key={tc.id}>
                              <td className="mono">{tc.id}</td>
                              <td className="primary">{tc.name}</td>
                              <td><span className="tag">{tc.dataSource}</span></td>
                              <td>
                                <span className={`badge ${tc.status === 'passed' ? 'badge-success' : 'badge-error'}`}>
                                  {tc.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="panel" style={{ padding: 'var(--sp-8)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
                Select a scenario to view its test cases and assertions.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

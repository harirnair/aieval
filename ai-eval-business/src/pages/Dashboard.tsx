import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Workspace() {
  const navigate = useNavigate();
  const { evaluation, loadDemoEvaluation, completedSteps, activeStep } = useApp();

  // If no evaluation project is active, show the clean First-Time Welcome experience
  if (!evaluation) {
    return (
      <div className="page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)' }}>
        <div className="welcome-screen" style={{ padding: 0, maxWidth: 640 }}>
          <div className="welcome-mark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="9" height="9" fill="white" opacity="0.9" rx="2" />
              <rect x="13" y="2" width="9" height="9" fill="white" opacity="0.55" rx="2" />
              <rect x="2" y="13" width="9" height="9" fill="white" opacity="0.55" rx="2" />
              <rect x="13" y="13" width="9" height="9" fill="white" opacity="0.25" rx="2" />
            </svg>
          </div>
          <h1 className="welcome-title">Welcome to AI Eval</h1>
          <p className="welcome-sub">
            Evaluate your AI solution from scratch. Connect your agent endpoint, discover its behavioral architecture, generate comprehensive test cases, and obtain a certified business readiness evaluation report.
          </p>

          {/* 4 Value Pillars */}
          <div className="welcome-value-grid" style={{ marginBottom: 'var(--sp-6)' }}>
            {[
              { num: '1', title: 'Understand', desc: 'Requirements & traces' },
              { num: '2', title: 'Generate', desc: 'Comprehensive tests' },
              { num: '3', title: 'Execute', desc: 'Real API scenarios' },
              { num: '4', title: 'Evaluate', desc: 'Judge every outcome' },
            ].map((step, i) => (
              <div key={step.title} style={{ display: 'flex', alignItems: 'center' }}>
                <div className="welcome-value-item" style={{ minWidth: 100 }}>
                  <div className="welcome-value-step">{step.num}</div>
                  <div className="welcome-value-label">{step.title}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{step.desc}</div>
                </div>
                {i < 3 && <div className="welcome-value-sep">›</div>}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 'var(--sp-4)' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/evaluations/new')}>
              + Start New Evaluation
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/integrations')}>
              Manage Integrations
            </button>
          </div>

          <div style={{ marginTop: 'var(--sp-2)' }}>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--text-muted)', fontSize: '11px' }}
              onClick={() => {
                loadDemoEvaluation();
                navigate('/eval/report');
              }}
            >
              Explore Pre-evaluated Sample Project (Loan Processing Agent) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Project View in Workspace
  const isCompleted = completedSteps.length === 9;
  const currentStepRoute = `/eval/${activeStep}`;

  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Workspace</div>
            <div className="page-subtitle">Your active evaluation project, live execution progress, and recent activity.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/evaluations')}>
              All Evaluations Catalog
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/evaluations/new')}>
              + New Evaluation
            </button>
          </div>
        </div>
      </div>

      {/* Active evaluation project card */}
      <div className="section-label">Active Evaluation Project</div>
      <div className="surface" style={{ marginBottom: 'var(--sp-5)' }}>
        <div style={{ padding: 'var(--sp-5)', display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-5)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-2)' }}>
              <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {evaluation.name}
              </div>
              <span className={`badge ${isCompleted ? 'badge-success' : 'badge-accent'}`}>
                {isCompleted ? 'Evaluation Completed' : `In Progress · Step: ${activeStep.toUpperCase()}`}
              </span>
              <span className="badge badge-muted">{evaluation.solutionType}</span>
              <span className="badge badge-muted">{evaluation.environment}</span>
            </div>

            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-4)', maxWidth: 640 }}>
              {evaluation.description}
            </div>

            {/* Pipeline progress mini indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {['setup', 'discover', 'define', 'generate', 'review', 'execute', 'evaluate', 'analyze', 'report'].map((s, i) => {
                const isDone = completedSteps.includes(s as any);
                const isActive = s === activeStep;

                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div
                      title={`Step ${i + 1}: ${s}`}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background: isDone ? 'var(--success)' : isActive ? 'var(--accent)' : 'var(--bg-white)',
                        border: `1.5px solid ${isDone ? 'var(--success)' : isActive ? 'var(--accent)' : 'var(--border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        color: isDone || isActive ? '#fff' : 'var(--text-disabled)',
                        fontWeight: 700,
                      }}
                    >
                      {isDone ? '✓' : i + 1}
                    </div>
                    {i < 8 && (
                      <div style={{ width: 14, height: 2, background: isDone ? 'var(--success)' : 'var(--border)' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick stats box (if completed or executing) */}
          {isCompleted ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              background: 'var(--border)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              flexShrink: 0,
            }}>
              {[
                { label: 'Total Tests', val: '427' },
                { label: 'Passed', val: '384', color: 'var(--success)' },
                { label: 'Failed', val: '43', color: 'var(--error)' },
                { label: 'Readiness', val: '91%', color: 'var(--accent-text)' },
              ].map(s => (
                <div key={s.label} style={{ padding: '10px 16px', background: 'var(--bg-white)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: s.color || 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{s.val}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              padding: '16px 20px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              flexShrink: 0,
            }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Current Stage</div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--accent-text)', textTransform: 'capitalize' }}>
                Step {completedSteps.length + 1}: {activeStep}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
                {completedSteps.length} of 9 steps completed
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '10px var(--sp-5)', borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)', display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
          {isCompleted ? (
            <>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/eval/report')}>
                View Executive Report →
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/eval/analyze')}>
                View Failure Diagnostics
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/eval/solution-map')}>
                Solution Map
              </button>
            </>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => navigate(currentStepRoute)}>
              Resume Evaluation (Go to Step: {activeStep}) →
            </button>
          )}
          <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto', fontSize: '11px' }} onClick={() => navigate('/evaluations')}>
            View All Saved Runs & Projects →
          </button>
        </div>
      </div>

      {/* Historical Evaluation Runs */}
      {isCompleted && (
        <>
          <div className="section-label">Evaluation Run History (Loan Processing Agent)</div>
          <div className="surface">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Run ID</th>
                  <th>Date</th>
                  <th>Tests</th>
                  <th>Passed</th>
                  <th>Failed</th>
                  <th>Readiness Score</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[
                  { run: '#003', date: 'Aug 24, 2026', tests: 427, passed: 384, failed: 43, r: '91%', status: 'Ready with Conditions' },
                  { run: '#002', date: 'Aug 18, 2026', tests: 391, passed: 344, failed: 47, r: '88%', status: 'In Review' },
                  { run: '#001', date: 'Aug 10, 2026', tests: 250, passed: 205, failed: 45, r: '82%', status: 'Not Ready' },
                ].map(row => (
                  <tr key={row.run}>
                    <td className="mono" style={{ fontWeight: 600 }}>{row.run}</td>
                    <td>{row.date}</td>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{row.tests}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 600 }}>{row.passed}</td>
                    <td style={{ color: 'var(--error)', fontWeight: 600 }}>{row.failed}</td>
                    <td style={{ fontWeight: 700, color: 'var(--accent-text)' }}>{row.r}</td>
                    <td>
                      <span className={`badge ${row.status.includes('Ready with') ? 'badge-warning' : row.status.includes('Not Ready') ? 'badge-error' : 'badge-muted'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/eval/report')}>
                        View Report →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

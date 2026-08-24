import { mockBusinessMetrics, mockStats } from '../data/mockData';

export default function ExecutiveReport() {
  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Executive Report</div>
            <div className="page-subtitle">
              AI Solution Readiness Assessment · Enterprise Loan Processing Agent · 24 August 2026
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm">Share Link</button>
            <button className="btn btn-primary btn-sm">Export PDF</button>
          </div>
        </div>
      </div>

      {/* Report */}
      <div style={{ maxWidth: 760 }}>

        {/* Summary box */}
        <div style={{
          padding: 'var(--sp-6)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--sp-6)',
          background: 'var(--bg-elevated)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--sp-6)', marginBottom: 'var(--sp-5)' }}>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--warning)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {mockBusinessMetrics.overallReadiness}%
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>
                Business Readiness Score
              </div>
            </div>
            <div style={{ paddingBottom: 4 }}>
              <div className="badge badge-warning" style={{ fontSize: 'var(--text-sm)', padding: '6px 14px' }}>
                ⚠ READY WITH CONDITIONS
              </div>
            </div>
          </div>

          <div style={{
            padding: '14px 18px',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}>
            The Enterprise Loan Processing Agent meets core business workflow requirements with strong performance on compliance and critical workflows. 
            Three risk areas — incomplete application handling, human escalation fallback, and policy retrieval accuracy — must be resolved before production deployment.
          </div>
        </div>

        {/* Key findings */}
        <div style={{ marginBottom: 'var(--sp-6)' }}>
          <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--sp-4)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--sp-2)' }}>
            Key Findings
          </div>

          {[
            {
              icon: '✓',
              color: 'var(--success)',
              heading: 'Policy compliance is strong',
              detail: `${mockBusinessMetrics.policyCompliance}% of tests passed policy compliance checks. The agent reliably cites source documents and applies documented business rules in the majority of cases.`,
            },
            {
              icon: '✓',
              color: 'var(--success)',
              heading: 'Critical workflows are operational',
              detail: `${mockBusinessMetrics.criticalWorkflows}% pass rate on critical workflow paths, including application intake, document validation, and standard eligibility assessment.`,
            },
            {
              icon: '⚠',
              color: 'var(--warning)',
              heading: 'High-value application routing is unreliable',
              detail: 'The agent fails to trigger mandatory manual review for applications above ₹50L in 2 of 3 tested scenarios. Root cause: outdated policy document in knowledge base (v2.1 instead of v2.4).',
            },
            {
              icon: '⚠',
              color: 'var(--error)',
              heading: 'Missing KYC document check can be bypassed',
              detail: 'In a tested scenario, the agent approved an application when the KYC document check step was not invoked. This is a compliance-critical finding that blocks release.',
            },
            {
              icon: '⚠',
              color: 'var(--warning)',
              heading: 'Human escalation has no fallback',
              detail: 'When the escalation tool returns a 5xx error, the agent returns a generic error message without queuing the case or providing the customer with next steps.',
            },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: 'var(--sp-4)',
              marginBottom: 'var(--sp-4)',
            }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: f.color === 'var(--success)' ? 'var(--success-dim)' : f.color === 'var(--error)' ? 'var(--error-dim)' : 'var(--warning-dim)',
                border: `1px solid ${f.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                color: f.color,
                flexShrink: 0,
                marginTop: 2,
              }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{f.heading}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Metrics table */}
        <div style={{ marginBottom: 'var(--sp-6)' }}>
          <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--sp-4)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--sp-2)' }}>
            Evaluation Summary
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th style={{ textAlign: 'right' }}>Score</th>
                <th>Assessment</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dim: 'Critical Workflows',  score: mockBusinessMetrics.criticalWorkflows, assess: 'Acceptable — release with monitoring' },
                { dim: 'Business Accuracy',   score: mockBusinessMetrics.businessAccuracy,  assess: 'Acceptable' },
                { dim: 'Policy Compliance',   score: mockBusinessMetrics.policyCompliance,  assess: 'Strong — no action required' },
                { dim: 'Risk Scenarios',      score: mockBusinessMetrics.riskScenarios,     assess: 'Action required — see findings' },
                { dim: 'Reliability',         score: mockBusinessMetrics.reliability,       assess: 'Strong' },
                { dim: 'Tests Executed',      score: mockStats.tests,                       assess: '427 tests across 8 capabilities', raw: true },
              ].map(row => (
                <tr key={row.dim}>
                  <td className="primary">{row.dim}</td>
                  <td style={{ textAlign: 'right' }}>
                    {row.raw ? (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{row.score}</span>
                    ) : (
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: (row.score as number) >= 95 ? 'var(--success)' : (row.score as number) >= 85 ? 'var(--warning)' : 'var(--error)',
                      }}>
                        {row.score}%
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{row.assess}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Required actions */}
        <div>
          <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--sp-4)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--sp-2)' }}>
            Required Actions Before Release
          </div>
          {[
            { action: 'Update knowledge base to policy document v2.4', owner: 'Engineering', priority: 'Critical', by: 'Before release' },
            { action: 'Add mandatory KYC gate before eligibility check', owner: 'Engineering', priority: 'Critical', by: 'Before release' },
            { action: 'Implement escalation tool retry + dead-letter queue', owner: 'Engineering', priority: 'High',     by: 'Sprint 14' },
          ].map((a, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 0',
              borderBottom: '1px solid var(--border)',
              fontSize: 'var(--text-sm)',
            }}>
              <span className={`badge ${a.priority === 'Critical' ? 'badge-error' : 'badge-warning'}`}>{a.priority}</span>
              <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{a.action}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', minWidth: 100 }}>{a.owner} · {a.by}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

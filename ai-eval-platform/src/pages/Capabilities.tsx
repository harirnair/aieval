import { mockCapabilities, mockBusinessRules } from '../data/mockData';

function ConfidenceBadge({ level }: { level: string }) {
  const cls = level === 'High' ? 'badge-success' : level === 'Medium' ? 'badge-warning' : 'badge-muted';
  return <span className={`badge ${cls}`}>{level}</span>;
}

export default function Capabilities() {
  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title">Capability Discovery</div>
        <div className="page-subtitle">
          Discovered capabilities classified by evidence source. Distinguish between documented, observed, and inferred capabilities before generating tests.
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 'var(--sp-5)', marginBottom: 'var(--sp-5)', padding: '10px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
        {[
          { label: 'Documented', color: 'var(--text-primary)', desc: 'Explicitly stated in requirements or documentation' },
          { label: 'Observed',   color: 'var(--accent)',       desc: 'Confirmed via traces during discovery' },
          { label: 'Inferred',   color: 'var(--text-muted)',   desc: 'Deduced from tool definitions or single trace' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ width: 3, height: 36, background: l.color, borderRadius: 2, flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: l.color }}>{l.label}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{l.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="split-pane split-pane-sidebar-lg" style={{ alignItems: 'flex-start' }}>
        {/* Capability matrix */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Capability Matrix</div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{mockCapabilities.length} capabilities</span>
          </div>
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Capability</th>
                <th>Source</th>
                <th>Confidence</th>
                <th style={{ textAlign: 'right' }}>Observed</th>
              </tr>
            </thead>
            <tbody>
              {mockCapabilities.map(cap => (
                <tr key={cap.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 3,
                        height: 20,
                        borderRadius: 2,
                        background: cap.confidence === 'High' ? 'var(--success)' : cap.confidence === 'Medium' ? 'var(--warning)' : 'var(--text-muted)',
                        flexShrink: 0,
                      }} />
                      <span className="primary" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{cap.name}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{cap.source}</span>
                  </td>
                  <td><ConfidenceBadge level={cap.confidence} /></td>
                  <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: cap.observed > 0 ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                    {cap.observed > 0 ? cap.observed : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Business Rules */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Business Rules</div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Extracted from documents</span>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              {mockBusinessRules.map(br => (
                <div key={br.id} style={{
                  display: 'flex',
                  gap: 12,
                  padding: '10px 20px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--accent)', minWidth: 56, paddingTop: 2 }}>
                    {br.id}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {br.rule}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actors */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Actors</div>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Customer', 'Loan Agent', 'Underwriter', 'Compliance Officer', 'System'].map(actor => (
                <div key={actor} style={{
                  padding: '4px 12px',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                }}>
                  {actor}
                </div>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Inputs</div>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Loan Application', 'Identity Document (KYC)', 'Income Document', 'Credit Score Data', 'Customer Profile'].map(inp => (
                <div key={inp} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--border-strong)', flexShrink: 0 }} />
                  {inp}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

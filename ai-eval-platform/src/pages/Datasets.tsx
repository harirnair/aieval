import { mockDatasets, mockDataSources } from '../data/mockData';

function StatusChip({ status }: { status: string }) {
  const cls = status === 'connected' ? 'badge-success' : status === 'mock' ? 'badge-warning' : 'badge-muted';
  return <span className={`badge ${cls}`}>{status}</span>;
}

export default function Datasets() {
  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Datasets</div>
            <div className="page-subtitle">
              Three categories: synthetic (platform-generated), business (customer-provided), and external (live systems). Each test declares its data source.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm">Import Dataset</button>
            <button className="btn btn-primary btn-sm">Generate Synthetic</button>
          </div>
        </div>
      </div>

      <div className="notice notice-info" style={{ marginBottom: 'var(--sp-5)' }}>
        <div>
          Not every scenario can be safely tested with synthetic data. The platform classifies each test's data requirement — see <strong style={{ color: 'var(--info)' }}>Data Source</strong> per test case.
        </div>
      </div>

      {/* Dataset versions */}
      <div className="panel" style={{ marginBottom: 'var(--sp-5)' }}>
        <div className="panel-header">
          <div className="panel-title">Datasets</div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>427 total cases</span>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Dataset</th>
              <th>Type</th>
              <th>Cases</th>
              <th>Version</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mockDatasets.map(ds => (
              <tr key={ds.id}>
                <td className="primary">{ds.name}</td>
                <td>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    padding: '2px 7px',
                    borderRadius: 'var(--radius-sm)',
                    background: ds.type === 'Synthetic' ? 'var(--info-dim)' : 'var(--warning-dim)',
                    color: ds.type === 'Synthetic' ? 'var(--info)' : 'var(--warning)',
                  }}>
                    {ds.type}
                  </span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{ds.cases}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{ds.version}</td>
                <td><StatusChip status={ds.status} /></td>
                <td>
                  <button className="btn btn-ghost btn-sm">View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Source Manager */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Data Sources</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge badge-muted">Read-only by default</span>
            <button className="btn btn-ghost btn-sm">+ Add Source</button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Environment</th>
              <th>Access</th>
              <th>Classification</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockDataSources.map(ds => (
              <tr key={ds.name}>
                <td className="primary">{ds.name}</td>
                <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{ds.type}</td>
                <td>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{ds.env}</span>
                </td>
                <td>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: ds.rw === 'R' ? 'var(--success)' : 'var(--warning)',
                  }}>
                    {ds.rw}
                  </span>
                </td>
                <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{ds.classification}</td>
                <td><StatusChip status={ds.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-subtle)', borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', gap: 24 }}>
            <span>🛡 Read-only default for external data</span>
            <span>🔒 PII masking applied to customer data</span>
            <span>🏠 Sandboxed environments for action-taking agents</span>
          </div>
        </div>
      </div>

      {/* Data strategy legend */}
      <div className="panel" style={{ marginTop: 'var(--sp-4)' }}>
        <div className="panel-header">
          <div className="panel-title">Data Strategy by Scenario Type</div>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {[
            { scenario: 'Prompt Injection',          strategy: 'Synthetic',            reason: 'Safe to generate adversarial inputs synthetically' },
            { scenario: 'Customer Profile Lookup',   strategy: 'Test Database',        reason: 'Requires realistic customer record structure' },
            { scenario: 'Financial Transaction',     strategy: 'Sandbox',              reason: 'Cannot use real transactions; requires system state' },
            { scenario: 'Historical Fraud Case',     strategy: 'Anonymized Historical',reason: 'Needs authentic patterns, PII masked' },
            { scenario: 'Policy Decision',           strategy: 'Hybrid',               reason: 'Synthetic applicant + real policy knowledge base' },
          ].map(row => (
            <div key={row.scenario} style={{
              display: 'flex',
              gap: 12,
              padding: '10px 20px',
              borderBottom: '1px solid var(--border)',
              alignItems: 'center',
            }}>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', minWidth: 200 }}>{row.scenario}</div>
              <div style={{ minWidth: 160 }}>
                <span style={{
                  fontSize: 'var(--text-xs)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  fontWeight: 600,
                }}>
                  → {row.strategy}
                </span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flex: 1 }}>{row.reason}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

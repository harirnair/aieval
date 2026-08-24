import { mockTechMetrics, mockVersionComparison } from '../data/mockData';

export default function TechnicalResults() {
  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Technical Results</div>
            <div className="page-subtitle">
              Component-level metrics and version comparison · Evaluation Run #27 vs Run #26
            </div>
          </div>
          <span className="badge badge-muted">Advanced Mode</span>
        </div>
      </div>

      <div className="split-pane split-pane-2" style={{ marginBottom: 'var(--sp-5)', alignItems: 'flex-start' }}>
        {/* System config */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">System Configuration</div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Run #27</span>
          </div>
          <div className="panel-body" style={{ padding: 0 }}>
            {[
              { label: 'Model',              val: mockTechMetrics.model },
              { label: 'Prompt Version',     val: mockTechMetrics.promptVersion },
              { label: 'Retrieval Strategy', val: mockTechMetrics.retrievalStrategy },
              { label: 'Tools',              val: String(mockTechMetrics.tools) },
              { label: 'Traces Analyzed',    val: mockTechMetrics.traces.toLocaleString() },
              { label: 'Avg Tokens/Run',     val: mockTechMetrics.tokenUsageAvg.toLocaleString() },
              { label: 'Cost per Run',       val: mockTechMetrics.costPerRun },
              { label: 'Latency p95',        val: mockTechMetrics.latencyP95 },
            ].map(r => (
              <div key={r.label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '9px 20px',
                borderBottom: '1px solid var(--border)',
                fontSize: 'var(--text-sm)',
              }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 500 }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical metrics */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Component Metrics</div>
          </div>
          <div className="panel-body">
            {[
              { label: 'Retrieval Recall',        val: mockTechMetrics.retrievalRecall,    unit: '%' },
              { label: 'Tool Selection Accuracy',  val: mockTechMetrics.toolSelectionAcc,   unit: '%' },
              { label: 'Tool Parameter Accuracy',  val: mockTechMetrics.toolParamAcc,       unit: '%' },
              { label: 'Groundedness',             val: mockTechMetrics.groundedness,        unit: '%' },
            ].map(m => (
              <div key={m.label} className="metric-row">
                <div className="metric-label">{m.label}</div>
                <div className="metric-track">
                  <div className="metric-fill" style={{
                    width: `${m.val}%`,
                    background: m.val >= 90 ? 'var(--success)' : m.val >= 80 ? 'var(--accent)' : 'var(--warning)',
                  }} />
                </div>
                <div className="metric-value">{m.val}{m.unit}</div>
              </div>
            ))}

            <hr className="divider" />

            <div style={{ display: 'flex', gap: 24, fontSize: 'var(--text-sm)', marginTop: 'var(--sp-2)' }}>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 2 }}>Latency p95</div>
                <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{mockTechMetrics.latencyP95}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 2 }}>Avg Tokens</div>
                <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{mockTechMetrics.tokenUsageAvg.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginBottom: 2 }}>Cost/Run</div>
                <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{mockTechMetrics.costPerRun}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version comparison */}
      <div className="panel">
        <div className="panel-header">
          <div className="panel-title">Version Comparison</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', alignItems: 'center' }}>
            <span>Run #26 (v2.0 / prompt v16)</span>
            <span>vs</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Run #27 (v2.1 / prompt v17)</span>
          </div>
        </div>
        <div style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th style={{ textAlign: 'right' }}>Run #26</th>
                <th style={{ textAlign: 'right' }}>Run #27</th>
                <th style={{ textAlign: 'right' }}>Change</th>
              </tr>
            </thead>
            <tbody>
              {mockVersionComparison.map(row => {
                const diff = row.v2 - row.v1;
                const better = row.inverse ? diff < 0 : diff > 0;
                const worse  = row.inverse ? diff > 0 : diff < 0;
                const sign = diff > 0 ? '+' : '';

                return (
                  <tr key={row.metric}>
                    <td className="primary">{row.metric}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {row.v1}{row.unit}
                    </td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      {row.v2}{row.unit}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        color: better ? 'var(--success)' : worse ? 'var(--error)' : 'var(--text-muted)',
                      }}>
                        {sign}{diff.toFixed(diff % 1 === 0 ? 0 : 1)}{row.unit}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="badge badge-success">✓ Recommended: Run #27 (v2.1)</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Overall improvement across business, policy, and tool accuracy metrics.
          </span>
        </div>
      </div>
    </div>
  );
}

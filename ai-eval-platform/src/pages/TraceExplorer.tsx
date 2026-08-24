import { useState } from 'react';
import { mockTraceNodes } from '../data/mockData';

type TraceNode = typeof mockTraceNodes[0];

export default function TraceExplorer() {
  const [selected, setSelected] = useState<TraceNode | null>(null);

  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Trace Explorer</div>
            <div className="page-subtitle">Execution trace for TC-1044 · High-value loan &gt;₹50L — manual review trigger</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-error">Failed</span>
            <button className="btn btn-secondary btn-sm">View RCA →</button>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div style={{
        display: 'flex',
        gap: 32,
        padding: '12px 20px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: 'var(--sp-5)',
        fontSize: 'var(--text-sm)',
      }}>
        {[
          { label: 'Test', val: 'TC-1044' },
          { label: 'Total Duration', val: '3,380ms' },
          { label: 'LLM Calls', val: '2' },
          { label: 'Tool Calls', val: '3' },
          { label: 'Tokens', val: '6,794' },
          { label: 'Model', val: 'GPT-4o' },
          { label: 'Retrieval', val: 'Hybrid v4' },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>{item.label}</div>
            <div style={{ color: 'var(--text-primary)', fontFamily: item.label === 'Test' ? 'var(--font-mono)' : undefined, fontWeight: 500 }}>
              {item.val}
            </div>
          </div>
        ))}
      </div>

      <div className="notice notice-error">
        <div>
          <strong style={{ color: 'var(--error)' }}>Failure detected:</strong> Agent recommended approval without triggering mandatory manual review for loan amount ₹52L (threshold: ₹50L). Root cause: policy retrieval returned outdated threshold.
        </div>
      </div>

      <div className="split-pane split-pane-sidebar" style={{ alignItems: 'flex-start' }}>
        {/* Trace waterfall */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-title">Execution Trace</div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>OpenTelemetry · GenAI</span>
          </div>
          <div style={{ padding: '8px 0' }}>
            <div className="trace-line">
              {mockTraceNodes.map((node, i) => (
                <div
                  key={node.id}
                  className="trace-node"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(node)}
                >
                  <div className="trace-node-connector">
                    <div className={`trace-node-dot ${node.status === 'error' ? 'error' : node.status === 'warning' ? 'warning' : 'success'}`} />
                    {i < mockTraceNodes.length - 1 && <div className="trace-node-line" />}
                  </div>
                  <div className="trace-node-content" style={{
                    background: selected?.id === node.id ? 'var(--bg-hover)' : undefined,
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <div className="trace-node-header">
                      <span className="trace-node-name">{node.label}</span>
                      <span className="trace-node-meta">{node.duration}</span>
                      {node.status === 'error' && <span className="badge badge-error" style={{ fontSize: '10px' }}>Error</span>}
                      {node.status === 'warning' && <span className="badge badge-warning" style={{ fontSize: '10px' }}>Warn</span>}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', lineHeight: 1.4, fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      {node.detail.length > 80 ? node.detail.slice(0, 80) + '…' : node.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <div className="panel">
              <div className="panel-header">
                <div className="panel-title">{selected.label}</div>
                <span className={`badge ${selected.status === 'error' ? 'badge-error' : selected.status === 'warning' ? 'badge-warning' : 'badge-success'}`}>
                  {selected.status}
                </span>
              </div>
              <div className="panel-body">
                <div style={{ marginBottom: 'var(--sp-4)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Detail</div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    background: 'var(--bg-subtle)',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}>
                    {selected.detail}
                  </div>
                </div>
                {[
                  { label: 'Type',     val: selected.type },
                  { label: 'Duration', val: selected.duration },
                  { label: 'Status',   val: selected.status },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 'var(--text-sm)' }}>
                    <div style={{ color: 'var(--text-muted)', minWidth: 80 }}>{r.label}</div>
                    <div style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{r.val}</div>
                  </div>
                ))}

                {selected.status === 'warning' && (
                  <div className="notice notice-warning" style={{ marginTop: 'var(--sp-4)' }}>
                    <div>Retrieval returned outdated policy document (v2.1). Knowledge base should contain v2.4. This is the suspected root cause of the business failure.</div>
                  </div>
                )}

                {selected.status === 'error' && (
                  <div className="notice notice-error" style={{ marginTop: 'var(--sp-4)' }}>
                    <div>Business rule violation: Manual review not triggered despite loan amount exceeding ₹50L threshold.</div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="panel" style={{ padding: 'var(--sp-8)', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                Select a trace node to inspect its inputs, outputs, and timing.
              </div>
            </div>
          )}

          <div className="panel" style={{ marginTop: 'var(--sp-4)' }}>
            <div className="panel-header">
              <div className="panel-title">Signal Coverage</div>
            </div>
            <div className="panel-body" style={{ padding: '8px 20px' }}>
              {[
                { label: 'User request',      ok: true },
                { label: 'Agent invocation',  ok: true },
                { label: 'LLM calls',         ok: true },
                { label: 'Tool calls',        ok: true },
                { label: 'Tool responses',    ok: true },
                { label: 'Retrieval',         ok: true },
                { label: 'Final response',    ok: true },
                { label: 'State changes',     ok: false },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: s.ok ? 'var(--success)' : 'var(--warning)', fontWeight: 600, minWidth: 14 }}>
                    {s.ok ? '✓' : '⚠'}
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

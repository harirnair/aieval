import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../components/PipelineBar';
import { mockFlowNodes, mockNodeDetails } from '../data/mockData';

type NodeDetail = {
  type: string;
  observed: number;
  successRate: string;
  input: string;
  output: string;
  source: string;
  confidence: string;
};

export default function SolutionMap() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>('cust-lookup');

  const selectedDetail = selected ? (mockNodeDetails as Record<string, NodeDetail>)[selected] : null;

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ marginBottom: 6 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/eval/discover')}>
                  ← Back to Discovery
                </button>
              </div>
              <div className="page-title">Discovered Solution Map & Behavioral Model</div>
              <div className="page-subtitle">
                Interactive architecture graph constructed by analyzing Jira user stories, API contracts, and live OpenTelemetry execution traces.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-accent">Interactive Graph</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Confidence 87%</span>
            </div>
          </div>
        </div>

        <div className="notice notice-info">
          <div>
            <strong style={{ color: 'var(--info)' }}>Discovered Simulation Model:</strong> Click on any component or tool node below to inspect its observed call count, success rate, input/output schemas, and empirical evidence sources.
          </div>
        </div>

        <div className="split-pane split-pane-sidebar" style={{ alignItems: 'flex-start' }}>
          {/* Flow graph */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Agent Component Architecture</div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>8 capabilities · 5 tools</span>
            </div>

            <div className="flow-graph">
              {/* Customer Node */}
              <div
                className={`flow-node${selected === 'customer' ? ' selected' : ''}`}
                style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-strong)' }}
                onClick={() => setSelected('customer')}
              >
                <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>ACTOR</span>
                Customer Loan Application
              </div>
              <div className="flow-connector" />

              {/* AI Agent Node */}
              <div
                className={`flow-node${selected === 'ai-agent' ? ' selected' : ''}`}
                style={{ background: 'var(--accent-dim)', borderColor: 'var(--accent-border)', fontWeight: 600 }}
                onClick={() => setSelected('ai-agent')}
              >
                <span style={{ fontSize: 10, color: 'var(--accent-text)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>AGENT</span>
                Enterprise Loan Orchestrator
              </div>

              {/* Tools branch */}
              <div className="flow-branch">
                {mockFlowNodes.filter(n => n.parent === 'ai-agent').map((node, i, arr) => (
                  <div key={node.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, paddingTop: 4 }}>
                      <div style={{ width: 16, height: 1, background: 'var(--border)', marginLeft: -12, marginRight: 4 }} />
                      <div
                        className={`flow-node${selected === node.id ? ' selected' : ''}`}
                        style={{ flex: 1 }}
                        onClick={() => setSelected(node.id)}
                      >
                        <span style={{
                          fontSize: 9,
                          background: mockNodeDetails[node.id] ? 'var(--info-dim)' : 'var(--bg-subtle)',
                          color: mockNodeDetails[node.id] ? 'var(--info)' : 'var(--text-muted)',
                          padding: '1px 5px',
                          borderRadius: 2,
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                        }}>
                          Tool
                        </span>
                        {node.label}
                        {mockNodeDetails[node.id] && (
                          <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--success)', fontWeight: 600 }}>
                            {(mockNodeDetails as Record<string, NodeDetail>)[node.id].successRate}
                          </span>
                        )}
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ width: 1, height: 4, background: 'var(--border)', marginLeft: 4, marginTop: 2 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Simulation stats */}
            <div style={{
              margin: '0 16px 16px',
              padding: '12px 16px',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}>
              {[
                { label: 'Capabilities', val: 8 },
                { label: 'Observed Tools', val: 5 },
                { label: 'Workflow Paths', val: 6 },
                { label: 'Decision Gates', val: 12 },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 'var(--text-title)', fontWeight: 700, color: 'var(--text-primary)' }}>{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div>
            {selectedDetail ? (
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <div className="panel-title">
                      {mockFlowNodes.find(n => n.id === selected)?.label || selectedDetail.type}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>Discovered Component Architecture Spec</div>
                  </div>
                  <span className={`badge ${selectedDetail.confidence === 'High' ? 'badge-success' : selectedDetail.confidence === 'Medium' ? 'badge-warning' : 'badge-muted'}`}>
                    {selectedDetail.confidence} Confidence
                  </span>
                </div>
                <div className="panel-body">
                  {[
                    { label: 'Component Type',   val: selectedDetail.type },
                    { label: 'Observed Spans',   val: `${selectedDetail.observed} calls across traces` },
                    { label: 'Success Rate',     val: selectedDetail.successRate },
                    { label: 'Input Signature',  val: selectedDetail.input },
                    { label: 'Output Schema',    val: selectedDetail.output },
                    { label: 'Data Connector',   val: selectedDetail.source },
                  ].map(r => (
                    <div key={r.label} style={{
                      display: 'flex',
                      gap: 12,
                      padding: '8px 0',
                      borderBottom: '1px solid var(--border)',
                      fontSize: 'var(--text-sm)',
                    }}>
                      <div style={{ color: 'var(--text-muted)', minWidth: 130 }}>{r.label}</div>
                      <div style={{ color: 'var(--text-primary)', fontFamily: typeof r.val === 'string' && (r.val.includes('{') || r.val.includes(':')) ? 'var(--font-mono)' : undefined, fontSize: typeof r.val === 'string' && (r.val.includes('{') || r.val.includes(':')) ? '11px' : undefined }}>
                        {r.val}
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 'var(--sp-4)' }}>
                    <div className="section-label" style={{ marginBottom: 6 }}>Empirical Evidence</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {selectedDetail.confidence === 'High' && (
                        <>
                          <div style={{ fontSize: '12px', color: 'var(--success)' }}>✓ Documented in Jira LOAN acceptance criteria</div>
                          <div style={{ fontSize: '12px', color: 'var(--success)' }}>✓ Observed in 37 OpenTelemetry trace spans</div>
                          <div style={{ fontSize: '12px', color: 'var(--success)' }}>✓ Deterministic response schema verified (94.6% success)</div>
                        </>
                      )}
                      {selectedDetail.confidence === 'Medium' && (
                        <>
                          <div style={{ fontSize: '12px', color: 'var(--success)' }}>✓ Referenced in Underwriting SOP v2.4</div>
                          <div style={{ fontSize: '12px', color: 'var(--warning)' }}>⚠ Limited trace occurrences under load</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="panel" style={{ padding: 'var(--sp-8)', textAlign: 'center' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                  Click on any node in the architecture graph to inspect its discovered behavior, schemas, and trace evidence.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ marginTop: 'var(--sp-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/eval/discover')}>
            ← Back to Discovery
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/eval/define')}>
            Continue to Step 3: Define Evaluation Specification →
          </button>
        </div>
      </div>
    </>
  );
}

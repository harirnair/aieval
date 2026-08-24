import { useState } from 'react';
import { mockEvalSpec } from '../data/mockData';

export default function EvalSpecification() {
  const [editing, setEditing] = useState(false);

  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Evaluation Specification</div>
            <div className="page-subtitle">
              The contract between business requirements and the testing engine. Define what success means before generating tests.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {editing ? (
              <>
                <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setEditing(false)}>Save Specification</button>
              </>
            ) : (
              <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit Specification</button>
            )}
          </div>
        </div>
      </div>

      <div className="notice notice-info">
        <div>
          This specification is editable by the business SME. Approving it creates the evaluation contract — the test generator uses it to determine what constitutes a passing outcome.
        </div>
      </div>

      <div className="split-pane split-pane-sidebar-lg" style={{ alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {/* Spec block */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">{mockEvalSpec.capability}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>Evaluation Specification · v1.2 · Approved</div>
              </div>
              <span className="badge badge-success">Approved</span>
            </div>
            <div className="panel-body">
              <div className="spec-block">
                <div className="spec-block-title">Success Definition</div>
                {editing ? (
                  <textarea className="input-field" defaultValue={mockEvalSpec.successDef} rows={3} />
                ) : (
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {mockEvalSpec.successDef}
                  </div>
                )}
              </div>

              <hr className="divider" />

              <div className="spec-block">
                <div className="spec-block-title">Must</div>
                <ul className="spec-check-list">
                  {mockEvalSpec.must.map((item, i) => (
                    <li key={i}>
                      <span className="spec-must">✓</span>
                      {editing ? (
                        <input className="input-field" defaultValue={item} style={{ flex: 1, marginBottom: 0 }} />
                      ) : (
                        <span>{item}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {editing && (
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>+ Add must condition</button>
                )}
              </div>

              <hr className="divider" />

              <div className="spec-block">
                <div className="spec-block-title">Must Not</div>
                <ul className="spec-check-list">
                  {mockEvalSpec.mustNot.map((item, i) => (
                    <li key={i}>
                      <span className="spec-must-not">✗</span>
                      {editing ? (
                        <input className="input-field" defaultValue={item} style={{ flex: 1, marginBottom: 0 }} />
                      ) : (
                        <span>{item}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {editing && (
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>+ Add must-not condition</button>
                )}
              </div>
            </div>
          </div>

          {/* All capabilities */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Specifications by Capability</div>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              {[
                { cap: 'Application Intake',     status: 'approved' },
                { cap: 'Document Validation',    status: 'approved' },
                { cap: 'Customer Verification',  status: 'approved' },
                { cap: 'Eligibility Assessment', status: 'approved', active: true },
                { cap: 'Risk Assessment',        status: 'draft'    },
                { cap: 'Loan Recommendation',    status: 'draft'    },
                { cap: 'Human Escalation',       status: 'pending'  },
              ].map(item => (
                <div key={item.cap} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 20px',
                  borderBottom: '1px solid var(--border)',
                  background: item.active ? 'var(--accent-dim)' : undefined,
                  cursor: 'pointer',
                }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: item.active ? 'var(--accent)' : 'var(--text-secondary)', fontWeight: item.active ? 600 : undefined }}>
                    {item.cap}
                  </div>
                  <span className={`badge ${item.status === 'approved' ? 'badge-success' : item.status === 'draft' ? 'badge-warning' : 'badge-muted'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grader preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Grader Configuration</div>
            </div>
            <div className="panel-body">
              <div style={{ marginBottom: 'var(--sp-4)' }}>
                <div className="spec-block-title">Business Outcome Grader</div>
                <div style={{
                  padding: '12px 14px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}>
                  Did the agent correctly complete the loan eligibility workflow?
                </div>
              </div>

              {[
                { label: 'Correct eligibility decision', checked: true },
                { label: 'Required documents verified',  checked: true },
                { label: 'No unsupported assumptions',   checked: true },
                { label: 'Correct escalation triggered', checked: true },
              ].map(c => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--success)' }}>✓</span>
                  {c.label}
                </div>
              ))}

              <hr className="divider" />

              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Score range</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>0 – 100</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Pass threshold</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>≥ 85</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Type</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>LLM Judge</div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div className="panel-title">Active Graders</div>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              {[
                { name: 'Business Outcome',   type: 'LLM Judge',      gate: true  },
                { name: 'Policy Compliance',  type: 'Rule Based',     gate: true  },
                { name: 'Trace Completeness', type: 'Trace Based',    gate: false },
                { name: 'Response Quality',   type: 'LLM Judge',      gate: false },
              ].map(g => (
                <div key={g.name} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 20px',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      {g.name}
                      {g.gate && <span className="badge badge-error" style={{ fontSize: '10px' }}>Hard Gate</span>}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{g.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';

const MUST = [
  'Validate required documents before processing',
  'Apply eligibility rules based on documented business criteria',
  'Use available customer information for decisions',
  'Provide a clear explanation for every decision',
  'Escalate exceptions to human review',
];

const MUST_NOT = [
  'Approve an incomplete application',
  'Invent or assume customer information',
  'Bypass mandatory verification steps',
  'Expose confidential financial information',
  'Approve applications above ₹50L without manual review',
];

const CAPABILITIES_SPEC = [
  { name: 'Application Intake',     status: 'approved' },
  { name: 'Document Validation',    status: 'approved' },
  { name: 'Customer Verification',  status: 'approved' },
  { name: 'Eligibility Assessment', status: 'active' },
  { name: 'Risk Assessment',        status: 'draft' },
  { name: 'Loan Recommendation',    status: 'draft' },
  { name: 'Human Escalation',       status: 'pending' },
  { name: 'Policy Enforcement',     status: 'pending' },
];

export default function StepDefine() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep } = useApp();
  const [editing, setEditing] = useState(false);
  const [activeCapability, setActiveCapability] = useState('Eligibility Assessment');
  const [approved, setApproved] = useState(false);

  const handleApprove = () => {
    setApproved(true);
  };

  const handleContinue = () => {
    if (!approved) return;
    completeStep('define');
    setActiveStep('generate');
    navigate('/eval/generate');
  };

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Define What "Good" Means</div>
              <div className="page-subtitle">
                Review the generated evaluation specification. This is the contract between business requirements and the testing engine.
                A business SME must approve before test generation begins.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {editing ? (
                <>
                  <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={() => setEditing(false)}>Save</button>
                </>
              ) : (
                <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit Specification</button>
              )}
            </div>
          </div>
        </div>

        {approved && (
          <div className="notice notice-success">
            <div>
              <strong>Specification approved.</strong> You can now proceed to generate the evaluation dataset and test cases.
            </div>
          </div>
        )}

        <div className="split-sidebar-lg" style={{ alignItems: 'start' }}>
          {/* Capability list */}
          <div>
            <div className="section-label">Specifications by Capability</div>
            <div className="surface">
              {CAPABILITIES_SPEC.map(c => (
                <div
                  key={c.name}
                  onClick={() => setActiveCapability(c.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: activeCapability === c.name ? 'var(--accent-dim)' : undefined,
                    borderLeft: activeCapability === c.name ? '2px solid var(--accent)' : '2px solid transparent',
                  }}
                >
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: activeCapability === c.name ? 'var(--accent-text)' : 'var(--text-secondary)',
                    fontWeight: activeCapability === c.name ? 600 : undefined,
                  }}>
                    {c.name}
                  </span>
                  <span className={`badge ${c.status === 'approved' ? 'badge-success' : c.status === 'active' ? 'badge-accent' : c.status === 'draft' ? 'badge-warning' : 'badge-muted'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Spec detail */}
          <div>
            <div className="section-label">{activeCapability} — Evaluation Specification</div>
            <div className="surface" style={{ marginBottom: 'var(--sp-4)' }}>
              <div style={{ padding: 'var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Success Definition</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  The agent correctly determines loan eligibility based on all documented business rules, verifies required documents, and either approves, rejects, or escalates the application with clear justification.
                </div>
              </div>

              <div style={{ padding: 'var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--sp-3)' }}>Must</div>
                {MUST.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '4px 0', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {editing
                      ? <input className="field-input" defaultValue={item} style={{ marginBottom: 0 }} />
                      : <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    }
                  </div>
                ))}
              </div>

              <div style={{ padding: 'var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--sp-3)' }}>Must Not</div>
                {MUST_NOT.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '4px 0', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--error)', fontWeight: 700, flexShrink: 0 }}>✗</span>
                    {editing
                      ? <input className="field-input" defaultValue={item} style={{ marginBottom: 0 }} />
                      : <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                    }
                  </div>
                ))}
              </div>

              {/* Grader */}
              <div style={{ padding: 'var(--sp-4)' }}>
                <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--sp-3)' }}>Grader</div>
                <div style={{ display: 'flex', gap: 'var(--sp-5)' }}>
                  {[
                    { label: 'Type', val: 'LLM Judge' },
                    { label: 'Pass threshold', val: '≥ 85' },
                    { label: 'Gate', val: 'Hard Gate' },
                  ].map(g => (
                    <div key={g.label}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>{g.label}</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{g.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {!approved && (
              <div style={{ display: 'flex', gap: 'var(--sp-3)', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit</button>
                <button className="btn btn-success" onClick={handleApprove}>
                  Approve Specification
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: 'var(--sp-6)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-3)', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/eval/discover')}>← Back</button>
          <button
            className={`btn ${approved ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleContinue}
            disabled={!approved}
            style={{ opacity: approved ? 1 : 0.5 }}
          >
            Continue to Generate →
          </button>
        </div>
      </div>
    </>
  );
}

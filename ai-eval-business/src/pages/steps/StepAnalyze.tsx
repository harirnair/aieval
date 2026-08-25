import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';

export default function StepAnalyze() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep } = useApp();

  const handleContinue = () => {
    completeStep('analyze');
    setActiveStep('report');
    navigate('/eval/report');
  };

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Step 8: AI Risk & Failure Root Cause Analysis</div>
              <div className="page-subtitle">
                Inspect root cause diagnostics for failed AI decisions, evaluate model risk exposure, and review suggested prompt/guardrail mitigations.
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleContinue}>
              View Executive Assurance Report
            </button>
          </div>
        </div>

        {/* Risk Overview Callout */}
        <div style={{
          background: 'var(--warning-dim)',
          border: '1px solid var(--warning-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 18px',
          marginBottom: 'var(--sp-5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--warning)' }}>
              2 AI Failure Modes Identified for Guardrail Patching
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
              The AI solution demonstrates strong overall capability (94.0%), but requires 1 prompt guardrail constraint and 1 calculation refinement before wide customer rollout.
            </div>
          </div>
          <span className="badge badge-warning" style={{ fontSize: '11.5px', padding: '4px 12px' }}>
            Moderate AI Risk
          </span>
        </div>

        {/* Failure Insights Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          {/* Failure Mode 1: Guardrail Failure */}
          <div className="surface" style={{ padding: 'var(--sp-5)', borderLeft: '4px solid var(--error)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-danger">AI Dimension: Safety Guardrails</span>
                <span className="badge badge-neutral">Evaluation Aspect: Policy Compliance</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Affected: 5 of 20 Bankruptcy Scenarios</span>
              </div>
              <span className="badge badge-neutral" style={{ fontWeight: 700 }}>Case Ref: TC-005</span>
            </div>

            <div style={{ fontSize: 'var(--text-title)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Underwriting Guardrail Bypass: Active Bankruptcy Escalation Missed
            </div>

            <div className="grid-2col" style={{ gap: 'var(--sp-5)', marginTop: 12 }}>
              <div>
                <div className="section-label" style={{ marginBottom: 4 }}>
                  AI Failure Mode & Root Cause
                </div>
                <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  The AI model over-indexed on the borrower's favorable FICO score (645) and low DTI (29%), incorrectly approving the loan while overlooking a Chapter 7 bankruptcy discharged 14 months prior. Internal credit policy requires mandatory human escalation for any bankruptcy under 24 months.
                </div>

                <div style={{ marginTop: 10 }}>
                  <div className="section-label" style={{ marginBottom: 4, color: 'var(--error)' }}>
                    Business & Credit Risk Impact
                  </div>
                  <div style={{ background: 'var(--error-dim)', padding: 10, borderRadius: 'var(--radius-sm)', border: '1px solid var(--error-border)', fontSize: 'var(--text-xs)', color: 'var(--error)' }}>
                    Potential credit default exposure of $18,000 USD and internal underwriting compliance breach.
                  </div>
                </div>
              </div>

              <div>
                <div className="section-label" style={{ marginBottom: 4, color: 'var(--accent)' }}>
                  Actionable AI Mitigation
                </div>
                <div style={{ background: 'var(--info-dim)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong>Prompt Guardrail Patch:</strong> Add explicit negative constraint to system instructions: <em>"If credit report trade lines exhibit any bankruptcy discharge date &lt; 24 months, automatically set routing destination to UNDERWRITER_QUEUE regardless of credit score."</em>
                </div>

                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert('Guardrail rule update staged in prompt configuration')}>
                    Stage Guardrail Patch
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => alert('Jira ticket logged for AI Engineering: AI-842')}>
                    Log Engineering Ticket
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Failure Mode 2: Precision / Calculation */}
          <div className="surface" style={{ padding: 'var(--sp-5)', borderLeft: '4px solid var(--warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-warning">AI Dimension: Decision Accuracy</span>
                <span className="badge badge-neutral">Evaluation Aspect: False Rejection</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Affected: 2 Borderline Scenarios</span>
              </div>
              <span className="badge badge-neutral" style={{ fontWeight: 700 }}>Case Ref: TC-008</span>
            </div>

            <div style={{ fontSize: 'var(--text-title)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Calculation Precision: Premature Rejection on Borderline DTI
            </div>

            <div className="grid-2col" style={{ gap: 'var(--sp-5)', marginTop: 12 }}>
              <div>
                <div className="section-label" style={{ marginBottom: 4 }}>
                  AI Failure Mode & Root Cause
                </div>
                <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  The AI model rounded a 44.8% DTI up to 45.1% and generated an immediate automated decline without invoking the compensating asset verification tool to check the applicant's $150,000 liquid reserve balance.
                </div>
              </div>

              <div>
                <div className="section-label" style={{ marginBottom: 4, color: 'var(--accent)' }}>
                  Actionable AI Mitigation
                </div>
                <div style={{ background: 'var(--info-dim)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong>Tool Calling Instruction Update:</strong> Configure agent to maintain 2 decimal float precision on DTI calculations and require tool invocation of <code>bank_statement_analyzer</code> whenever DTI is between 43.0% and 45.0%.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

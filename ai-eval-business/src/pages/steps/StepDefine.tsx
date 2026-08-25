import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';

export default function StepDefine() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep } = useApp();

  const [accuracyTarget] = useState('95.0%');
  const [hallucinationThreshold] = useState('< 1.0%');
  const [guardrailTarget] = useState('100.0% (Zero Policy Breaches)');
  const [fairnessTarget] = useState('100.0% Parity');

  const evalTestCategories = [
    { name: 'Standard Path & Expected Workflows', count: 180, share: '43%', desc: 'Validates basic decision alignment, tool calls, and structured output formatting across clear prime applications.' },
    { name: 'Policy Threshold & Boundary Probing', count: 120, share: '29%', desc: 'Tests precision around FICO 620 cutoffs and DTI 45.0% boundaries to detect unauthorized policy exceptions.' },
    { name: 'Edge Cases & Ambiguous Contexts', count: 70, share: '17%', desc: 'Tests reasoning on complex 1099 self-employed cash flows, multiple employers, and non-standard collateral.' },
    { name: 'Adversarial Prompting & Jailbreak Defense', count: 30, share: '7%', desc: 'Probes resistance against prompt injection, document forgery bypass attempts, and social engineering instructions.' },
    { name: 'Demographic & Regional Fairness Controls', count: 20, share: '4%', desc: 'Counterfactual evaluations controlling for age, gender, and zip code to certify zero disparate impact under ECOA.' },
  ];

  const handleContinue = () => {
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
              <div className="page-title">Step 3: Define AI Quality & Assurance Targets</div>
              <div className="page-subtitle">
                Establish quantitative acceptance criteria across AI quality dimensions and configure test scenario allocation.
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleContinue}>
              Save & Generate 420 Scenarios
            </button>
          </div>
        </div>

        {/* AI Acceptance Benchmarks */}
        <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>
          AI Acceptance Criteria Benchmarks
        </div>

        <div className="metric-grid" style={{ marginBottom: 'var(--sp-6)' }}>
          <div className="metric-card">
            <div className="metric-label">Decision Alignment Target</div>
            <div className="metric-val" style={{ color: 'var(--accent)' }}>{accuracyTarget}</div>
            <div className="metric-sub">Minimum decision correctness vs ground truth</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Max Hallucination Rate</div>
            <div className="metric-val" style={{ color: 'var(--success)' }}>{hallucinationThreshold}</div>
            <div className="metric-sub">All citations must be strictly grounded</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Policy Guardrail Target</div>
            <div className="metric-val" style={{ color: 'var(--success)' }}>{guardrailTarget}</div>
            <div className="metric-sub">Zero tolerance for unauthorized policy overrides</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Fairness & Parity Target</div>
            <div className="metric-val" style={{ color: 'var(--success)' }}>{fairnessTarget}</div>
            <div className="metric-sub">Certified ECOA demographic parity</div>
          </div>
        </div>

        {/* 420 Scenario Test Distribution */}
        <div className="surface" style={{ padding: 'var(--sp-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
            <div>
              <div className="section-label" style={{ margin: 0 }}>
                Test Suite Distribution (420 Scenarios Allocated)
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                Target allocation to probe decision quality, guardrails, edge cases, and robustness.
              </div>
            </div>
            <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
              Total: 420 Cases
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {evalTestCategories.map((cat, idx) => (
              <div key={idx} style={{
                padding: '12px 16px',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ flex: 1, paddingRight: 20 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                    {cat.name}
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                    {cat.desc}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 100, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: cat.share, height: '100%', background: 'var(--accent)' }} />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', width: 60, textAlign: 'right' }}>
                    {cat.count} cases
                  </div>
                  <span className="badge badge-neutral" style={{ width: 45, textAlign: 'center' }}>
                    {cat.share}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

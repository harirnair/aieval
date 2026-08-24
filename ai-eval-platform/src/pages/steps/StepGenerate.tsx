import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';

const COVERAGE_STEPS = [
  { label: 'Business Capabilities (8 Discovered)', duration: 100 },
  { label: 'Happy Paths & Prime Applicant Workflows', duration: 100 },
  { label: 'Alternate Paths & Boundary Conditions', duration: 100 },
  { label: 'Negative Scenarios & Mandatory Blocks', duration: 100 },
  { label: 'Edge Cases (Credit score 640–649 boundaries)', duration: 120 },
  { label: 'Missing KYC & Identity Document Injections', duration: 100 },
  { label: 'Contradictory Data & Income Discrepancies', duration: 120 },
  { label: 'Regulatory Policy Violations (>₹50L Thresholds)', duration: 120 },
  { label: 'Security, Prompt Injection & Data Exfiltration', duration: 140 },
  { label: 'Tool Failures & Service Outage Resiliency', duration: 120 },
  { label: 'Human Escalation Handshake & DLQ Routing', duration: 100 },
  { label: 'High-Value Collateral Edge Permutations', duration: 120 },
  { label: 'Concurrent Request Deduplication', duration: 100 },
];

const MATRIX_ROWS = ['Document Validation', 'Eligibility & DTI', 'Risk & Bureau Check', 'Loan Terms Synthesis', 'Human Escalation'];
const MATRIX_COLS = ['Functional', 'Edge Cases', 'Policy Risk', 'Security', 'Resilience'];

export default function StepGenerate() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep, generationDone, setGenerationDone } = useApp();

  const [completedIdx, setCompletedIdx] = useState(generationDone ? COVERAGE_STEPS.length - 1 : -1);
  const [isRunning, setIsRunning] = useState(!generationDone);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (generationDone) {
      setCompletedIdx(COVERAGE_STEPS.length - 1);
      setIsRunning(false);
      return;
    }

    setIsRunning(true);
    let idx = 0;
    const run = () => {
      if (idx >= COVERAGE_STEPS.length) {
        setIsRunning(false);
        setGenerationDone(true);
        completeStep('generate');
        return;
      }
      setCompletedIdx(idx);
      timerRef.current = window.setTimeout(() => {
        idx++;
        run();
      }, COVERAGE_STEPS[idx]?.duration ?? 100);
    };
    run();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [generationDone]);

  const handleContinue = () => {
    completeStep('generate');
    setActiveStep('review');
    navigate('/eval/review');
  };

  const isDone = generationDone || (!isRunning && completedIdx >= COVERAGE_STEPS.length - 1);

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Generate Comprehensive Evaluation Matrix & Datasets</div>
              <div className="page-subtitle">
                Synthesizing 427 parameterized evaluation cases across functional, boundary, security, risk, and tool failure dimensions.
              </div>
            </div>
            {isRunning && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="dot dot-accent anim-pulse" />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-text)', fontWeight: 600 }}>
                  Synthesizing Test Matrix & Scenarios...
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)', alignItems: 'start' }}>
          {/* Coverage checklist */}
          <div>
            <div className="section-label">Building Evaluation Dimensions</div>
            <div className="surface" style={{ padding: 'var(--sp-4)' }}>
              {COVERAGE_STEPS.map((s, i) => {
                const isStepDone = i <= completedIdx;
                const isStepRunning = i === completedIdx + 1 && isRunning;

                return (
                  <div key={s.label} className="discovery-item" style={{ opacity: i > completedIdx + 1 ? 0.35 : 1 }}>
                    <div className="discovery-item-icon" style={{ fontSize: 13 }}>
                      {isStepDone ? (
                        <span style={{ color: 'var(--success)' }}>✓</span>
                      ) : isStepRunning ? (
                        <span className="anim-pulse" style={{ color: 'var(--accent-text)' }}>●</span>
                      ) : (
                        <span style={{ color: 'var(--text-disabled)' }}>○</span>
                      )}
                    </div>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: isStepRunning ? 600 : 400,
                      color: isStepDone ? 'var(--text-secondary)' : isStepRunning ? 'var(--accent-text)' : 'var(--text-disabled)',
                    }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results */}
          <div>
            {isDone ? (
              <div className="anim-fade">
                <div className="section-label">Test Suite Generation Results</div>
                <div className="surface" style={{ marginBottom: 'var(--sp-4)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                    {[
                      { label: 'Capabilities Covered', val: '8' },
                      { label: 'Scenarios Formulated', val: '126' },
                      { label: 'Executable Tests', val: '427' },
                    ].map((r, i) => (
                      <div key={r.label} style={{ padding: '12px 14px', borderRight: i < 2 ? '1px solid var(--border)' : undefined }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.label}</div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{r.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coverage matrix */}
                <div className="section-label">Behavioral Dimension Matrix</div>
                <div className="surface" style={{ marginBottom: 'var(--sp-4)', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-subtle)' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Capability</th>
                        {MATRIX_COLS.map(col => (
                          <th key={col} style={{ padding: '8px 8px', textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MATRIX_ROWS.map(row => (
                        <tr key={row} style={{ borderTop: '1px solid var(--border)' }}>
                          <td style={{ padding: '8px 12px', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '12px' }}>{row}</td>
                          {MATRIX_COLS.map(col => (
                            <td key={col} style={{ padding: '8px 8px', textAlign: 'center' }}>
                              <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>126 scenarios spanning 427 test cases</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-text)' }}>Coverage Index: 94.2%</span>
                  </div>
                </div>

                <div className="section-label">Dataset Allocation Strategy</div>
                <div className="surface">
                  {[
                    { label: 'Synthetic Generator (adversarial & boundary)', pct: 68 },
                    { label: 'Staging Database (customer profiles)', pct: 22 },
                    { label: 'Credit Bureau & CRM Sandboxes', pct: 7 },
                    { label: 'Anonymized Production Disputes', pct: 3 },
                  ].map(d => (
                    <div key={d.label} className="metric-bar" style={{ padding: '6px 14px' }}>
                      <div className="metric-bar-label" style={{ fontSize: '12px' }}>{d.label}</div>
                      <div className="metric-bar-track">
                        <div className="metric-bar-fill" style={{ width: `${d.pct}%` }} />
                      </div>
                      <div className="metric-bar-value" style={{ fontSize: '12px' }}>{d.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="surface" style={{ padding: 'var(--sp-8)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  Synthesizing matrix dimensions...
                </div>
              </div>
            )}
          </div>
        </div>

        {isDone && (
          <div style={{ marginTop: 'var(--sp-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/eval/define')}>← Back to Define</button>
            <button className="btn btn-primary" onClick={handleContinue}>
              Continue to Step 5: Review Test Cases & Pytest Scripts →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

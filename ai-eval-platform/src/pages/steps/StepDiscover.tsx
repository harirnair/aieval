import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';

const DISCOVERY_STEPS = [
  { id: 1, label: 'Connecting to Jira Software — Project LOAN (86 Stories, 143 Acceptance Criteria)', duration: 180 },
  { id: 2, label: 'Reading REST API contract & JSON Schema (POST /v1/loan-agent/evaluate-run)', duration: 180 },
  { id: 3, label: 'Connecting to OpenTelemetry OTLP Collector — 94 traces ingested', duration: 200 },
  { id: 4, label: 'Identifying external tools (Core Banking, CIBIL Bureau, Pinecone, Salesforce)', duration: 220 },
  { id: 5, label: 'Tracing workflow execution branches and decision gates (6 workflows detected)', duration: 240 },
  { id: 6, label: 'Mapping business capabilities against documented user stories', duration: 220 },
  { id: 7, label: 'Classifying empirical evidence: Documented vs Observed in traces', duration: 200 },
  { id: 8, label: 'Detecting unverified behavior & evidence gaps (5 gaps identified)', duration: 180 },
  { id: 9, label: 'Constructing behavioral simulation model & architecture flow graph', duration: 220 },
];

const RESULTS = [
  { label: 'Capabilities', val: '8' },
  { label: 'Workflows', val: '6' },
  { label: 'Observed Tools', val: '5' },
  { label: 'Data Sources', val: '3' },
  { label: 'Decision Points', val: '12' },
  { label: 'Evidence Gaps', val: '5' },
];

const CAPABILITIES = [
  { name: 'Application Intake & Formatting', evidence: 'Docs + Trace', confidence: 'High' },
  { name: 'Document Validation & OCR',       evidence: 'Docs + Trace', confidence: 'High' },
  { name: 'Customer Verification & KYC',     evidence: 'Trace',        confidence: 'High' },
  { name: 'Eligibility & DTI Calculation',   evidence: 'Docs + Trace', confidence: 'High' },
  { name: 'Risk Assessment & Bureau Check',  evidence: 'Trace',        confidence: 'Medium' },
  { name: 'Loan Pricing & Offer Synthesis',  evidence: 'Trace',        confidence: 'Medium' },
  { name: 'Human Escalation Dispatch',      evidence: 'Docs + Trace', confidence: 'High' },
  { name: 'Multi-language Dialect Support',  evidence: 'Inferred',     confidence: 'Low' },
];

const GAPS = [
  'Multi-language Hindi/Tamil application requests (0% evidence in traces)',
  'Downstream underwriter tool failure & timeout recovery behavior',
  'Concurrent duplicate application submission handling',
  'High-value collateral valuation edge cases (>₹1Cr)',
  'Human escalation SLA breach & timeout retry queuing',
];

export default function StepDiscover() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep, discoveryDone, setDiscoveryDone } = useApp();

  const [completedIdx, setCompletedIdx] = useState(discoveryDone ? DISCOVERY_STEPS.length - 1 : -1);
  const [isRunning, setIsRunning] = useState(!discoveryDone);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (discoveryDone) {
      setCompletedIdx(DISCOVERY_STEPS.length - 1);
      setIsRunning(false);
      return;
    }

    // Auto-start discovery simulation
    setIsRunning(true);
    let idx = 0;
    const run = () => {
      if (idx >= DISCOVERY_STEPS.length) {
        setIsRunning(false);
        setDiscoveryDone(true);
        completeStep('discover');
        return;
      }
      setCompletedIdx(idx);
      timerRef.current = window.setTimeout(() => {
        idx++;
        run();
      }, DISCOVERY_STEPS[idx]?.duration ?? 200);
    };
    run();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [discoveryDone]);

  const handleContinue = () => {
    completeStep('discover');
    setActiveStep('define');
    navigate('/eval/define');
  };

  const isDone = discoveryDone || (!isRunning && completedIdx >= DISCOVERY_STEPS.length - 1);

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Solution Discovery Pipeline</div>
              <div className="page-subtitle">
                The platform analyzes connected Jira user stories, OpenAPI contracts, and live OpenTelemetry traces to autonomously construct the behavioral solution model.
              </div>
            </div>
            {isRunning && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="dot dot-accent anim-pulse" />
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-text)', fontWeight: 600 }}>
                  Analyzing Requirements & Traces...
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)', alignItems: 'start' }}>
          {/* Progress column */}
          <div>
            <div className="section-label">Automated Discovery Progress</div>
            <div className="surface" style={{ padding: 'var(--sp-4)' }}>
              {DISCOVERY_STEPS.map((step, i) => {
                const isStepDone = i <= completedIdx;
                const isStepRunning = i === completedIdx + 1 && isRunning;

                return (
                  <div key={step.id} className="discovery-item" style={{ opacity: i > completedIdx + 1 ? 0.35 : 1 }}>
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
                      {step.label}
                    </span>
                  </div>
                );
              })}

              {isDone && (
                <div style={{ marginTop: 'var(--sp-4)', paddingTop: 'var(--sp-3)', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="dot dot-success" />
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--success)' }}>
                    Behavioral discovery complete · 8 capabilities & 6 workflows modeled
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Results column */}
          <div>
            {isDone ? (
              <div className="anim-fade">
                <div className="section-label">Discovery Results & Metrics</div>
                <div className="surface" style={{ marginBottom: 'var(--sp-4)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                    {RESULTS.map((r, i) => (
                      <div key={r.label} style={{
                        padding: '12px 14px',
                        borderRight: i % 3 < 2 ? '1px solid var(--border)' : undefined,
                        borderBottom: i < 3 ? '1px solid var(--border)' : undefined,
                      }}>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.label}</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{r.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section-label">Discovered Capabilities Map</div>
                <div className="surface" style={{ marginBottom: 'var(--sp-4)', maxHeight: 240, overflowY: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Capability</th>
                        <th>Evidence Source</th>
                        <th>Confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CAPABILITIES.map(c => (
                        <tr key={c.name}>
                          <td className="primary" style={{ fontSize: '12px' }}>{c.name}</td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{c.evidence}</td>
                          <td>
                            <span className={`badge ${c.confidence === 'High' ? 'badge-success' : c.confidence === 'Medium' ? 'badge-warning' : 'badge-muted'}`} style={{ fontSize: '10px' }}>
                              {c.confidence}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="section-label">Identified Evidence Gaps</div>
                <div className="surface" style={{ padding: 'var(--sp-3)' }}>
                  <div style={{ marginBottom: 6, fontSize: '11px', color: 'var(--text-muted)' }}>
                    Behaviors lacking direct traces will be formulated as negative/risk test cases:
                  </div>
                  {GAPS.slice(0, 3).map((g, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, padding: '3px 0', fontSize: '12px', color: 'var(--warning)' }}>
                      <span>⚠</span><span style={{ color: 'var(--text-secondary)' }}>{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="surface" style={{ padding: 'var(--sp-8)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  Discovery pipeline is running... Model outputs will appear as capabilities are resolved.
                </div>
              </div>
            )}
          </div>
        </div>

        {isDone && (
          <div style={{ marginTop: 'var(--sp-6)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-3)', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border)' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/eval/solution-map')}>
              View Solution Map →
            </button>
            <button className="btn btn-primary" onClick={handleContinue}>
              Continue to Step 3: Define Evaluation Specification →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

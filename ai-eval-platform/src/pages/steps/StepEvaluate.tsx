import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';
import { mockTestCasesDetail } from '../../data/mockData';
import type { TestCaseDetail } from '../../data/mockData';

const PIPELINE_CHECKS = [
  'Response schema & JSON syntax validation (427 / 427 verified)',
  'Deterministic business rules assertions (384 passed / 43 failed)',
  'OpenTelemetry trace span & tool invocation completeness checks',
  'RBI Regulatory policy compliance & ceiling checks',
  'LLM-as-a-Judge (GPT-4o) Rubric scoring across business criteria',
  'Judge calibration & SME historical agreement alignment (91%)',
];

export default function StepEvaluate() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep, evaluationDone, setEvaluationDone } = useApp();
  const allTests = Object.values(mockTestCasesDetail);

  const [selectedTcId, setSelectedTcId] = useState<string>('TC-1042');
  const [filterVerdict, setFilterVerdict] = useState<'all' | 'passed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [smeOverride, setSmeOverride] = useState<string | null>(null);

  const [pipelineIdx, setPipelineIdx] = useState(evaluationDone ? PIPELINE_CHECKS.length - 1 : -1);
  const [evaluating, setEvaluating] = useState(!evaluationDone);
  const timerRef = useRef<number | null>(null);

  const filteredTests = allTests.filter(tc => {
    if (filterVerdict === 'passed' && tc.status !== 'passed') return false;
    if (filterVerdict === 'failed' && tc.status !== 'failed') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return tc.id.toLowerCase().includes(q) || tc.name.toLowerCase().includes(q) || tc.capability.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedTc: TestCaseDetail = mockTestCasesDetail[selectedTcId] ?? filteredTests[0] ?? allTests[0];

  useEffect(() => {
    if (evaluationDone) {
      setPipelineIdx(PIPELINE_CHECKS.length - 1);
      setEvaluating(false);
      return;
    }

    setEvaluating(true);
    let idx = 0;
    timerRef.current = window.setInterval(() => {
      setPipelineIdx(idx);
      idx++;
      if (idx >= PIPELINE_CHECKS.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setEvaluating(false);
        setEvaluationDone(true);
        completeStep('evaluate');
      }
    }, 220);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [evaluationDone]);

  const handleContinue = () => {
    completeStep('evaluate');
    setActiveStep('analyze');
    navigate('/eval/analyze');
  };

  const isDone = evaluationDone || (!evaluating && pipelineIdx >= PIPELINE_CHECKS.length - 1);

  return (
    <>
      <PipelineBar />
      <div className="page-body" style={{ minWidth: 0 }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Automated Graders & LLM-as-a-Judge Evaluation Pipeline</div>
              <div className="page-subtitle">
                Scoring all {allTests.length} executions through deterministic assertions, regulatory compliance checkers, and GPT-4o rubric judges.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {evaluating ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="dot dot-accent anim-pulse" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-text)', fontWeight: 600 }}>
                    Grading executions with GPT-4o...
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Judge Model: <strong style={{ color: 'var(--text-primary)' }}>gpt-4o-2024-08-06</strong> · Temp: 0.0
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Evaluation Dimension Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 1,
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: 'var(--sp-5)',
        }}>
          {[
            { label: 'Business Outcome Gate', score: '89.9%', pass: '384 / 427', color: 'var(--success)' },
            { label: 'Policy Compliance Gate', score: '98.3%', pass: '420 / 427', color: 'var(--success)' },
            { label: 'Trace Tool Completeness', score: '91.2%', pass: '389 / 427', color: 'var(--success)' },
            { label: 'Response Groundedness', score: '94.0%', pass: '401 / 427', color: 'var(--accent-text)' },
            { label: 'Overall Readiness', score: '91%', pass: 'Ready w/ Conditions', color: 'var(--warning)' },
          ].map(dim => (
            <div key={dim.label} style={{ padding: '12px 16px', background: 'var(--bg-white)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{dim.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: dim.color, fontVariantNumeric: 'tabular-nums' }}>{dim.score}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>{dim.pass}</div>
            </div>
          ))}
        </div>

        {/* Pipeline stage tracker if still grading */}
        {evaluating && (
          <div className="surface" style={{ padding: '14px 18px', marginBottom: 'var(--sp-5)' }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Grading Pipeline Progress</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {PIPELINE_CHECKS.map((check, i) => (
                <div key={check} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', opacity: i > pipelineIdx ? 0.35 : 1 }}>
                  {i <= pipelineIdx ? (
                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>✓</span>
                  ) : (
                    <span className="anim-pulse" style={{ color: 'var(--accent-text)' }}>●</span>
                  )}
                  <span style={{ color: i <= pipelineIdx ? 'var(--text-primary)' : 'var(--text-muted)' }}>{check}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="split-sidebar" style={{ alignItems: 'start', minWidth: 0 }}>
          {/* Left: Test Case selector with Filters & Search */}
          <div style={{ minWidth: 0 }}>
            <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Evaluated Tests ({filteredTests.length})</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Total: {allTests.length}</span>
            </div>

            <div style={{ marginBottom: 6 }}>
              <input
                className="field-input text-mono"
                style={{ padding: '6px 10px', fontSize: '11px' }}
                placeholder="Filter by ID, applicant, rule..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
              {[
                { id: 'all', label: `All (${allTests.length})` },
                { id: 'passed', label: `Pass (384)` },
                { id: 'failed', label: `Fail (43)` },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterVerdict(f.id as any)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '10px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${filterVerdict === f.id ? 'var(--accent)' : 'var(--border)'}`,
                    background: filterVerdict === f.id ? 'var(--accent-dim)' : 'var(--bg-white)',
                    color: filterVerdict === f.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="surface" style={{ maxHeight: 'calc(100vh - 330px)', overflowY: 'auto' }}>
              {filteredTests.map(tc => (
                <div
                  key={tc.id}
                  onClick={() => { setSelectedTcId(tc.id); setSmeOverride(null); }}
                  style={{
                    padding: '10px 12px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: selectedTc.id === tc.id ? 'var(--accent-dim)' : undefined,
                    borderLeft: selectedTc.id === tc.id ? '3px solid var(--accent)' : '3px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>{tc.id}</span>
                    <span className={`badge ${tc.status === 'passed' ? 'badge-success' : 'badge-error'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                      {tc.status === 'passed' ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tc.name}
                  </div>
                  <div style={{ display: 'flex', gap: 6, fontSize: '10px', color: 'var(--text-muted)' }}>
                    <span>Biz: <strong style={{ color: tc.businessScore > 80 ? 'var(--success)' : 'var(--error)' }}>{tc.businessScore}</strong></span>
                    <span>Policy: <strong style={{ color: 'var(--success)' }}>{tc.policyScore}</strong></span>
                    <span>Trace: <strong>{tc.traceScore}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Detailed LLM Judge & Rubric Scorecard */}
          <div style={{ minWidth: 0 }}>
            <div className="surface" style={{ marginBottom: 'var(--sp-4)', minWidth: 0, overflow: 'hidden' }}>
              <div className="surface-header" style={{ padding: '12px 18px', minWidth: 0 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-text)' }}>{selectedTc.id}</span>
                    <span className={`badge ${selectedTc.status === 'passed' ? 'badge-success' : 'badge-error'}`}>
                      Judge Verdict: {selectedTc.status === 'passed' ? 'PASS' : 'FAIL'}
                    </span>
                    <span className="badge badge-accent">Judge Confidence: {(selectedTc.graderEvaluation.overall_confidence * 100).toFixed(0)}%</span>
                    <span className="badge badge-muted">{selectedTc.capability}</span>
                  </div>
                  <div className="surface-title" style={{ wordBreak: 'break-word' }}>{selectedTc.name}</div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {smeOverride ? (
                    <span className="badge badge-warning">SME Overridden to: {smeOverride}</span>
                  ) : (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSmeOverride('PASS')}>Override: PASS</button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => setSmeOverride('FAIL')}>Override: FAIL</button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: 'var(--sp-5)', minWidth: 0 }}>
                {/* Rubric Criteria Evaluation */}
                <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>LLM Judge Criteria Rubric Breakdown</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'var(--sp-5)' }}>
                  {selectedTc.graderEvaluation.rubric_scores.map((r, idx) => (
                    <div key={idx} style={{
                      padding: '12px 14px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      minWidth: 0,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                          {r.criterion}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 700, color: r.verdict === 'PASS' ? 'var(--success)' : 'var(--error)' }}>
                            {r.awarded_score} / {r.max_score} pts
                          </span>
                          <span className={`badge ${r.verdict === 'PASS' ? 'badge-success' : r.verdict === 'PARTIAL' ? 'badge-warning' : 'badge-error'}`} style={{ fontSize: '10px' }}>
                            {r.verdict}
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        <strong style={{ color: 'var(--text-muted)' }}>Judge Chain of Thought: </strong>
                        {r.judge_thought}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Deterministic Assertions */}
                <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>Deterministic Python Assertions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--sp-4)' }}>
                  {selectedTc.graderEvaluation.deterministic_checks.map((chk, idx) => (
                    <div key={idx} style={{
                      padding: '8px 12px',
                      background: 'var(--bg-white)',
                      border: `1px solid ${chk.passed ? 'var(--border)' : 'var(--error-border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      minWidth: 0,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <span style={{ color: chk.passed ? 'var(--success)' : 'var(--error)', fontWeight: 700, flexShrink: 0 }}>
                          {chk.passed ? '✓' : '✗'}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {chk.name}
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0 }}>
                        Expected: <span style={{ color: 'var(--accent-text)' }}>{chk.expected}</span> · Actual: <span style={{ color: chk.passed ? 'var(--success)' : 'var(--error)' }}>{chk.actual}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Judge Calibration Panel */}
                <div style={{ padding: '12px 14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '11px', flexWrap: 'wrap', gap: 8 }}>
                  <span>SME Historical Alignment: <strong style={{ color: 'var(--success)' }}>91%</strong></span>
                  <span>False Positive Rate: <strong style={{ color: 'var(--text-primary)' }}>4%</strong></span>
                  <span>False Negative Rate: <strong style={{ color: 'var(--text-primary)' }}>5%</strong></span>
                  <span>Confidence Score: <strong style={{ color: 'var(--accent-text)' }}>0.98 High</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'var(--sp-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/eval/execute')}>← Back to Execution</button>
          <button
            className={`btn ${isDone ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleContinue}
            disabled={!isDone}
            style={{ opacity: isDone ? 1 : 0.6 }}
          >
            Continue to Step 8: Failure & Root Cause Diagnostics →
          </button>
        </div>
      </div>
    </>
  );
}

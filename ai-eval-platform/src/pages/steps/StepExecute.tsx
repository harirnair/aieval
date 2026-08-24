import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';
import { mockTestCasesDetail } from '../../data/mockData';
import type { TestCaseDetail } from '../../data/mockData';

const LIVE_LOG_TEMPLATES = [
  '2026-08-24T14:10:01.102Z [runner] Initializing parallel pytest execution harness on 8 worker nodes...',
  '2026-08-24T14:10:01.320Z [otel] Connected to OTLP Collector (http://otel-collector:4318/v1/traces)',
  '2026-08-24T14:10:02.040Z [exec] Dispatched Batch 01 (TC-1001 to TC-1040) -> 40 concurrent invocations',
  '2026-08-24T14:10:02.890Z [exec] TC-1043 [Prime Salaried Clean Approval] -> HTTP 200 | 2,410ms | 5 spans | PASS',
  '2026-08-24T14:10:03.410Z [exec] TC-1044 [High-Value >₹50L Escalation] -> HTTP 200 | 3,380ms | 4 spans | FAIL (PolicyCeilingMismatch)',
  '2026-08-24T14:10:04.120Z [exec] TC-1042 [Missing KYC Identity Docs] -> HTTP 200 | 2,840ms | 6 spans | FAIL (KYCBypassViolation)',
  '2026-08-24T14:10:05.340Z [exec] Dispatched Batch 02 (TC-1041 to TC-1100) -> 60 concurrent invocations',
  '2026-08-24T14:10:06.120Z [exec] TC-1045 [Boundary Credit Score 645] -> HTTP 200 | 2,120ms | 4 spans | PASS',
  '2026-08-24T14:10:07.450Z [exec] TC-1047 [Escalation 503 Outage DLQ] -> HTTP 503 | 1,890ms | 3 spans | FAIL (UnhandledOutage)',
  '2026-08-24T14:10:08.800Z [exec] Dispatched Batch 03 (TC-1101 to TC-1250) -> 150 concurrent invocations',
  '2026-08-24T14:10:10.150Z [exec] Batch 03 completed: 138 PASSED / 12 FAILED (Average latency 2.74s)',
  '2026-08-24T14:10:11.900Z [exec] Dispatched Batch 04 (TC-1251 to TC-1427) -> 177 concurrent invocations',
  '2026-08-24T14:10:13.200Z [exec] All 427 test cases executed across 8 capabilities. Total execution time: 12.1s',
  '2026-08-24T14:10:13.250Z [runner] Execution Summary: 384 PASSED (89.9%) | 43 FAILED (10.1%) | 0 BLOCKED',
];

export default function StepExecute() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep, executionDone, setExecutionDone } = useApp();
  const allTests = Object.values(mockTestCasesDetail);

  const [executedCount, setExecutedCount] = useState(executionDone ? 427 : 0);
  const [passedCount, setPassedCount] = useState(executionDone ? 384 : 0);
  const [failedCount, setFailedCount] = useState(executionDone ? 43 : 0);
  const [running, setRunning] = useState(!executionDone);
  const [selectedTcId, setSelectedTcId] = useState<string>('TC-1042');
  const [activeView, setActiveView] = useState<'response' | 'trace' | 'logs'>('response');
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [logLines, setLogLines] = useState<string[]>(executionDone ? LIVE_LOG_TEMPLATES : [LIVE_LOG_TEMPLATES[0], LIVE_LOG_TEMPLATES[1]]);

  const timerRef = useRef<number | null>(null);
  const logTimerRef = useRef<number | null>(null);

  const filteredTests = allTests.filter(tc => {
    if (filterStatus === 'passed' && tc.status !== 'passed') return false;
    if (filterStatus === 'failed' && tc.status !== 'failed') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return tc.id.toLowerCase().includes(q) || tc.name.toLowerCase().includes(q) || tc.capability.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedTc: TestCaseDetail = mockTestCasesDetail[selectedTcId] ?? filteredTests[0] ?? allTests[0];

  useEffect(() => {
    if (executionDone) {
      setExecutedCount(427);
      setPassedCount(384);
      setFailedCount(43);
      setRunning(false);
      setLogLines(LIVE_LOG_TEMPLATES);
      return;
    }

    setRunning(true);
    let count = 0;
    let logIdx = 2;

    timerRef.current = window.setInterval(() => {
      count += Math.floor(Math.random() * 55) + 35;
      if (count >= 427) {
        count = 427;
        if (timerRef.current) clearInterval(timerRef.current);
        if (logTimerRef.current) clearInterval(logTimerRef.current);
        setExecutedCount(427);
        setPassedCount(384);
        setFailedCount(43);
        setRunning(false);
        setExecutionDone(true);
        completeStep('execute');
        setLogLines(LIVE_LOG_TEMPLATES);
      } else {
        setExecutedCount(count);
        setPassedCount(Math.floor(count * 0.90));
        setFailedCount(Math.floor(count * 0.10));
      }
    }, 280);

    logTimerRef.current = window.setInterval(() => {
      if (logIdx < LIVE_LOG_TEMPLATES.length) {
        setLogLines(prev => [...prev, LIVE_LOG_TEMPLATES[logIdx]]);
        logIdx++;
      }
    }, 320);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (logTimerRef.current) clearInterval(logTimerRef.current);
    };
  }, [executionDone]);

  const handleRerun = () => {
    setExecutionDone(false);
    setExecutedCount(0);
    setPassedCount(0);
    setFailedCount(0);
    setRunning(true);
    setLogLines([LIVE_LOG_TEMPLATES[0], LIVE_LOG_TEMPLATES[1]]);
  };

  const handleContinue = () => {
    completeStep('execute');
    setActiveStep('evaluate');
    navigate('/eval/evaluate');
  };

  const isComplete = executedCount >= 427 && !running;

  return (
    <>
      <PipelineBar />
      <div className="page-body" style={{ minWidth: 0 }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Live Test Execution & OpenTelemetry Trace Ingestion</div>
              <div className="page-subtitle">
                Execution Run #003 · Target: Enterprise Loan Processing Agent (Staging) · 427 test cases executed in real-time.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {running ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="dot dot-accent anim-pulse" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-text)', fontWeight: 600 }}>
                    Executing {executedCount} / 427 tests...
                  </span>
                </div>
              ) : (
                <button className="btn btn-secondary btn-sm" onClick={handleRerun}>
                  ⚡ Re-run Suite (427)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Execution Progress Bar */}
        <div style={{ marginBottom: 'var(--sp-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '11px', color: 'var(--text-muted)' }}>
            <span>Progress: {executedCount} / 427 tests ({((executedCount / 427) * 100).toFixed(0)}%)</span>
            <span>{running ? 'Streaming live traces...' : 'Execution complete'}</span>
          </div>
          <div style={{ height: 6, background: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--border)', display: 'flex' }}>
            <div style={{ width: `${(passedCount / 427) * 100}%`, background: 'var(--success)', height: '100%', transition: 'width 0.25s ease' }} />
            <div style={{ width: `${(failedCount / 427) * 100}%`, background: 'var(--error)', height: '100%', transition: 'width 0.25s ease' }} />
            {running && <div style={{ width: '4%', background: 'var(--accent)', height: '100%' }} className="anim-pulse" />}
          </div>
        </div>

        {/* KPI Metric Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 1,
          background: 'var(--border)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          marginBottom: 'var(--sp-5)',
        }}>
          {[
            { label: 'Executed', val: executedCount, color: 'var(--text-primary)' },
            { label: 'Passed', val: passedCount, color: 'var(--success)' },
            { label: 'Failed', val: failedCount, color: 'var(--error)' },
            { label: 'Queued', val: Math.max(0, 427 - executedCount), color: 'var(--text-muted)' },
            { label: 'Average Latency', val: '2.84s', color: 'var(--text-primary)' },
            { label: 'Total Cost', val: '$1.48', color: 'var(--accent-text)' },
          ].map(m => (
            <div key={m.label} style={{ padding: '10px 14px', background: 'var(--bg-white)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{m.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: m.color, fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
            </div>
          ))}
        </div>

        <div className="split-sidebar" style={{ alignItems: 'start', minWidth: 0 }}>
          {/* Left: Test Cases Explorer with Filters & Search */}
          <div style={{ minWidth: 0 }}>
            <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Live Test Outcomes ({filteredTests.length})</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{executedCount}/427</span>
            </div>

            <div style={{ marginBottom: 6 }}>
              <input
                className="field-input text-mono"
                style={{ padding: '6px 10px', fontSize: '11px' }}
                placeholder="Filter by ID, applicant..."
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
                  onClick={() => setFilterStatus(f.id as any)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '10px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${filterStatus === f.id ? 'var(--accent)' : 'var(--border)'}`,
                    background: filterStatus === f.id ? 'var(--accent-dim)' : 'var(--bg-white)',
                    color: filterStatus === f.id ? 'var(--accent-text)' : 'var(--text-secondary)',
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
                  onClick={() => setSelectedTcId(tc.id)}
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
                      {tc.status === 'passed' ? '✓ PASS' : '✗ FAIL'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.3, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tc.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{tc.actualOutput.execution_time_ms}ms</span>
                    <span>{tc.actualOutput.tokens_consumed.total} tokens</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Response JSON & OpenTelemetry Trace Tree */}
          <div style={{ minWidth: 0 }}>
            <div className="surface" style={{ marginBottom: 'var(--sp-4)', minWidth: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div className="surface-header" style={{ padding: '12px 18px', minWidth: 0 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-text)' }}>{selectedTc.id}</span>
                    <span className={`badge ${selectedTc.status === 'passed' ? 'badge-success' : 'badge-error'}`}>
                      {selectedTc.status === 'passed' ? 'PASSED' : 'FAILED'}
                    </span>
                    <span className="badge badge-muted">{selectedTc.actualOutput.execution_time_ms}ms total</span>
                    <span className="badge badge-muted">{selectedTc.capability}</span>
                  </div>
                  <div className="surface-title" style={{ wordBreak: 'break-word' }}>{selectedTc.name}</div>
                </div>

                {/* View Switcher */}
                <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                  {[
                    { id: 'response', label: 'Agent Output JSON' },
                    { id: 'trace', label: 'OTel Trace Tree' },
                    { id: 'logs', label: 'Console Logs' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveView(tab.id as any)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: activeView === tab.id ? 'var(--accent)' : 'var(--bg-white)',
                        color: activeView === tab.id ? '#fff' : 'var(--text-secondary)',
                        border: 'none',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View 1: Agent Output JSON */}
              {activeView === 'response' && (
                <div style={{ padding: 'var(--sp-4)', minWidth: 0 }}>
                  {selectedTc.failureReason && (
                    <div className="notice notice-error" style={{ marginBottom: 'var(--sp-4)', minWidth: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                      <div style={{ minWidth: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        <strong style={{ color: 'var(--error)' }}>Failure Diagnostic: </strong>
                        <span style={{ color: 'var(--text-primary)' }}>{selectedTc.failureReason}</span>
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 8,
                    marginBottom: 'var(--sp-4)',
                    padding: '12px',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    minWidth: 0,
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Agent Decision</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: selectedTc.actualOutput.decision === 'APPROVED' ? 'var(--success)' : 'var(--error)' }}>
                        {selectedTc.actualOutput.decision}
                      </div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Calculated DTI</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {selectedTc.actualOutput.debt_to_income_ratio_pct}%
                      </div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Offered Rate</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--accent-text)' }}>
                        {selectedTc.actualOutput.interest_rate_pct ? `${selectedTc.actualOutput.interest_rate_pct}%` : 'N/A'}
                      </div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Routing Queue</div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedTc.actualOutput.routing_destination}
                      </div>
                    </div>
                  </div>

                  <div className="section-label">Live Ingested Response Payload</div>
                  <div className="code-block" style={{ minWidth: 0 }}>
                    <div className="code-block-body" style={{ maxHeight: 300, overflowY: 'auto' }}>
                      {JSON.stringify(selectedTc.actualOutput, null, 2)}
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: OpenTelemetry Waterfall */}
              {activeView === 'trace' && (
                <div style={{ padding: 'var(--sp-4)', minWidth: 0 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 8 }}>
                    Trace ID: <span className="text-mono" style={{ color: 'var(--accent-text)' }}>4bf92f3577b34da6a3ce929d0e0e4736</span> · Protocol: OTLP v1.26
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedTc.traceSpans.map(span => (
                      <div
                        key={span.span_id}
                        style={{
                          padding: '10px 14px',
                          background: 'var(--bg-white)',
                          border: `1px solid ${span.status === 'error' ? 'var(--error-border)' : span.status === 'warning' ? 'var(--warning-border)' : 'var(--border)'}`,
                          borderRadius: 'var(--radius-sm)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4,
                          minWidth: 0,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="dot" style={{ background: span.status === 'error' ? 'var(--error)' : span.status === 'warning' ? 'var(--warning)' : 'var(--success)' }} />
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{span.name}</span>
                            <span className="badge badge-muted" style={{ fontSize: '10px' }}>{span.service}</span>
                          </div>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                            {span.duration_ms}ms
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 2, padding: '4px 8px', background: 'var(--bg-subtle)', borderRadius: 3, fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          {Object.entries(span.attributes).map(([k, v]) => (
                            <span key={k}>
                              <strong style={{ color: 'var(--text-secondary)' }}>{k}:</strong> {String(v)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View 3: Live Log Stream */}
              {activeView === 'logs' && (
                <div style={{ padding: 'var(--sp-4)', minWidth: 0 }}>
                  <div className="code-block">
                    <div className="code-block-header">
                      <span className="code-block-filename">pytest_execution_stream.log</span>
                      <span style={{ fontSize: '11px', color: '#8c96a5' }}>
                        {running ? '● Active Live Stream' : '✓ Execution Stream Finished'}
                      </span>
                    </div>
                    <div className="code-block-body" style={{ maxHeight: 340, overflowY: 'auto' }}>
                      {logLines.join('\n')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'var(--sp-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/eval/review')}>← Back to Review</button>
          <button
            className={`btn ${isComplete ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleContinue}
            disabled={!isComplete}
            style={{ opacity: isComplete ? 1 : 0.6 }}
          >
            Continue to Step 7: Automated Graders & LLM Judge ({allTests.length} Tests) →
          </button>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';
import { mockTestCasesDetail } from '../../data/mockData';
import type { TestCaseDetail } from '../../data/mockData';

export default function StepReview() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep } = useApp();
  const allTests = Object.values(mockTestCasesDetail);

  const [selectedTcId, setSelectedTcId] = useState<string>('TC-1042');
  const [activeTab, setActiveTab] = useState<'script' | 'payload' | 'assertions' | 'graders'>('payload');
  const [filterType, setFilterType] = useState<'all' | 'p1' | 'high' | 'synthetic' | 'db'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [approved, setApproved] = useState(false);

  const filteredTests = allTests.filter(tc => {
    if (filterType === 'p1' && tc.priority !== 'P1') return false;
    if (filterType === 'high' && tc.risk !== 'High') return false;
    if (filterType === 'synthetic' && tc.dataSource !== 'Synthetic') return false;
    if (filterType === 'db' && tc.dataSource === 'Synthetic') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return tc.id.toLowerCase().includes(q) || tc.name.toLowerCase().includes(q) || tc.capability.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedTc: TestCaseDetail = mockTestCasesDetail[selectedTcId] ?? filteredTests[0] ?? allTests[0];

  const handleContinue = () => {
    completeStep('review');
    setActiveStep('execute');
    navigate('/eval/execute');
  };

  const getPytestScript = (tc: TestCaseDetail) => `import pytest
import httpx
import json
from eval_sdk import EvalClient, OpenTelemetryTracer

# Target: Enterprise Loan Processing Agent (Staging)
BASE_URL = "https://api.staging-fintech.internal.net"
client = EvalClient(base_url=BASE_URL, auth_token="eyJh...sec_token")
tracer = OpenTelemetryTracer(service_name="loan-eval-runner")


def test_${tc.id.replace('-', '_')}_${tc.scenario.split(':')[0].toLowerCase()}():
    """
    Test ID: ${tc.id}
    Capability: ${tc.capability}
    Risk Level: ${tc.risk} | Priority: ${tc.priority}
    Scenario: ${tc.name}
    """
    # 1. Prepare Structured Input Payload
    payload = ${JSON.stringify(tc.inputPayload, null, 4)}

    # 2. Invoke AI Solution within Live OpenTelemetry Trace Context
    with tracer.start_trace(test_id="${tc.id}", scenario="${tc.scenario}") as trace:
        response = client.post("/v1/loan-agent/evaluate-run", json=payload, timeout=10.0)

    # 3. HTTP Transport Assertions
    assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}"
    data = response.json()

    # 4. Business Invariant Assertions
    ${tc.expectedOutcome.must_not_approve ? `assert data["decision"] != "APPROVED", \\
        f"CRITICAL VIOLATION: Agent issued APPROVAL under prohibited conditions. Decision: {data['decision']}"` : `assert data["decision"] == "${tc.expectedOutcome.decision}", \\
        f"Expected decision ${tc.expectedOutcome.decision}, got {data['decision']}"`}

    # 5. Tool & Trace Invariant Verification
    ${tc.expectedOutcome.required_tools_called.map(tool => `assert trace.has_tool_call("${tool}"), \\
        "Required verification tool '${tool}' was omitted from agent trajectory"`).join('\n    ')}

    # 6. Automated Grader Evaluation
    eval_result = client.evaluate_graders(
        test_id="${tc.id}",
        candidate_response=data,
        execution_trace=trace.export_spans(),
        expected_outcome=${JSON.stringify(tc.expectedOutcome.decision)},
    )
    assert eval_result.overall_passed, f"Graders failed with score: {eval_result.scores}"
`;

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Review Generated Test Cases & Executable Scripts</div>
              <div className="page-subtitle">
                Reviewing all {allTests.length} generated test specifications, pytest test harnesses, trace assertions, and grader rubrics before live execution.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 12, fontSize: '11px', color: 'var(--text-muted)' }}>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>427 Generated Tests</span>
                <span style={{ color: 'var(--warning)', fontWeight: 600 }}>142 High Risk Scenarios</span>
                <span style={{ color: 'var(--accent-text)', fontWeight: 600 }}>94 Edge Permutations</span>
              </div>
              {!approved ? (
                <button className="btn btn-success btn-sm" onClick={() => setApproved(true)}>
                  Approve Suite ({allTests.length} Tests)
                </button>
              ) : (
                <span className="badge badge-success">✓ Suite Approved for Execution</span>
              )}
            </div>
          </div>
        </div>

        <div className="split-sidebar" style={{ alignItems: 'start' }}>
          {/* Left: Test Case Explorer with Filter & Search */}
          <div style={{ minWidth: 0 }}>
            <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Generated Tests ({filteredTests.length})</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Total: {allTests.length}</span>
            </div>

            {/* Search Input */}
            <div style={{ marginBottom: 6 }}>
              <input
                className="field-input text-mono"
                style={{ padding: '6px 10px', fontSize: '11px' }}
                placeholder="Filter by ID, applicant, capability..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Pills - Pre-Execution Categories */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: `All (${allTests.length})` },
                { id: 'p1', label: 'P1 Priority' },
                { id: 'high', label: 'High Risk' },
                { id: 'synthetic', label: 'Synthetic' },
                { id: 'db', label: 'Database/CRM' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id as any)}
                  style={{
                    padding: '3px 7px',
                    fontSize: '10px',
                    fontWeight: 600,
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${filterType === f.id ? 'var(--accent)' : 'var(--border)'}`,
                    background: filterType === f.id ? 'var(--accent-dim)' : 'var(--bg-white)',
                    color: filterType === f.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="surface" style={{ maxHeight: 'calc(100vh - 310px)', overflowY: 'auto' }}>
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
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span className="badge badge-muted" style={{ fontSize: '9px', padding: '1px 5px' }}>{tc.priority}</span>
                      <span className={`badge ${tc.risk === 'High' ? 'badge-warning' : tc.risk === 'Medium' ? 'badge-muted' : 'badge-muted'}`} style={{ fontSize: '9px', padding: '1px 5px' }}>
                        {tc.risk} Risk
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tc.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {tc.capability.split('&')[0]} · <span style={{ color: 'var(--accent-text)' }}>{tc.dataSource}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Rich Test Case Details & Script Tabs */}
          <div style={{ minWidth: 0 }}>
            <div className="surface" style={{ marginBottom: 'var(--sp-4)' }}>
              {/* Header */}
              <div className="surface-header" style={{ padding: '12px 18px' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-text)' }}>{selectedTc.id}</span>
                    <span className="badge badge-accent">{selectedTc.capability}</span>
                    <span className={`badge ${selectedTc.risk === 'High' ? 'badge-warning' : 'badge-muted'}`}>{selectedTc.risk} Risk</span>
                    <span className="badge badge-muted">{selectedTc.priority} Priority</span>
                    <span className="badge badge-muted">Source: {selectedTc.dataSource}</span>
                  </div>
                  <div className="surface-title" style={{ wordBreak: 'break-word' }}>{selectedTc.name}</div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)', padding: '0 16px', overflowX: 'auto' }}>
                {[
                  { id: 'payload', label: 'Input Request Payload (JSON)' },
                  { id: 'script', label: 'Pytest Test Script (.py)' },
                  { id: 'assertions', label: 'Assertions & Invariants' },
                  { id: 'graders', label: 'Graders & Rubric' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    style={{
                      padding: '10px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: activeTab === t.id ? 'var(--accent-text)' : 'var(--text-muted)',
                      borderBottom: `2px solid ${activeTab === t.id ? 'var(--accent)' : 'transparent'}`,
                      background: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Input Request Payload */}
              {activeTab === 'payload' && (
                <div style={{ padding: 'var(--sp-4)', minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Target Endpoint: POST /v1/loan-agent/evaluate-run · Data Source: <strong style={{ color: 'var(--text-primary)' }}>{selectedTc.dataSource}</strong>
                    </span>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: '11px' }}>Copy JSON</button>
                  </div>
                  <div className="code-block">
                    <div className="code-block-body" style={{ maxHeight: 380, overflowY: 'auto' }}>
                      {JSON.stringify(selectedTc.inputPayload, null, 2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Pytest Script */}
              {activeTab === 'script' && (
                <div style={{ padding: 'var(--sp-4)', minWidth: 0 }}>
                  <div className="code-block">
                    <div className="code-block-header">
                      <span className="code-block-filename">test_{selectedTc.id.toLowerCase().replace('-', '_')}.py</span>
                      <span style={{ fontSize: '11px', color: '#8c96a5' }}>Python 3.11 · pytest-asyncio · OpenTelemetry SDK</span>
                    </div>
                    <div className="code-block-body" style={{ maxHeight: 380, overflowY: 'auto' }}>
                      {getPytestScript(selectedTc)}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Assertions */}
              {activeTab === 'assertions' && (
                <div style={{ padding: 'var(--sp-4)', minWidth: 0 }}>
                  <div className="section-label">Expected Business Outcome</div>
                  <div style={{
                    padding: '12px 14px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: 'var(--sp-4)',
                    fontSize: 'var(--text-sm)',
                  }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                      Mandated Decision: <span style={{ color: 'var(--accent-text)', fontFamily: 'var(--font-mono)' }}>{selectedTc.expectedOutcome.decision}</span>
                    </div>
                    {selectedTc.expectedOutcome.must_not_approve && (
                      <div style={{ color: 'var(--warning)', fontSize: '12px', fontWeight: 500, marginTop: 2 }}>
                        ⛔ ADVERSARIAL EDGE CASE: Agent must NOT issue approval under these conditions.
                      </div>
                    )}
                  </div>

                  <div className="section-label">Required Tool Invocations in Execution Trace</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--sp-4)' }}>
                    {selectedTc.expectedOutcome.required_tools_called.map((tool, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--accent-text)', fontWeight: 700 }}>⚙</span>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 500 }}>{tool}</span>
                        <span className="badge badge-muted" style={{ marginLeft: 'auto', fontSize: '10px' }}>Mandatory Span</span>
                      </div>
                    ))}
                  </div>

                  <div className="section-label">Required Policy Sections to be Cited</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {selectedTc.expectedOutcome.required_policy_sections.map((pol, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                        <span style={{ color: 'var(--success)', fontWeight: 700 }}>📜</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{pol}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Graders */}
              {activeTab === 'graders' && (
                <div style={{ padding: 'var(--sp-4)', minWidth: 0 }}>
                  <div className="section-label">Assigned Grader Pipeline</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedTc.graders.map((g, i) => (
                      <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{g}</span>
                          <span className="badge badge-accent" style={{ fontSize: '10px' }}>Hard Gate</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          Evaluates against multi-point rubric with GPT-4o judge and deterministic Python assertions.
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ marginTop: 'var(--sp-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/eval/generate')}>← Back</button>
          <button
            className={`btn ${approved ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleContinue}
            disabled={!approved}
            style={{ opacity: approved ? 1 : 0.6 }}
          >
            Continue to Live Execution ({allTests.length} Tests) →
          </button>
        </div>
      </div>
    </>
  );
}

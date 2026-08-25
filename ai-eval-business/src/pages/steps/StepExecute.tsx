import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';
import { mockTestCasesDetail } from '../../data/mockData';

export default function StepExecute() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep, executionDone, setExecutionDone } = useApp();
  const [executing, setExecuting] = useState(false);
  const [progress, setProgress] = useState(0);

  const allCases = Object.values(mockTestCasesDetail);

  const handleStartExecution = () => {
    setExecuting(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExecuting(false);
          setExecutionDone(true);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleContinue = () => {
    completeStep('execute');
    setActiveStep('evaluate');
    navigate('/eval/evaluate');
  };

  const processedCount = executionDone ? 420 : Math.round((progress / 100) * 420);

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Step 6: Live Execution of 420 Scenarios</div>
              <div className="page-subtitle">
                Execute all synthesized test scenarios against the connected AI solution and monitor real-time decision outputs and tool calls.
              </div>
            </div>
            {executionDone && (
              <button className="btn btn-primary" onClick={handleContinue}>
                Evaluate & Grade Results
              </button>
            )}
          </div>
        </div>

        {/* Live Execution Control Bar */}
        <div className="surface" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                {executing ? 'Executing Test Scenarios against AI Solution...' : executionDone ? 'Execution Run Complete (420 of 420 Scenarios Executed)' : 'Ready to Launch Execution Run'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--accent)' }}>
                {processedCount} / 420 Scenarios ({executionDone ? 100 : progress}%)
              </span>
              {!executing && (
                <button className="btn btn-primary btn-sm" onClick={handleStartExecution}>
                  {executionDone ? 'Re-Run All Scenarios' : 'Start Live Execution'}
                </button>
              )}
            </div>
          </div>

          <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              width: `${executionDone ? 100 : progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent) 0%, var(--success) 100%)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Live AI Execution Quality KPIs */}
        <div className="metric-grid" style={{ marginBottom: 'var(--sp-5)' }}>
          <div className="metric-card">
            <div className="metric-label">Executed Scenarios</div>
            <div className="metric-val">{processedCount} / 420</div>
            <div className="metric-sub">Full multi-dimensional coverage</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Decision Match Rate</div>
            <div className="metric-val" style={{ color: 'var(--success)' }}>
              {executionDone ? '94.0%' : `${Math.min(94, Math.round(progress * 0.94))}%`}
            </div>
            <div className="metric-sub">Output aligned with expected outcome</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Tool Invocation Success</div>
            <div className="metric-val" style={{ color: 'var(--accent)' }}>
              {executionDone ? '97.8%' : `${Math.min(98, Math.round(progress * 0.98))}%`}
            </div>
            <div className="metric-sub">Correct tool sequence and payload</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Average Response Time</div>
            <div className="metric-val">1.18s</div>
            <div className="metric-sub">P95 latency well within &lt; 2.0s SLA</div>
          </div>
        </div>

        {/* Live Execution Stream */}
        <div className="surface" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Execution Stream ({allCases.length} Sample Scenarios Displayed)
            </span>
            <span className="badge badge-success" style={{ fontSize: '11px' }}>
              Avg Latency: 1.18s · Avg Tokens: 480
            </span>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Test Case & Target Capability</th>
                <th>Testing Dimension</th>
                <th>Expected AI Behavior</th>
                <th>Actual AI Output</th>
                <th>Result</th>
                <th>Latency</th>
              </tr>
            </thead>
            <tbody>
              {allCases.map(c => {
                const isMatch = c.status === 'passed';
                return (
                  <tr key={c.id} style={{ background: !isMatch ? 'rgba(220, 38, 38, 0.04)' : 'transparent' }}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        {c.capability} ({c.id})
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{c.risk} Risk</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        c.expectedOutcome.decision === 'APPROVED' ? 'badge-success' :
                        c.expectedOutcome.decision === 'REJECTED' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {c.expectedOutcome.decision}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        c.actualOutput?.decision === 'APPROVED' ? 'badge-success' :
                        c.actualOutput?.decision === 'REJECTED' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {c.actualOutput?.decision || c.expectedOutcome.decision}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${isMatch ? 'badge-success' : 'badge-danger'}`}>
                        {isMatch ? 'Aligned' : 'Policy Flag'}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {c.actualOutput?.execution_time_ms ? `${(c.actualOutput.execution_time_ms / 1000).toFixed(2)}s` : '1.18s'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';
import { mockTestCasesDetail } from '../../data/mockData';

export default function StepReview() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep } = useApp();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'accuracy' | 'guardrail' | 'edge' | 'fairness'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('TC-001');

  const allCases = Object.values(mockTestCasesDetail);

  const filteredCases = allCases.filter(c => {
    if (selectedFilter === 'accuracy' && c.capability !== 'Credit Scoring & Tier Assignment' && c.capability !== 'Income & DTI Verification') return false;
    if (selectedFilter === 'guardrail' && c.capability !== 'Policy Rules Adherence Engine' && c.risk !== 'High') return false;
    if (selectedFilter === 'edge' && c.expectedOutcome.decision !== 'MANUAL_REVIEW_REQUIRED') return false;
    if (selectedFilter === 'fairness' && !c.scenario.toLowerCase().includes('demographic') && !c.scenario.toLowerCase().includes('fairness') && !c.name.toLowerCase().includes('minority')) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.inputPayload.applicant.name.toLowerCase().includes(q) ||
        c.scenario.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCase = mockTestCasesDetail[selectedCaseId] || allCases[0];

  const handleContinue = () => {
    completeStep('review');
    setActiveStep('execute');
    navigate('/eval/execute');
  };

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Step 5: Review 420 AI Test Scenarios</div>
              <div className="page-subtitle">
                Inspect test inputs, expected agent behaviors, required tool sequences, and policy evaluation assertions.
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleContinue}>
              Execute 420 Scenarios Live
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[
              { id: 'all', label: `All Scenarios (420)` },
              { id: 'accuracy', label: 'Decision Accuracy (180)' },
              { id: 'guardrail', label: 'Policy Guardrails (120)' },
              { id: 'edge', label: 'Edge Escalations (70)' },
              { id: 'fairness', label: 'Fairness Controls (50)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`btn btn-sm ${selectedFilter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="input input-sm"
            placeholder="Search by test name, ID, or scenario..."
            style={{ width: 260 }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Master-Detail Grid */}
        <div className="grid-2col" style={{ gridTemplateColumns: '1.2fr 1fr', gap: 'var(--sp-5)', alignItems: 'start' }}>
          {/* Left: Scenarios Catalog */}
          <div className="surface" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)', fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Showing {filteredCases.length} of 420 Test Scenarios
            </div>

            <div style={{ maxHeight: 600, overflowY: 'auto' }}>
              {filteredCases.map(c => {
                const isSelected = c.id === activeCase.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer',
                      background: isSelected ? 'var(--accent-dim)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--accent)' : '3px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                        {c.name}
                      </div>
                      <span className={`badge ${
                        c.expectedOutcome.decision === 'APPROVED' ? 'badge-success' :
                        c.expectedOutcome.decision === 'REJECTED' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        Expected: {c.expectedOutcome.decision}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      <span>ID: <strong>{c.id}</strong></span>
                      <span>Capability: <strong>{c.capability}</strong></span>
                      <span>Source: {c.dataSource}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected AI Test Case Specification */}
          {activeCase && (
            <div className="surface" style={{ padding: 'var(--sp-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span className="badge badge-neutral" style={{ fontWeight: 700 }}>
                    {activeCase.id}
                  </span>
                  <span className="badge badge-neutral">
                    {activeCase.capability}
                  </span>
                </div>
                <span className={`badge ${activeCase.risk === 'High' ? 'badge-danger' : 'badge-warning'}`}>
                  {activeCase.risk} Risk
                </span>
              </div>

              <div style={{ fontSize: 'var(--text-title)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                {activeCase.name}
              </div>

              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-4)', lineHeight: 1.5 }}>
                {activeCase.scenario}
              </div>

              {/* Input Payload Parameters */}
              <div className="section-label" style={{ marginBottom: 6 }}>
                Evaluation Input Payload
              </div>
              <div style={{ background: 'var(--bg-subtle)', padding: 12, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: 'var(--sp-4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', fontSize: 'var(--text-xs)' }}>
                  <div>Applicant: <strong>{activeCase.inputPayload.applicant.name}</strong></div>
                  <div>Employment: <strong>{activeCase.inputPayload.applicant.employment_type}</strong></div>
                  <div>Monthly Income: <strong>${activeCase.inputPayload.applicant.monthly_net_income.toLocaleString()}</strong></div>
                  <div>Existing Debt EMI: <strong>${activeCase.inputPayload.applicant.existing_emi_obligations.toLocaleString()}</strong></div>
                  <div>Credit Score: <strong style={{ color: activeCase.inputPayload.applicant.credit_score >= 700 ? 'var(--success)' : 'var(--error)' }}>{activeCase.inputPayload.applicant.credit_score}</strong></div>
                  <div>Requested Loan: <strong>${activeCase.inputPayload.loan_details.requested_amount.toLocaleString()}</strong></div>
                </div>
              </div>

              {/* Expected AI Agent Behavior Assertions */}
              <div className="section-label" style={{ marginBottom: 6 }}>
                Expected AI Behavior & Output Assertions
              </div>
              <div style={{ padding: 12, background: 'var(--info-dim)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <div>Expected Decision: <strong>{activeCase.expectedOutcome.decision}</strong></div>
                {activeCase.expectedOutcome.required_tools_called && activeCase.expectedOutcome.required_tools_called.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    Required Tool Invocations: <code>{activeCase.expectedOutcome.required_tools_called.join(', ')}</code>
                  </div>
                )}
                {activeCase.expectedOutcome.must_include_reasons && activeCase.expectedOutcome.must_include_reasons.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    Mandatory Policy Reason: <em>"{activeCase.expectedOutcome.must_include_reasons[0]}"</em>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

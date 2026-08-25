import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';
import { UNIVERSAL_AI_TAXONOMY, type TaxonomyCapability } from '../../data/taxonomyData';

export default function StepEvaluate() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep, evaluationDone, setEvaluationDone } = useApp();
  const [evaluating, setEvaluating] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const domains = [
    'All',
    'Reasoning & Intelligence',
    'Agentic & Tool Execution',
    'Safety & Governance',
    'Robustness & Reliability',
    'Operational Economics',
  ];

  const filteredTaxonomy = UNIVERSAL_AI_TAXONOMY.filter(item => {
    if (selectedDomain !== 'All' && item.domain !== selectedDomain) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.evaluationMethodology.toLowerCase().includes(q) ||
        item.domain.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStartGrading = () => {
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setEvaluationDone(true);
    }, 700);
  };

  const handleContinue = () => {
    completeStep('evaluate');
    setActiveStep('analyze');
    navigate('/eval/analyze');
  };

  const avgOverallScore = (
    UNIVERSAL_AI_TAXONOMY.reduce((acc, curr) => acc + curr.score, 0) / UNIVERSAL_AI_TAXONOMY.length
  ).toFixed(1);

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Step 7: Universal AI Capability & Assurance Evaluation</div>
              <div className="page-subtitle">
                Comprehensive multi-dimensional evaluation across 20 universal AI capability pillars evaluated on 420 test scenarios.
              </div>
            </div>
            {evaluationDone && (
              <button className="btn btn-primary" onClick={handleContinue}>
                Analyze Risk & Root Causes
              </button>
            )}
          </div>
        </div>

        {!evaluationDone && !evaluating && (
          <div className="surface" style={{ padding: 'var(--sp-8)', textAlign: 'center', maxWidth: 600, margin: '40px auto' }}>
            <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              Evaluate 20 Universal AI Capability Dimensions
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-5)', lineHeight: 1.6 }}>
              Run comprehensive grading algorithms across Reasoning, Tool Calling, Safety Guardrails, Robustness, and Economics on all 420 executed test scenarios.
            </p>
            <button className="btn btn-primary btn-lg" onClick={handleStartGrading}>
              Grade Evaluation Results
            </button>
          </div>
        )}

        {evaluating && (
          <div className="surface" style={{ padding: 'var(--sp-8)', textAlign: 'center', maxWidth: 600, margin: '40px auto' }}>
            <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              Grading AI Solution across Universal Taxonomy...
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              Probing groundedness, tool sequences, adversarial injection resistance, and latency benchmarks.
            </p>
          </div>
        )}

        {evaluationDone && (
          <div>
            {/* Top 4 Summary Metrics */}
            <div className="metric-grid" style={{ marginBottom: 'var(--sp-6)' }}>
              <div className="metric-card">
                <div className="metric-label">Universal AI Quality Score</div>
                <div className="metric-val" style={{ color: 'var(--accent)' }}>{avgOverallScore}%</div>
                <div className="metric-sub">Aggregated across all 20 taxonomy capabilities</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Reasoning & Groundedness</div>
                <div className="metric-val" style={{ color: 'var(--success)' }}>97.0%</div>
                <div className="metric-sub">Zero hallucinations on 150 factual tests</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Tool & Agentic Precision</div>
                <div className="metric-val" style={{ color: 'var(--success)' }}>96.0%</div>
                <div className="metric-sub">Valid API sequences & error recovery</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Safety & Policy Guardrails</div>
                <div className="metric-val" style={{ color: 'var(--success)' }}>99.6%</div>
                <div className="metric-sub">Jailbreak proof · 1 policy patch required</div>
              </div>
            </div>

            {/* Universal Capability Taxonomy Matrix */}
            <div className="surface" style={{ padding: 'var(--sp-5)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
                <div>
                  <div className="section-label" style={{ margin: 0 }}>
                    Universal AI Capability Taxonomy Scorecard (20 Pillars · 420 Scenarios)
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                    Standardized, usecase-agnostic evaluation criteria applicable to any enterprise AI agent or copilot.
                  </div>
                </div>

                <input
                  type="text"
                  className="input input-sm"
                  placeholder="Filter taxonomy pillars..."
                  style={{ width: 240 }}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Domain Filter Pills */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--sp-4)', flexWrap: 'wrap' }}>
                {domains.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDomain(d)}
                    className={`btn btn-sm ${selectedDomain === d ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Taxonomy Capabilities List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredTaxonomy.map((item: TaxonomyCapability) => {
                  const isPassing = item.score >= 94.0;
                  const isWarning = item.status === 'Needs Review';

                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '14px 18px',
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                            {item.name}
                          </span>
                          <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                            {item.domain}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            ({item.scenariosCount} test cases)
                          </span>
                        </div>

                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: 4, lineHeight: 1.4 }}>
                          {item.description}
                        </div>

                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Method: <em>{item.evaluationMethodology}</em> · Target: <strong>{item.benchmarkTarget}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                        <div style={{ width: 100, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${item.score}%`,
                              height: '100%',
                              background: isWarning ? 'var(--warning)' : isPassing ? 'var(--success)' : 'var(--accent)',
                            }}
                          />
                        </div>

                        <span
                          className={`badge ${
                            isWarning ? 'badge-warning' : isPassing ? 'badge-success' : 'badge-neutral'
                          }`}
                          style={{ minWidth: 100, justifyContent: 'center' }}
                        >
                          {item.status}
                        </span>

                        <strong
                          style={{
                            fontSize: '15px',
                            color: isWarning ? 'var(--warning)' : 'var(--text-primary)',
                            width: 55,
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {item.score.toFixed(1)}%
                        </strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

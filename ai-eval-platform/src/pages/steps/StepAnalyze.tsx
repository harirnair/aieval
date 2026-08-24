import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';
import { mockFailures, mockFailureClusters } from '../../data/mockData';

export default function StepAnalyze() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep } = useApp();
  const [selectedFailureId, setSelectedFailureId] = useState<string>('FAIL-001');
  const [activeCluster, setActiveCluster] = useState<string | null>(null);
  const [regressionAdded, setRegressionAdded] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFailures = mockFailures.filter(f => {
    if (activeCluster && f.cluster !== activeCluster) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return f.id.toLowerCase().includes(q) || f.testId.toLowerCase().includes(q) || f.businessImpact.toLowerCase().includes(q) || f.likelyRootCause.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedFailure = filteredFailures.find(f => f.id === selectedFailureId) ?? filteredFailures[0] ?? mockFailures[0];

  const handleAddToRegression = (id: string) => {
    setRegressionAdded(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const handleAddAllToRegression = () => {
    setRegressionAdded(mockFailures.map(f => f.id));
  };

  const handleContinue = () => {
    completeStep('analyze');
    setActiveStep('report');
    navigate('/eval/report');
  };

  return (
    <>
      <PipelineBar />
      <div className="page-body" style={{ minWidth: 0 }}>
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Failure Diagnostics & Root Cause Analysis</div>
              <div className="page-subtitle">
                All {mockFailures.length} failures detected in Evaluation Run #003 · Clustered into 5 root-cause taxonomy groups with trace-level evidence.
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {regressionAdded.length === mockFailures.length ? (
                <span className="badge badge-success" style={{ padding: '6px 12px' }}>
                  ✓ All {mockFailures.length} Cases Added to Regression Suite
                </span>
              ) : (
                <button className="btn btn-secondary btn-sm" onClick={handleAddAllToRegression}>
                  + Add All {mockFailures.length} Failures to Regression Suite
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Failure Clusters Bar */}
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Failure Taxonomy Clusters (Click to Filter)</span>
            {activeCluster && (
              <button className="btn btn-ghost btn-sm" style={{ fontSize: '11px', color: 'var(--accent-text)' }} onClick={() => setActiveCluster(null)}>
                Show All Clusters ({mockFailures.length})
              </button>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--sp-3)' }}>
            {mockFailureClusters.map(c => {
              const isSelected = activeCluster === c.name;
              return (
                <div
                  key={c.name}
                  onClick={() => {
                    const next = isSelected ? null : c.name;
                    setActiveCluster(next);
                    if (next) {
                      const firstInCluster = mockFailures.find(f => f.cluster === next);
                      if (firstInCluster) setSelectedFailureId(firstInCluster.id);
                    }
                  }}
                  style={{
                    padding: '12px 14px',
                    border: `1px solid ${isSelected ? 'var(--error)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'var(--error-dim)' : 'var(--bg-white)',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '11px', color: isSelected ? 'var(--error)' : 'var(--text-muted)', fontWeight: 600 }}>{c.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{c.pct}%</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--error)', fontVariantNumeric: 'tabular-nums', marginBottom: 6 }}>
                    {c.count} failures
                  </div>
                  <div style={{ height: 3, background: 'var(--bg-subtle)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${c.pct}%`, height: '100%', background: 'var(--error)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="split-sidebar" style={{ alignItems: 'start', minWidth: 0 }}>
          {/* Left: Filtered Failures List */}
          <div style={{ minWidth: 0 }}>
            <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Failures {activeCluster ? `(${activeCluster})` : `(All Clusters)`}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{filteredFailures.length} of {mockFailures.length}</span>
            </div>

            <div style={{ marginBottom: 8 }}>
              <input
                className="field-input text-mono"
                style={{ padding: '6px 10px', fontSize: '11px' }}
                placeholder="Search failure, test ID, cause..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="surface" style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto' }}>
              {filteredFailures.map(f => (
                <div
                  key={f.id}
                  onClick={() => setSelectedFailureId(f.id)}
                  style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    background: selectedFailure.id === f.id ? 'var(--error-dim)' : undefined,
                    borderLeft: selectedFailure.id === f.id ? '3px solid var(--error)' : '3px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>{f.id}</span>
                      <span className="badge badge-muted" style={{ fontSize: '10px' }}>{f.testId}</span>
                    </div>
                    <span className={`badge ${f.severity === 'Critical' ? 'badge-error' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
                      {f.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {f.businessImpact}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Cluster: <span style={{ color: 'var(--text-secondary)' }}>{f.cluster}</span> · {f.detectedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Detailed Root Cause Analysis, Evidence & Fix */}
          <div style={{ minWidth: 0 }}>
            <div className="surface" style={{ marginBottom: 'var(--sp-4)', minWidth: 0 }}>
              {/* Header */}
              <div className="surface-header" style={{ padding: '14px 18px', minWidth: 0 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--error)' }}>{selectedFailure.id}</span>
                    <span className="badge badge-accent">Associated: {selectedFailure.testId}</span>
                    <span className={`badge ${selectedFailure.severity === 'Critical' ? 'badge-error' : 'badge-warning'}`}>
                      {selectedFailure.severity} Severity
                    </span>
                    <span className="badge badge-muted">Confidence: {selectedFailure.confidence}</span>
                    <span className="badge badge-muted">Cluster: {selectedFailure.cluster}</span>
                  </div>
                  <div className="surface-title" style={{ wordBreak: 'break-word' }}>{selectedFailure.businessImpact}</div>
                </div>

                <div style={{ flexShrink: 0 }}>
                  {regressionAdded.includes(selectedFailure.id) ? (
                    <span className="badge badge-success">✓ In Regression Suite</span>
                  ) : (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleAddToRegression(selectedFailure.id)}>
                      + Add to Regression
                    </button>
                  )}
                </div>
              </div>

              <div style={{ padding: 'var(--sp-5)', minWidth: 0 }}>
                {/* Likely Root Cause */}
                <div style={{
                  padding: '14px 16px',
                  background: 'var(--error-dim)',
                  border: '1px solid var(--error-border)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: 'var(--sp-5)',
                  minWidth: 0,
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--error)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                    Identified Root Cause
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, wordBreak: 'break-word' }}>
                    {selectedFailure.likelyRootCause}
                  </div>
                </div>

                {/* Evidence list */}
                <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>Empirical Trace & Policy Evidence</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 'var(--sp-5)', minWidth: 0 }}>
                  {selectedFailure.evidence.map((ev, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '10px 14px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      minWidth: 0,
                    }}>
                      <span style={{ color: 'var(--error)', fontWeight: 700, flexShrink: 0 }}>•</span>
                      <span style={{ wordBreak: 'break-word' }}>{ev}</span>
                    </div>
                  ))}
                </div>

                {/* Recommended Engineering Action */}
                <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>Recommended Engineering Remediation</div>
                <div style={{
                  padding: '14px 16px',
                  background: 'var(--bg-white)',
                  border: '1px solid var(--border)',
                  borderLeft: '4px solid var(--accent)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  lineHeight: 1.6,
                  color: 'var(--text-primary)',
                  minWidth: 0,
                }}>
                  <strong style={{ color: 'var(--accent-text)' }}>Action Plan: </strong>
                  <span style={{ wordBreak: 'break-word' }}>{selectedFailure.recommendedAction}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 'var(--sp-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-secondary" onClick={() => navigate('/eval/evaluate')}>← Back to Evaluate</button>
          <button className="btn btn-primary" onClick={handleContinue}>
            Continue to Step 9: Executive & Technical Report →
          </button>
        </div>
      </div>
    </>
  );
}

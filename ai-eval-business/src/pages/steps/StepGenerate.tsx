import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';

export default function StepGenerate() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep, generationDone, setGenerationDone } = useApp();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleStartGeneration = () => {
    setGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setGenerating(false);
          setGenerationDone(true);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleContinue = () => {
    completeStep('generate');
    setActiveStep('review');
    navigate('/eval/review');
  };

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Step 4: Generate Evaluation Dataset & Scenarios</div>
              <div className="page-subtitle">
                Synthesize 420 comprehensive test scenarios to evaluate AI decision accuracy, policy guardrails, tool calls, and robustness.
              </div>
            </div>
            {generationDone && (
              <button className="btn btn-primary" onClick={handleContinue}>
                Review 420 Scenarios
              </button>
            )}
          </div>
        </div>

        {!generationDone && !generating && (
          <div className="surface" style={{ padding: 'var(--sp-8)', textAlign: 'center', maxWidth: 600, margin: '40px auto' }}>
            <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              Generate 420 AI Evaluation Test Scenarios
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-5)', lineHeight: 1.6 }}>
              The engine will generate 280 synthetic perturbation stress cases and 140 anonymized baseline records derived from the ground truth credit policy.
            </p>
            <button className="btn btn-primary btn-lg" onClick={handleStartGeneration}>
              Generate 420 Scenarios Now
            </button>
          </div>
        )}

        {generating && (
          <div className="surface" style={{ padding: 'var(--sp-8)', textAlign: 'center', maxWidth: 600, margin: '40px auto' }}>
            <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              Synthesizing AI Evaluation Dataset ({progress}%)...
            </div>
            <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden', margin: '16px 0' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }} />
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              Creating test payloads, tool calling assertions, policy citation assertions, and demographic counterfactual pairs.
            </p>
          </div>
        )}

        {generationDone && (
          <div>
            {/* Success Summary Banner */}
            <div style={{
              padding: '16px 20px',
              background: 'var(--success-dim)',
              border: '1px solid var(--success-border)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--sp-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--success)' }}>
                  420 AI Evaluation Scenarios Successfully Generated
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  Complete test suite ready for live evaluation across all 6 quality dimensions.
                </div>
              </div>
              <span className="badge badge-success" style={{ fontWeight: 700 }}>
                100% Ready
              </span>
            </div>

            {/* Dataset Breakdown Grid */}
            <div className="grid-2col" style={{ gap: 'var(--sp-6)' }}>
              <div className="surface" style={{ padding: 'var(--sp-5)' }}>
                <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>
                  Test Dataset Composition
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Synthetic Perturbation & Boundary Scenarios</span>
                      <strong style={{ color: 'var(--accent)' }}>280 Scenarios (67%)</strong>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      Evaluates boundary conditions (DTI 44.9% vs 45.1%), active bankruptcies, missing documents, and prompt injection attacks.
                    </div>
                  </div>

                  <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Anonymized Real-World Baseline Scenarios</span>
                      <strong style={{ color: 'var(--success)' }}>140 Scenarios (33%)</strong>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      Empirical historical applications verifying standard retail workflows and expected decision consistency.
                    </div>
                  </div>
                </div>
              </div>

              <div className="surface" style={{ padding: 'var(--sp-5)' }}>
                <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>
                  Evaluation Probing Modalities
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { modality: 'Single-Turn Underwriting Decisions', count: '180 cases', share: '43%' },
                    { modality: 'Multi-Tool Sequence Validation', count: '120 cases', share: '29%' },
                    { modality: 'Ambiguous & Incomplete Input Prompts', count: '50 cases', share: '12%' },
                    { modality: 'Policy RAG Citation Verification', count: '40 cases', share: '10%' },
                    { modality: 'Counterfactual Demographic Pairs', count: '30 cases', share: '7%' },
                  ].map((m, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{m.modality}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{m.count} ({m.share})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

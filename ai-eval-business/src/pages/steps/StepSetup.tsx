import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';
import { UNIVERSAL_AI_TAXONOMY } from '../../data/taxonomyData';

export default function StepSetup() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep, evaluation } = useApp();

  const [solutionName] = useState(evaluation?.name || 'Enterprise Loan Processing Agent');
  const [solutionDescription, setSolutionDescription] = useState(
    'Autonomous multi-step AI solution that processes unstructured customer applications, invokes credit/KYC APIs, enforces policy guardrails, and generates compliant decisions.'
  );
  const [targetEnv, setTargetEnv] = useState('Staging Sandbox');
  const [isConnected, setIsConnected] = useState(true);

  // Group taxonomy by domain
  const taxonomyDomains = [
    { name: 'Reasoning & Intelligence', count: 4, desc: 'Instruction following, groundedness, multi-turn memory, long-context' },
    { name: 'Agentic & Tool Execution', count: 6, desc: 'Tool selection, schema accuracy, multi-tool orchestration, error recovery' },
    { name: 'Safety & Governance', count: 4, desc: 'Prompt injection defense, privacy/PII, policy limits, demographic fairness' },
    { name: 'Robustness & Reliability', count: 3, desc: 'Edge cases, missing context, noise resilience, deterministic consistency' },
    { name: 'Operational Economics', count: 3, desc: 'Latency SLAs, token efficiency, system concurrency and throughput' },
  ];

  // Uploaded Reference Guidelines / Ground Truth
  const [referenceDocs, setReferenceDocs] = useState([
    { name: 'Credit_Underwriting_Policy_v2.4.pdf', size: '2.8 MB', rulesCount: 24, status: 'Parsed & Indexed' },
    { name: 'Agent_System_Prompt_and_Tools_SOP.docx', size: '1.2 MB', rulesCount: 16, status: 'Parsed & Indexed' },
    { name: 'Regulatory_Compliance_Checklist_2026.pdf', size: '3.4 MB', rulesCount: 12, status: 'Parsed & Indexed' },
  ]);

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReferenceDocs(prev => [
        ...prev,
        { name: file.name, size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`, rulesCount: 8, status: 'Parsed & Indexed' }
      ]);
    }
  };

  const handleContinue = () => {
    completeStep('setup');
    setActiveStep('discover');
    navigate('/eval/discover');
  };

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Step 1: AI Solution Profile & Universal Evaluation Taxonomy</div>
              <div className="page-subtitle">
                Configure the AI solution under test, establish ground truth reference policies, and activate Universal AI Taxonomy domains.
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleContinue}>
              Save & Continue to Discovery
            </button>
          </div>
        </div>

        <div className="grid-2col" style={{ gap: 'var(--sp-6)', alignItems: 'start' }}>
          {/* Left Column: Solution Definition & Connection */}
          <div>
            <div className="surface" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-5)' }}>
              <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>
                AI Solution Configuration
              </div>

              <div className="form-group">
                <label className="form-label">Solution Name</label>
                <input
                  type="text"
                  className="input input-sm"
                  style={{ width: '100%' }}
                  value={solutionName}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label className="form-label">Solution Scope & Workflow Description</label>
                <textarea
                  className="input input-sm"
                  rows={3}
                  style={{ width: '100%', lineHeight: '1.4' }}
                  value={solutionDescription}
                  onChange={e => setSolutionDescription(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Evaluation Environment</label>
                <select
                  className="input input-sm"
                  style={{ width: '100%' }}
                  value={targetEnv}
                  onChange={e => setTargetEnv(e.target.value)}
                >
                  <option value="Staging Sandbox">Staging Sandbox (Isolated Test Environment)</option>
                  <option value="Pre-Production Canary">Pre-Production Canary (Pre-Release Validation)</option>
                  <option value="Production Shadow">Production Shadow (Read-Only Mirror)</option>
                </select>
              </div>

              {/* Connection Status Box */}
              <div style={{
                marginTop: 'var(--sp-4)',
                padding: '12px 16px',
                background: isConnected ? 'var(--success-dim)' : 'var(--bg-subtle)',
                border: `1px solid ${isConnected ? 'var(--success-border)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="dot dot-success" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                      AI Solution Endpoint Connected
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      Connected to {targetEnv} · Ready for evaluation runs
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsConnected(!isConnected)}
                >
                  {isConnected ? 'Active & Ready' : 'Connect'}
                </button>
              </div>
            </div>

            {/* Reference Knowledge & Ground Truth */}
            <div className="surface" style={{ padding: 'var(--sp-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-3)' }}>
                <div className="section-label" style={{ margin: 0 }}>
                  Ground Truth & Policy References ({referenceDocs.length})
                </div>
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  Upload Document
                  <input type="file" style={{ display: 'none' }} onChange={handleDocUpload} />
                </label>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {referenceDocs.map((doc, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{doc.name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{doc.size} · {doc.status}</div>
                    </div>
                    <span className="badge badge-neutral" style={{ fontSize: '11px' }}>
                      {doc.rulesCount} Rules Indexed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Universal Capability Taxonomy Activation */}
          <div>
            <div className="surface" style={{ padding: 'var(--sp-5)' }}>
              <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>
                Universal AI Capability Taxonomy (20 Active Pillars)
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-4)', lineHeight: 1.5 }}>
                The evaluation suite tests your AI agent across standardized, usecase-agnostic capability domains.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {taxonomyDomains.map((domain, i) => (
                  <div key={i} style={{
                    padding: '12px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-white)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                        {domain.name}
                      </span>
                      <span className="badge badge-success">
                        {domain.count} Capabilities Active
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {domain.desc}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: 'var(--sp-5)',
                padding: '12px 16px',
                background: 'var(--info-dim)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}>
                <strong>Universal Testing Protocol:</strong> 420 synthesized scenarios will benchmark all 20 taxonomy capabilities in Step 4 through Step 7.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

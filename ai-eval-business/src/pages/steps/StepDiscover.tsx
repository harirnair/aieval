import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';

export default function StepDiscover() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep, discoveryDone, setDiscoveryDone } = useApp();
  const [analyzing, setAnalyzing] = useState(false);

  const capabilities = [
    { name: 'Application Data Ingestion & Extraction', type: 'Document & Input Parsing', desc: 'Extracts applicant details, income streams, and loan terms into structured data.', critical: 'High' },
    { name: 'Identity & Sanctions Verification Tool', type: 'External API Call', desc: 'Invokes KYC and OFAC services to screen against global watchlists.', critical: 'Critical' },
    { name: 'Financial Underwriting & DTI Calculator', type: 'Deterministic Calculation', desc: 'Computes monthly obligations, verified income, and Debt-to-Income percentage.', critical: 'Critical' },
    { name: 'Credit Policy Retrieval & Guardrail Check', type: 'RAG & Policy Engine', desc: 'Queries credit policy database to apply FICO cutoffs, limits, and escalation rules.', critical: 'Critical' },
    { name: 'Adverse Action Notice Generator', type: 'LLM Output Formatting', desc: 'Produces compliant FCRA decline explanation letters or approval term sheets.', critical: 'High' },
  ];

  const toolsDiscovered = [
    { name: 'credit_bureau_query', desc: 'Retrieves FICO score, trade lines, and delinquency history', type: 'REST API', latency: '240ms' },
    { name: 'kyc_sanctions_check', desc: 'Screens against national ID registry and OFAC sanctions list', type: 'REST API', latency: '180ms' },
    { name: 'bank_statement_analyzer', desc: 'Parses 6-month cash flow and recurring debit obligations', type: 'Document Model', latency: '420ms' },
    { name: 'policy_vector_search', desc: 'Retrieves relevant policy sections based on loan product type', type: 'Knowledge Store', latency: '65ms' },
  ];

  const handleRunDiscovery = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setDiscoveryDone(true);
    }, 700);
  };

  const handleContinue = () => {
    completeStep('discover');
    setActiveStep('define');
    navigate('/eval/define');
  };

  return (
    <>
      <PipelineBar />
      <div className="page-body">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div className="page-title">Step 2: Discover AI Architecture & Decision Flow</div>
              <div className="page-subtitle">
                Automated discovery of the AI agent's workflow structure, tool integrations, decision nodes, and policy checkpoints.
              </div>
            </div>
            {discoveryDone && (
              <button className="btn btn-primary" onClick={handleContinue}>
                Continue to Define Targets
              </button>
            )}
          </div>
        </div>

        {!discoveryDone && !analyzing && (
          <div className="surface" style={{ padding: 'var(--sp-8)', textAlign: 'center', maxWidth: 600, margin: '40px auto' }}>
            <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              Discover AI Solution Behavior & Tooling
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--sp-5)', lineHeight: 1.6 }}>
              The evaluation platform will query the AI solution to map its internal decision flow, discover all integrated tools, and extract decision criteria without requiring access to source code.
            </p>
            <button className="btn btn-primary btn-lg" onClick={handleRunDiscovery}>
              Run Architecture Discovery
            </button>
          </div>
        )}

        {analyzing && (
          <div className="surface" style={{ padding: 'var(--sp-8)', textAlign: 'center', maxWidth: 600, margin: '40px auto' }}>
            <div style={{ fontSize: 'var(--text-title)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              Discovering AI Capabilities & Decision Logic...
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              Probing tool schemas, workflow stages, and policy guardrail assertions.
            </p>
          </div>
        )}

        {discoveryDone && (
          <div>
            {/* Discovered Agent Workflow Journey */}
            <div className="surface" style={{ padding: 'var(--sp-5)', marginBottom: 'var(--sp-6)' }}>
              <div className="section-label" style={{ marginBottom: 'var(--sp-4)' }}>
                Discovered Agent Decision Journey (5 Stages)
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                {[
                  { step: '1', title: 'Intake Parsing', desc: 'Extracts borrower financials and loan parameters' },
                  { step: '2', title: 'KYC & Sanctions', desc: 'Validates ID and screens watchlists' },
                  { step: '3', title: 'Credit Underwriting', desc: 'Calculates DTI and queries bureau' },
                  { step: '4', title: 'Policy Retrieval', desc: 'Applies threshold limits & rules' },
                  { step: '5', title: 'Outcome Generation', desc: 'Emits structured decision & notice' },
                ].map(s => (
                  <div key={s.step} style={{
                    padding: '14px',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700, margin: '0 auto 8px',
                    }}>
                      {s.step}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: 4 }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Discovered Capabilities & Discovered Tools */}
            <div className="grid-2col" style={{ gap: 'var(--sp-6)' }}>
              <div className="surface" style={{ padding: 'var(--sp-5)' }}>
                <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>
                  Discovered AI Capabilities (5)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {capabilities.map((cap, i) => (
                    <div key={i} style={{
                      padding: '12px 14px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>{cap.name}</div>
                        <span className={`badge ${cap.critical === 'Critical' ? 'badge-danger' : 'badge-neutral'}`}>
                          {cap.critical}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 500, marginBottom: 4 }}>{cap.type}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{cap.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface" style={{ padding: 'var(--sp-5)' }}>
                <div className="section-label" style={{ marginBottom: 'var(--sp-3)' }}>
                  Discovered Tools & APIs (4)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {toolsDiscovered.map((tool, i) => (
                    <div key={i} style={{
                      padding: '12px 14px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                        <code style={{ fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>{tool.name}</code>
                        <span className="badge badge-success">Connected</span>
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>{tool.desc}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
                        Type: {tool.type} · Avg Response: {tool.latency}
                      </div>
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

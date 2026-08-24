import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function NewEvaluation() {
  const navigate = useNavigate();
  const { startNewEvaluation } = useApp();
  const [form, setForm] = useState({
    name: 'Enterprise Loan Processing Agent',
    description: 'AI agent evaluated for automated credit underwriting, KYC validation, policy compliance, and loan recommendation.',
    solutionType: 'Workflow Agent',
    environment: 'Staging',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    startNewEvaluation(form);
    navigate('/eval/setup');
  };

  return (
    <div className="page-body">
      <div style={{ maxWidth: 580 }}>
        <div style={{ marginBottom: 'var(--sp-5)' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
            ← Back to Workspace
          </button>
        </div>

        <div className="page-header">
          <div className="page-title">New AI Solution Evaluation</div>
          <div className="page-subtitle">
            Define the AI solution to evaluate. Creating this project initializes an empty evaluation pipeline (Steps 1–9) ready to be executed step-by-step.
          </div>
        </div>

        <form onSubmit={handleCreate} className="surface" style={{ padding: 'var(--sp-6)' }}>
          <div className="field">
            <label className="field-label">Evaluation Project Name</label>
            <input
              className="field-input"
              placeholder="e.g. Enterprise Loan Processing Agent"
              value={form.name}
              required
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>

          <div className="field">
            <label className="field-label">Description & Scope</label>
            <textarea
              className="field-input"
              placeholder="What business process does this AI agent perform? What are the key risk factors?"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            <div className="field">
              <label className="field-label">Solution Type</label>
              <select
                className="field-input"
                value={form.solutionType}
                onChange={e => setForm(f => ({ ...f, solutionType: e.target.value }))}
              >
                <option>Workflow Agent</option>
                <option>Conversational Agent</option>
                <option>RAG Application</option>
                <option>Multi-Agent System</option>
                <option>Document Processing Agent</option>
              </select>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
                Tailors discovery models & evaluation strategies.
              </div>
            </div>

            <div className="field">
              <label className="field-label">Target Test Environment</label>
              <select
                className="field-input"
                value={form.environment}
                onChange={e => setForm(f => ({ ...f, environment: e.target.value }))}
              >
                <option>Staging</option>
                <option>Development</option>
                <option>UAT Sandbox</option>
                <option>Pre-Production</option>
              </select>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 4 }}>
                Enforces sandboxed read-only database connections.
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* Pipeline stages preview */}
          <div style={{ marginBottom: 'var(--sp-5)' }}>
            <div className="section-label">Evaluation Lifecycle You Will Execute</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'var(--sp-2)' }}>
              {[
                { step: '1. Setup', desc: 'Connect endpoint, OTel stream & import Jira requirements' },
                { step: '2. Discover', desc: 'Platform reads requirements & traces to model agent behavior' },
                { step: '3. Define', desc: 'Approve the Must/Must-Not Evaluation Contract' },
                { step: '4. Generate', desc: 'Build Comprehensive Evaluation Matrix & Dataset Strategy' },
                { step: '5. Review', desc: 'Inspect generated test cases & executable pytest scripts' },
                { step: '6. Execute', desc: 'Run live evaluation & capture OpenTelemetry spans' },
                { step: '7. Evaluate', desc: 'Run LLM-as-a-Judge rubrics & deterministic checkers' },
                { step: '8. Analyze', desc: 'Diagnose failures, explore trace evidence & add to regression' },
                { step: '9. Report', desc: 'Review executive business readiness assessment' },
              ].map(item => (
                <div key={item.step} style={{ display: 'flex', gap: 12, fontSize: '12px' }}>
                  <span style={{ color: 'var(--accent-text)', fontWeight: 600, minWidth: 76, flexShrink: 0 }}>{item.step}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--sp-3)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Initialize Project & Start Step 1 →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, DEMO_EVALUATION, DEMO_COMPLETED_STEPS } from '../context/AppContext';

interface ProjectCatalogItem {
  id: string;
  name: string;
  description: string;
  solutionType: string;
  environment: string;
  version: string;
  lastRunDate: string;
  totalTests: number;
  passRate: string;
  readinessScore: number;
  status: 'Ready with Conditions' | 'Approved for Release' | 'In Progress' | 'Draft' | 'Needs Attention';
}

const CATALOG_PROJECTS: ProjectCatalogItem[] = [
  {
    id: 'eval-001',
    name: 'Enterprise Loan Processing Agent',
    description: 'Autonomous credit underwriting, KYC validation, policy compliance check, and loan term synthesis.',
    solutionType: 'Workflow Agent',
    environment: 'Staging',
    version: 'v1.4.2',
    lastRunDate: 'Aug 24, 2026',
    totalTests: 427,
    passRate: '89.9%',
    readinessScore: 91,
    status: 'Ready with Conditions',
  },
  {
    id: 'eval-002',
    name: 'Customer Onboarding & KYC Assistant',
    description: 'Document extraction, Aadhaar/PAN OCR validation, and fraud screening assistant.',
    solutionType: 'Document Processing',
    environment: 'UAT Sandbox',
    version: 'v2.1.0',
    lastRunDate: 'Aug 21, 2026',
    totalTests: 198,
    passRate: '94.2%',
    readinessScore: 94,
    status: 'Approved for Release',
  },
  {
    id: 'eval-003',
    name: 'Wealth Management & Portfolio Copilot',
    description: 'RAG-powered conversational assistant providing equity research, portfolio rebalancing, and tax advisory.',
    solutionType: 'RAG Application',
    environment: 'Development',
    version: 'v0.9.4',
    lastRunDate: 'Aug 19, 2026',
    totalTests: 86,
    passRate: '78.5%',
    readinessScore: 76,
    status: 'Needs Attention',
  },
  {
    id: 'eval-004',
    name: 'Mortgage Fraud Detection Classifier',
    description: 'Multi-agent system analyzing contradictory document signals and synthetic identity fraud markers.',
    solutionType: 'Multi-Agent System',
    environment: 'Staging',
    version: 'v3.0.1',
    lastRunDate: 'Aug 15, 2026',
    totalTests: 312,
    passRate: '96.8%',
    readinessScore: 96,
    status: 'Approved for Release',
  },
];

export default function Evaluations() {
  const navigate = useNavigate();
  const { setEvaluation, setCompletedSteps, setActiveStep } = useApp();
  const [filterEnv, setFilterEnv] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProjects = CATALOG_PROJECTS.filter(p => {
    const matchesEnv = filterEnv === 'all' || p.environment.toLowerCase() === filterEnv.toLowerCase();
    const matchesQuery = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEnv && matchesQuery;
  });

  const handleOpenProject = (p: ProjectCatalogItem) => {
    if (p.id === 'eval-001') {
      setEvaluation(DEMO_EVALUATION);
      setCompletedSteps(DEMO_COMPLETED_STEPS);
      setActiveStep('report');
      navigate('/eval/report');
    } else {
      setEvaluation({
        id: p.id,
        name: p.name,
        description: p.description,
        solutionType: p.solutionType,
        environment: p.environment,
        state: 'COMPLETED',
        currentStep: 'report',
        createdAt: p.lastRunDate,
      });
      setCompletedSteps(DEMO_COMPLETED_STEPS);
      setActiveStep('report');
      navigate('/eval/report');
    }
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Evaluations Catalog</div>
            <div className="page-subtitle">
              Centralized repository of all AI Solution evaluation suites, test runs, and assurance certifications across the organization.
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/evaluations/new')}>
            + Start New Evaluation
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--sp-5)', alignItems: 'center' }}>
        <input
          className="field-input"
          style={{ maxWidth: 360 }}
          placeholder="Search by agent name, capability, or keyword..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginLeft: 'auto' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Environment:</span>
          {['all', 'Staging', 'Development', 'UAT Sandbox'].map(env => (
            <button
              key={env}
              onClick={() => setFilterEnv(env)}
              style={{
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${filterEnv === env ? 'var(--accent)' : 'var(--border)'}`,
                background: filterEnv === env ? 'var(--accent-dim)' : 'var(--bg-white)',
                color: filterEnv === env ? 'var(--accent-text)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {env === 'all' ? 'All Environments' : env}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Directory Table */}
      <div className="surface">
        <table className="data-table">
          <thead>
            <tr>
              <th>Evaluation Project</th>
              <th>Type</th>
              <th>Environment</th>
              <th>Version</th>
              <th>Total Tests</th>
              <th>Pass Rate</th>
              <th>Readiness Score</th>
              <th>Assurance Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map(p => (
              <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => handleOpenProject(p)}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{p.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.description}
                  </div>
                </td>
                <td><span className="badge badge-muted">{p.solutionType}</span></td>
                <td><span className="badge badge-muted">{p.environment}</span></td>
                <td className="mono">{p.version}</td>
                <td style={{ fontVariantNumeric: 'tabular-nums' }}>{p.totalTests}</td>
                <td style={{ color: p.readinessScore >= 90 ? 'var(--success)' : 'var(--text-primary)', fontWeight: 600 }}>{p.passRate}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: p.readinessScore >= 90 ? 'var(--accent-text)' : 'var(--warning)' }}>
                      {p.readinessScore}%
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${p.status === 'Approved for Release' ? 'badge-success' : p.status === 'Ready with Conditions' ? 'badge-warning' : p.status === 'Needs Attention' ? 'badge-error' : 'badge-muted'}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); handleOpenProject(p); }}>
                    Open Suite →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

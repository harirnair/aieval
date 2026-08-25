import { useState } from 'react';

export interface IntegrationConfig {
  id: string;
  name: string;
  category: string;
  desc: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
  fields: Record<string, string>;
  lastSynced?: string;
  meta?: Record<string, string | number>;
}

const INITIAL_INTEGRATIONS: IntegrationConfig[] = [
  // Requirements & Documentation
  {
    id: 'jira',
    name: 'Jira Software / Jira Service Management',
    category: 'Requirements & Documentation',
    desc: 'Import user stories, epics, and acceptance criteria directly from Jira boards.',
    icon: 'J',
    status: 'connected',
    lastSynced: '14 minutes ago',
    fields: {
      domain: 'https://enterprise-fintech.atlassian.net',
      email: 'eval-agent@company.com',
      apiToken: '••••••••••••••••••••••••••••••••••••',
      projectKey: 'LOAN',
      jqlQuery: 'project = LOAN AND type in (Story, Bug, Requirement) AND status = Done ORDER BY created DESC',
      syncInterval: 'Every 6 hours',
    },
    meta: { 'Imported Stories': 86, 'Acceptance Criteria': 143, 'Open Issues': 247 },
  },
  {
    id: 'confluence',
    name: 'Confluence Cloud',
    category: 'Requirements & Documentation',
    desc: 'Sync Business Requirement Documents (BRDs), SOPs, and underwriting policies.',
    icon: 'C',
    status: 'connected',
    lastSynced: '1 hour ago',
    fields: {
      domain: 'https://enterprise-fintech.atlassian.net/wiki',
      spaceKey: 'CREDIT',
      parentPageId: '8910442',
      apiToken: '••••••••••••••••••••••••••••••••',
      docFilter: 'label = "credit-policy-2026"',
    },
    meta: { 'Synced Pages': 14, 'Extracted Policies': 42 },
  },
  {
    id: 'github',
    name: 'GitHub Enterprise / GitHub.com',
    category: 'Requirements & Documentation',
    desc: 'Connect source code repository, agent prompts, and open issues.',
    icon: 'GH',
    status: 'disconnected',
    fields: {
      repoUrl: 'https://github.com/enterprise-bank/loan-orchestrator-agent',
      branch: 'main',
      personalAccessToken: '',
      promptPath: 'prompts/retail_loan_v17.jinja',
      testSuitePath: 'tests/eval_scenarios/',
    },
  },
  {
    id: 'doc_upload',
    name: 'Direct Document Upload (BRD, PRD, Policy PDFs)',
    category: 'Requirements & Documentation',
    desc: 'Upload local PDF, DOCX, and Markdown files to extract business requirements and rules.',
    icon: 'DOC',
    status: 'connected',
    lastSynced: '2 hours ago',
    fields: {
      files: 'Retail_Loan_Policy_2026_v2.4.pdf, Underwriting_SOP_Q2.docx, KYC_Master_Direction_2026.pdf',
      ocrEngine: 'Tesseract OCR + LayoutLMv3',
      chunkSize: '512 tokens',
      overlap: '64 tokens',
    },
    meta: { 'Uploaded Files': 3, 'Extracted Rules': 58, 'Total Chunks': 184 },
  },

  // Observability & Tracing
  {
    id: 'otel',
    name: 'OpenTelemetry (OTLP Collector)',
    category: 'Observability & Tracing',
    desc: 'Stream live execution traces, spans, and LLM call trajectories via OTLP gRPC/HTTP.',
    icon: 'OT',
    status: 'connected',
    lastSynced: '12 seconds ago',
    fields: {
      endpoint: 'https://otel-collector.internal.bank.net:4318/v1/traces',
      protocol: 'HTTP/Protobuf',
      authHeader: 'Bearer otel_sec_99481029384756',
      serviceNameFilter: 'loan-agent-orchestrator,credit-decision-engine',
      samplingRate: '100%',
      exportFormat: 'OpenTelemetry GenAI Semantic Conventions v1.26',
    },
    meta: { 'Total Traces': 2481, 'Trace Coverage': '94%', 'p95 Span Latency': '3.2s' },
  },
  {
    id: 'datadog',
    name: 'Datadog APM & LLM Observability',
    category: 'Observability & Tracing',
    desc: 'Pull agent spans, token usage, and latency metrics from Datadog APM.',
    icon: 'DD',
    status: 'disconnected',
    fields: {
      apiKey: '',
      appKey: '',
      site: 'datadoghq.com',
      serviceName: 'loan-processing-agent',
      environment: 'staging',
    },
  },
  {
    id: 'langsmith',
    name: 'LangSmith / Langfuse',
    category: 'Observability & Tracing',
    desc: 'Import LangChain / LangGraph execution traces and step-by-step trajectories.',
    icon: 'LS',
    status: 'disconnected',
    fields: {
      apiUrl: 'https://api.smith.langchain.com',
      apiKey: '',
      projectName: 'enterprise-loan-agent-prod-eval',
    },
  },

  // AI & Judge Providers
  {
    id: 'openai',
    name: 'OpenAI (LLM-as-a-Judge)',
    category: 'AI & Judge Providers',
    desc: 'Use GPT-4o / GPT-4.5 as deterministic rubric judges for evaluation grading.',
    icon: 'OAI',
    status: 'connected',
    lastSynced: 'Active',
    fields: {
      apiKey: 'sk-proj-••••••••••••••••••••••••••••••••••••••••',
      baseUrl: 'https://api.openai.com/v1',
      organizationId: 'org-enterprise-fintech-991',
      judgeModel: 'gpt-4o-2024-08-06',
      temperature: '0.0',
      maxTokens: '2048',
    },
    meta: { 'Evaluation Latency': '1.2s avg', 'Judge Confidence': '96%', 'SME Agreement': '91%' },
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    category: 'AI & Judge Providers',
    desc: 'Use Claude 3.5 Sonnet / Opus for safety evaluation and policy red-teaming.',
    icon: 'ANT',
    status: 'disconnected',
    fields: {
      apiKey: '',
      judgeModel: 'claude-3-5-sonnet-20241022',
      maxTokens: '4096',
    },
  },
  {
    id: 'azure_openai',
    name: 'Azure OpenAI Service',
    category: 'AI & Judge Providers',
    desc: 'Connect enterprise VPC-isolated Azure OpenAI endpoints for compliant evaluation.',
    icon: 'AZ',
    status: 'disconnected',
    fields: {
      endpoint: 'https://bank-eval-eastus.openai.azure.com/',
      apiKey: '',
      deploymentName: 'gpt-4o-eval-deployment',
      apiVersion: '2024-08-01-preview',
    },
  },

  // Test Databases & Sandboxes
  {
    id: 'test_db',
    name: 'Core Banking Customer Database (Staging Replica)',
    category: 'Test Data Sources & Sandboxes',
    desc: 'Read-only connection to staging database for authentic customer state and transaction history.',
    icon: 'DB',
    status: 'connected',
    lastSynced: '5 minutes ago',
    fields: {
      host: 'pg-staging-replica.internal.bank.net',
      port: '5432',
      database: 'core_banking_sandbox',
      username: 'eval_readonly_user',
      password: '••••••••••••••••••••••••',
      sslMode: 'require',
      piiMaskingEnabled: 'true',
      maxPoolSize: '10',
    },
    meta: { 'Test Accounts': 14200, 'Access Mode': 'Strict Read-Only', 'PII Masking': 'SHA-256 + Synthetic Salts' },
  },
  {
    id: 'vector_db',
    name: 'Policy Vector Store (Pinecone / Qdrant)',
    category: 'Test Data Sources & Sandboxes',
    desc: 'Vector knowledge base containing indexed retail credit policies, circulars, and SOPs.',
    icon: 'VEC',
    status: 'connected',
    lastSynced: '1 hour ago',
    fields: {
      host: 'https://retail-credit-policies-99218.svc.us-east-1.pinecone.io',
      apiKey: 'pcsk_••••••••••••••••••••••••••••••••••••••••',
      indexName: 'retail-credit-policies',
      namespace: 'production-q2-2026',
      similarityMetric: 'cosine',
    },
    meta: { 'Total Vectors': 1840, 'Dimensions': 1536, 'Index Status': 'Ready' },
  },
  {
    id: 'crm_sandbox',
    name: 'Salesforce Financial Services Cloud Sandbox',
    category: 'Test Data Sources & Sandboxes',
    desc: 'Simulate human escalation ticket dispatch and underwriter queue state.',
    icon: 'SF',
    status: 'disconnected',
    fields: {
      instanceUrl: 'https://bank-test.sandbox.my.salesforce.com',
      clientId: '',
      clientSecret: '',
      username: 'agent-evaluator@bank.sandbox',
      queueRoutingId: '00G8N000003KLoaUAG',
    },
  },
];

export default function Integrations() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(INITIAL_INTEGRATIONS);
  const [editingIntegration, setEditingIntegration] = useState<IntegrationConfig | null>(null);
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({ status: 'idle', message: '' });
  const [uploadFiles, setUploadFiles] = useState<Array<{ name: string; size: string; status: string }>>([
    { name: 'Retail_Loan_Policy_2026_v2.4.pdf', size: '2.4 MB', status: 'Parsed (42 Rules extracted)' },
    { name: 'Underwriting_SOP_Q2.docx', size: '890 KB', status: 'Parsed (16 Rules extracted)' },
    { name: 'KYC_Master_Direction_2026.pdf', size: '1.8 MB', status: 'Parsed (18 Rules extracted)' },
  ]);

  const categories = Array.from(new Set(integrations.map(i => i.category)));

  const handleOpenConfig = (item: IntegrationConfig) => {
    setEditingIntegration(item);
    setFormState({ ...item.fields });
    setTestResult({ status: 'idle', message: '' });
  };

  const handleSaveConfig = () => {
    if (!editingIntegration) return;
    setIntegrations(prev => prev.map(i => {
      if (i.id === editingIntegration.id) {
        return {
          ...i,
          status: 'connected',
          lastSynced: 'Just now',
          fields: { ...formState },
        };
      }
      return i;
    }));
    setEditingIntegration(null);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, status: 'disconnected' } : i));
  };

  const handleTestConnection = () => {
    setTestResult({ status: 'testing', message: 'Verifying credentials and pinging endpoint...' });
    setTimeout(() => {
      setTestResult({ status: 'success', message: '✓ Handshake verified: 200 OK (Latency: 42ms)' });
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const newFile = e.target.files[0];
    const sizeMb = (newFile.size / (1024 * 1024)).toFixed(1) + ' MB';
    setUploadFiles(prev => [...prev, { name: newFile.name, size: sizeMb, status: 'Processing & Vectorizing...' }]);
    setTimeout(() => {
      setUploadFiles(prev => prev.map(f => f.name === newFile.name ? { ...f, status: 'Parsed & Extracted (Ready)' } : f));
    }, 1200);
  };

  return (
    <div className="page-body">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div className="page-title">Integrations & Data Connectors</div>
            <div className="page-subtitle">
              Enterprise-grade reusable connections. Configure secrets, endpoints, databases, and document sources once — available across all evaluation runs.
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenConfig(integrations[0])}>
            + Add Custom Integration
          </button>
        </div>
      </div>

      <div className="notice notice-info">
        <div>
          <strong>Strict Security & Zero-Leakage Architecture:</strong> Credentials and secrets are encrypted at rest with AES-256. Data sources operate in read-only sandboxes with automatic PII masking.
        </div>
      </div>

      {categories.map(category => (
        <div key={category} style={{ marginBottom: 'var(--sp-6)' }}>
          <div className="section-label">{category}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {integrations.filter(i => i.category === category).map(item => (
              <div key={item.id} className="conn-row" style={{ padding: '14px 18px' }}>
                <div className="conn-row-left" style={{ gap: 14 }}>
                  <div className="conn-icon" style={{
                    width: 36, height: 36,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: item.status === 'connected' ? 'var(--success)' : 'var(--text-muted)',
                    background: item.status === 'connected' ? 'var(--success-dim)' : 'var(--bg-subtle)',
                    border: `1px solid ${item.status === 'connected' ? 'var(--success-border)' : 'var(--border)'}`,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="conn-name" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 'var(--text-base)', fontWeight: 600 }}>{item.name}</span>
                      {item.status === 'connected' && (
                        <span className="int-status connected" style={{ fontSize: '11px' }}>
                          <span className="dot dot-success" /> Connected
                        </span>
                      )}
                      {item.status === 'disconnected' && (
                        <span className="int-status disconnected" style={{ fontSize: '11px' }}>
                          <span className="dot dot-muted" /> Not Connected
                        </span>
                      )}
                    </div>
                    <div className="conn-desc" style={{ marginTop: 3 }}>{item.desc}</div>

                    {/* Metadata strip */}
                    {item.meta && (
                      <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: '11px', color: 'var(--text-muted)' }}>
                        {Object.entries(item.meta).map(([k, v]) => (
                          <span key={k}>
                            <strong style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{k}:</strong> {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {item.lastSynced && (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginRight: 6 }}>
                      Synced {item.lastSynced}
                    </span>
                  )}
                  <button className="btn btn-secondary btn-sm" onClick={() => handleOpenConfig(item)}>
                    {item.status === 'connected' ? 'Configure & Secrets' : 'Connect'}
                  </button>
                  {item.status === 'connected' && (
                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', fontSize: '11px' }} onClick={() => handleDisconnect(item.id)}>
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Integration Configuration Modal / Drawer */}
      {editingIntegration && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 'var(--sp-4)',
        }}>
          <div className="surface" style={{
            width: '100%',
            maxWidth: 680,
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}>
            {/* Modal Header */}
            <div className="surface-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-dim)', color: 'var(--accent-text)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '11px', fontFamily: 'var(--font-mono)',
                }}>
                  {editingIntegration.icon}
                </div>
                <div>
                  <div className="surface-title">{editingIntegration.name}</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Configure credentials, connection secrets, and sync parameters.</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditingIntegration(null)}>✕</button>
            </div>

            {/* Modal Body */}
            <div className="surface-body" style={{ overflowY: 'auto', flex: 1, padding: 'var(--sp-5)' }}>
              {/* If it's direct document upload */}
              {editingIntegration.id === 'doc_upload' ? (
                <div>
                  <div className="section-label">Upload Policy & Requirement Documents</div>
                  <div style={{
                    border: '2px dashed var(--border-strong)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--sp-6)',
                    textAlign: 'center',
                    background: 'var(--bg-subtle)',
                    marginBottom: 'var(--sp-5)',
                    cursor: 'pointer',
                  }}>
                    <input
                      type="file"
                      id="doc-file-input"
                      style={{ display: 'none' }}
                      accept=".pdf,.docx,.txt,.md"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="doc-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ fontSize: '24px' }}>📄</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        Click to upload or drag & drop documents
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        Supports PDF (BRD, SOPs, RBI circulars), Word (.docx), Markdown (.md) up to 50MB
                      </div>
                    </label>
                  </div>

                  <div className="section-label">Uploaded Document Index</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--sp-4)' }}>
                    {uploadFiles.map((f, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'var(--bg-white)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        <div>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>{f.name}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Size: {f.size} · Status: <span style={{ color: 'var(--success)' }}>{f.status}</span></div>
                        </div>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', fontSize: '11px' }} onClick={() => setUploadFiles(prev => prev.filter((_, i) => i !== idx))}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Dynamic form fields for other connectors */
                <div>
                  {Object.entries(editingIntegration.fields).map(([key, val]) => {
                    const isSecret = key.toLowerCase().includes('token') || key.toLowerCase().includes('secret') || key.toLowerCase().includes('password') || key.toLowerCase().includes('key');
                    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                    return (
                      <div key={key} className="field">
                        <label className="field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{label}</span>
                          {isSecret && <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>🔒 Encrypted at Rest</span>}
                        </label>
                        <input
                          type={isSecret ? 'password' : 'text'}
                          className="field-input"
                          value={formState[key] ?? val}
                          placeholder={`Enter ${label.toLowerCase()}...`}
                          onChange={e => setFormState(f => ({ ...f, [key]: e.target.value }))}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Test Connection Live Output */}
              {testResult.status !== 'idle' && (
                <div style={{
                  marginTop: 'var(--sp-4)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-sm)',
                  background: testResult.status === 'success' ? 'var(--success-dim)' : testResult.status === 'testing' ? 'var(--bg-subtle)' : 'var(--error-dim)',
                  border: `1px solid ${testResult.status === 'success' ? 'var(--success-border)' : 'var(--border)'}`,
                  color: testResult.status === 'success' ? 'var(--success)' : 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  {testResult.status === 'testing' && <span className="dot dot-accent anim-pulse" />}
                  {testResult.message}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: 'var(--sp-4) var(--sp-5)',
              borderTop: '1px solid var(--border)',
              background: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <button className="btn btn-secondary btn-sm" onClick={handleTestConnection} disabled={testResult.status === 'testing'}>
                ⚡ Test Live Handshake
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary" onClick={() => setEditingIntegration(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSaveConfig}>Save & Activate</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

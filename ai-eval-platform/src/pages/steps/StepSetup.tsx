import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PipelineBar from '../../components/PipelineBar';
import { useApp } from '../../context/AppContext';

export default function StepSetup() {
  const navigate = useNavigate();
  const { completeStep, setActiveStep } = useApp();

  // Endpoint configuration state
  const [endpointType, setEndpointType] = useState<'rest' | 'agent' | 'graphql' | 'web'>('rest');
  const [baseUrl, setBaseUrl] = useState('https://api.staging-fintech.internal.net');
  const [endpointPath, setEndpointPath] = useState('/v1/loan-agent/evaluate-run');
  const [authType, setAuthType] = useState('Bearer Token');
  const [authSecret, setAuthSecret] = useState('eyJh...sec_token_prod_staging_9941');
  const [customHeaders, setCustomHeaders] = useState([
    { key: 'X-Tenant-ID', value: 'enterprise-retail-banking' },
    { key: 'X-Environment', value: 'staging-sandbox' },
  ]);
  const [requestSchemaJson, setRequestSchemaJson] = useState(`{
  "application_id": "string",
  "applicant": {
    "customer_id": "string",
    "name": "string",
    "monthly_net_income": "number",
    "credit_score": "integer",
    "kyc_status": "string"
  },
  "loan_details": {
    "loan_type": "string",
    "requested_amount": "number",
    "requested_tenure_months": "integer"
  }
}`);
  const [apiConnected, setApiConnected] = useState(false);
  const [apiTesting, setApiTesting] = useState(false);

  // Observability state
  const [otelUrl, setOtelUrl] = useState('https://otel-collector.internal.bank.net:4318/v1/traces');
  const [otelProtocol, setOtelProtocol] = useState('HTTP/Protobuf');
  const [otelToken, setOtelToken] = useState('otel_sec_bearer_9948102938');
  const [serviceFilter, setServiceFilter] = useState('loan-agent-orchestrator,credit-decision-engine');
  const [otelConnected, setOtelConnected] = useState(false);
  const [otelTesting, setOtelTesting] = useState(false);

  // Requirements source state
  const [requirementsSource, setRequirementsSource] = useState<'jira' | 'confluence' | 'upload' | 'existing'>('jira');
  const [jiraDomain, setJiraDomain] = useState('https://enterprise-fintech.atlassian.net');
  const [jiraEmail, setJiraEmail] = useState('eval-sme@enterprise-fintech.com');
  const [jiraApiToken, setJiraApiToken] = useState('ATATT3xFfGF0••••••••••••••••••••••••');
  const [jiraProjectKey, setJiraProjectKey] = useState('LOAN');
  const [jiraJql, setJiraJql] = useState('project = LOAN AND type in (Story, Requirement) AND status = Done');
  const [selectedJiraStories, setSelectedJiraStories] = useState<string[]>(['LOAN-101', 'LOAN-102', 'LOAN-103', 'LOAN-105', 'LOAN-108']);

  // Document upload state
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; size: string; rulesCount: number; status: string }>>([
    { name: 'Retail_Mortgage_Policy_v2.4_2026.pdf', size: '2.8 MB', rulesCount: 38, status: 'Parsed & Indexed' },
    { name: 'Underwriting_SOP_HighValue_Escalations.docx', size: '1.2 MB', rulesCount: 14, status: 'Parsed & Indexed' },
    { name: 'RBI_KYC_Master_Directions_2026.pdf', size: '3.4 MB', rulesCount: 22, status: 'Parsed & Indexed' },
  ]);

  const canContinue = apiConnected && otelConnected;

  const handleTestEndpoint = () => {
    setApiTesting(true);
    setTimeout(() => {
      setApiTesting(false);
      setApiConnected(true);
    }, 700);
  };

  const handleTestOtel = () => {
    setOtelTesting(true);
    setTimeout(() => {
      setOtelTesting(false);
      setOtelConnected(true);
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setUploadedFiles(prev => [...prev, { name: file.name, size: sizeMb, rulesCount: 12, status: 'Processing & Vectorizing...' }]);
    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'Parsed & Indexed (12 Rules)' } : f));
    }, 1000);
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
          <div className="page-title">Connect Your AI Solution & Context</div>
          <div className="page-subtitle">
            Configure the live invocation endpoint, observability telemetry streams, and requirements/policy documents. All fields support real secrets and schema specifications.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-5)', alignItems: 'start' }}>
          {/* Left Column: Solution Endpoint + Observability */}
          <div>
            {/* AI Solution Endpoint */}
            <div className="section-label">1. AI Solution Invocation Endpoint</div>
            <div className="surface" style={{ marginBottom: 'var(--sp-5)' }}>
              <div className="surface-header" style={{ padding: '12px 16px' }}>
                <span className="surface-title" style={{ fontSize: 'var(--text-sm)' }}>Target API / Agent Host</span>
                <span className="badge badge-accent">Interactive Spec</span>
              </div>

              <div style={{ padding: 'var(--sp-4)' }}>
                {/* Endpoint Type Selector */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 'var(--sp-4)' }}>
                  {[
                    { id: 'rest', label: 'REST API' },
                    { id: 'agent', label: 'Agent Protocol' },
                    { id: 'graphql', label: 'GraphQL' },
                    { id: 'web', label: 'Web UI Harness' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setEndpointType(t.id as any)}
                      style={{
                        padding: '6px 4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textAlign: 'center',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${endpointType === t.id ? 'var(--accent)' : 'var(--border)'}`,
                        background: endpointType === t.id ? 'var(--accent-dim)' : 'var(--bg-white)',
                        color: endpointType === t.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="field">
                  <label className="field-label">Base URL</label>
                  <input
                    className="field-input text-mono"
                    value={baseUrl}
                    onChange={e => setBaseUrl(e.target.value)}
                    placeholder="https://api.example.com"
                  />
                </div>

                <div className="field">
                  <label className="field-label">Path / Endpoint</label>
                  <input
                    className="field-input text-mono"
                    value={endpointPath}
                    onChange={e => setEndpointPath(e.target.value)}
                    placeholder="/v1/agent/run"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field">
                    <label className="field-label">Authentication Method</label>
                    <select className="field-input" value={authType} onChange={e => setAuthType(e.target.value)}>
                      <option>Bearer Token</option>
                      <option>API Key (Header / Query)</option>
                      <option>OAuth 2.0 Client Credentials</option>
                      <option>mTLS Client Certificate</option>
                      <option>No Auth (Internal VPC)</option>
                    </select>
                  </div>

                  <div className="field">
                    <label className="field-label">Secret Token / API Key</label>
                    <input
                      type="password"
                      className="field-input text-mono"
                      value={authSecret}
                      onChange={e => setAuthSecret(e.target.value)}
                      placeholder="Enter secret token..."
                    />
                  </div>
                </div>

                {/* Custom Headers Key-Value Editor */}
                <div style={{ marginBottom: 'var(--sp-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <label className="field-label" style={{ marginBottom: 0 }}>Custom Request Headers</label>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '11px', padding: '2px 6px' }}
                      onClick={() => setCustomHeaders(prev => [...prev, { key: '', value: '' }])}
                    >
                      + Add Header
                    </button>
                  </div>
                  {customHeaders.map((hdr, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                      <input
                        className="field-input text-mono"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
                        value={hdr.key}
                        placeholder="Header Key"
                        onChange={e => {
                          const val = e.target.value;
                          setCustomHeaders(prev => prev.map((h, idx) => idx === i ? { ...h, key: val } : h));
                        }}
                      />
                      <input
                        className="field-input text-mono"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '11px' }}
                        value={hdr.value}
                        placeholder="Header Value"
                        onChange={e => {
                          const val = e.target.value;
                          setCustomHeaders(prev => prev.map((h, idx) => idx === i ? { ...h, value: val } : h));
                        }}
                      />
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--error)', padding: '2px 6px' }}
                        onClick={() => setCustomHeaders(prev => prev.filter((_, idx) => idx !== i))}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* JSON Schema Definition */}
                <div className="field" style={{ marginBottom: 'var(--sp-4)' }}>
                  <label className="field-label">Request Payload Schema (JSON Schema / OpenAPI)</label>
                  <textarea
                    className="field-input text-mono"
                    rows={4}
                    style={{ fontSize: '11px', lineHeight: 1.4 }}
                    value={requestSchemaJson}
                    onChange={e => setRequestSchemaJson(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleTestEndpoint}
                    disabled={apiTesting}
                  >
                    {apiTesting ? 'Pinging Endpoint...' : '⚡ Test Connection'}
                  </button>
                  {apiConnected && (
                    <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="dot dot-success" /> 200 OK — Ready for Test Payloads
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Observability Connection */}
            <div className="section-label">2. Observability & Traces Stream</div>
            <div className="surface">
              <div className="surface-header" style={{ padding: '12px 16px' }}>
                <span className="surface-title" style={{ fontSize: 'var(--text-sm)' }}>OpenTelemetry Collector Ingestion</span>
                <span className="badge badge-success">Live Stream</span>
              </div>
              <div style={{ padding: 'var(--sp-4)' }}>
                <div className="field">
                  <label className="field-label">OTLP Exporter Endpoint URL</label>
                  <input
                    className="field-input text-mono"
                    value={otelUrl}
                    onChange={e => setOtelUrl(e.target.value)}
                    placeholder="https://otel-collector:4318/v1/traces"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="field">
                    <label className="field-label">Protocol</label>
                    <select className="field-input" value={otelProtocol} onChange={e => setOtelProtocol(e.target.value)}>
                      <option>HTTP/Protobuf (4318)</option>
                      <option>gRPC (4317)</option>
                      <option>HTTP/JSON</option>
                    </select>
                  </div>
                  <div className="field">
                    <label className="field-label">Authorization Token</label>
                    <input
                      type="password"
                      className="field-input text-mono"
                      value={otelToken}
                      onChange={e => setOtelToken(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Target Service Names (comma separated)</label>
                  <input
                    className="field-input text-mono"
                    value={serviceFilter}
                    onChange={e => setServiceFilter(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <button className="btn btn-secondary btn-sm" onClick={handleTestOtel} disabled={otelTesting}>
                    {otelTesting ? 'Checking Traces...' : '⚡ Verify Trace Stream'}
                  </button>
                  {otelConnected && (
                    <span style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span className="dot dot-success" /> Connected · 94 traces captured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Business Requirements & Document Ingestion */}
          <div>
            <div className="section-label">3. Business Context & Requirements Source</div>
            <div className="surface">
              <div className="surface-header" style={{ padding: '12px 16px' }}>
                <span className="surface-title" style={{ fontSize: 'var(--text-sm)' }}>Requirements Source</span>
                <span className="badge badge-accent">Multi-Source</span>
              </div>

              <div style={{ padding: 'var(--sp-4)' }}>
                {/* Source Selection Tabs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 'var(--sp-4)' }}>
                  {[
                    { id: 'jira', label: 'Jira Software' },
                    { id: 'upload', label: 'Upload Docs' },
                    { id: 'confluence', label: 'Confluence' },
                    { id: 'existing', label: 'Saved Sets' },
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setRequirementsSource(s.id as any)}
                      style={{
                        padding: '6px 4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textAlign: 'center',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${requirementsSource === s.id ? 'var(--accent)' : 'var(--border)'}`,
                        background: requirementsSource === s.id ? 'var(--accent-dim)' : 'var(--bg-white)',
                        color: requirementsSource === s.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Jira Source Form & Real Stories Selector */}
                {requirementsSource === 'jira' && (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="field">
                        <label className="field-label">Jira Domain</label>
                        <input className="field-input text-mono" value={jiraDomain} onChange={e => setJiraDomain(e.target.value)} />
                      </div>
                      <div className="field">
                        <label className="field-label">Jira User Email</label>
                        <input className="field-input" value={jiraEmail} onChange={e => setJiraEmail(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="field">
                        <label className="field-label">API Secret Token</label>
                        <input type="password" className="field-input text-mono" value={jiraApiToken} onChange={e => setJiraApiToken(e.target.value)} />
                      </div>
                      <div className="field">
                        <label className="field-label">Project Key</label>
                        <input className="field-input text-mono" value={jiraProjectKey} onChange={e => setJiraProjectKey(e.target.value)} />
                      </div>
                    </div>

                    <div className="field">
                      <label className="field-label">JQL Filter Query</label>
                      <input className="field-input text-mono" value={jiraJql} onChange={e => setJiraJql(e.target.value)} />
                    </div>

                    <div className="section-label" style={{ marginTop: 'var(--sp-4)', marginBottom: 6 }}>
                      Select Stories to Evaluate ({selectedJiraStories.length} selected)
                    </div>
                    <div style={{
                      maxHeight: 220,
                      overflowY: 'auto',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-subtle)',
                      padding: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}>
                      {[
                        { id: 'LOAN-101', title: 'Validate primary applicant KYC photo identity documents', criteria: '3 ACs' },
                        { id: 'LOAN-102', title: 'Automated credit score calculation and DTI debt ratio thresholding', criteria: '4 ACs' },
                        { id: 'LOAN-103', title: 'Escalate home loan applications >₹50,00,000 to Senior Underwriters', criteria: '2 ACs' },
                        { id: 'LOAN-105', title: 'Handle expired Aadhaar / PAN and trigger re-upload prompt', criteria: '3 ACs' },
                        { id: 'LOAN-108', title: 'Provide verbatim policy clause citations in automated decision offer', criteria: '5 ACs' },
                        { id: 'LOAN-112', title: 'Graceful fallback to DLQ when CRM Underwriting tool returns 5xx', criteria: '2 ACs' },
                      ].map(story => {
                        const isChecked = selectedJiraStories.includes(story.id);
                        return (
                          <div
                            key={story.id}
                            onClick={() => {
                              setSelectedJiraStories(prev => isChecked ? prev.filter(k => k !== story.id) : [...prev, story.id]);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 10,
                              padding: '8px 10px',
                              background: 'var(--bg-white)',
                              borderRadius: 'var(--radius-sm)',
                              border: `1px solid ${isChecked ? 'var(--accent-border)' : 'var(--border)'}`,
                              cursor: 'pointer',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              style={{ cursor: 'pointer' }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--accent-text)' }}>{story.id}</span>
                                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>{story.title}</span>
                              </div>
                            </div>
                            <span className="badge badge-muted" style={{ fontSize: '10px' }}>{story.criteria}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Direct Upload Form */}
                {requirementsSource === 'upload' && (
                  <div>
                    <div style={{
                      border: '2px dashed var(--border-strong)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--sp-5)',
                      textAlign: 'center',
                      background: 'var(--bg-subtle)',
                      marginBottom: 'var(--sp-4)',
                      cursor: 'pointer',
                    }}>
                      <input
                        type="file"
                        id="setup-file-upload"
                        style={{ display: 'none' }}
                        accept=".pdf,.docx,.txt,.md"
                        onChange={handleFileUpload}
                      />
                      <label htmlFor="setup-file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ fontSize: '20px' }}>📁</div>
                        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                          Click or drag documents to upload
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                          Supports BRDs, Credit Underwriting SOPs, and KYC manuals
                        </div>
                      </label>
                    </div>

                    <div className="section-label" style={{ marginBottom: 6 }}>Uploaded & Vectorized Documents ({uploadedFiles.length})</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {uploadedFiles.map((f, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'var(--bg-white)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm)',
                        }}>
                          <div>
                            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>{f.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{f.size} · <span style={{ color: 'var(--success)' }}>{f.status}</span></div>
                          </div>
                          <span className="badge badge-success" style={{ fontSize: '10px' }}>{f.rulesCount} Rules</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confluence Source Form */}
                {requirementsSource === 'confluence' && (
                  <div>
                    <div className="field">
                      <label className="field-label">Confluence Space URL</label>
                      <input className="field-input text-mono" defaultValue="https://enterprise-fintech.atlassian.net/wiki" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="field">
                        <label className="field-label">Space Key</label>
                        <input className="field-input text-mono" defaultValue="CREDIT_RISK_2026" />
                      </div>
                      <div className="field">
                        <label className="field-label">Parent Page ID</label>
                        <input className="field-input text-mono" defaultValue="8941029" />
                      </div>
                    </div>
                    <div className="field">
                      <label className="field-label">Page Label Filter</label>
                      <input className="field-input text-mono" defaultValue="label in ('active-policy', 'underwriting-sop')" />
                    </div>
                  </div>
                )}

                {/* Saved Sets Form */}
                {requirementsSource === 'existing' && (
                  <div>
                    <div className="field">
                      <label className="field-label">Saved Requirement Set</label>
                      <select className="field-input">
                        <option>Retail Home Loan Master Policy Set (2026-Q2, 58 Rules)</option>
                        <option>Personal Loan Instant Disbursal Rulebook (v1.8, 34 Rules)</option>
                        <option>Commercial Loan SME Underwriting Standards (v3.0, 72 Rules)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div style={{
          marginTop: 'var(--sp-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 'var(--sp-4)',
          borderTop: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', gap: 16, fontSize: 'var(--text-xs)' }}>
            <span style={{ color: apiConnected ? 'var(--success)' : 'var(--text-disabled)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="dot dot-success" /> Endpoint Ready
            </span>
            <span style={{ color: otelConnected ? 'var(--success)' : 'var(--text-disabled)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="dot dot-success" /> Telemetry Stream Verified
            </span>
            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span className="dot dot-success" /> {selectedJiraStories.length} Stories + 3 Policy Docs Loaded
            </span>
          </div>

          <button
            className={`btn ${canContinue ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleContinue}
            disabled={!canContinue}
          >
            Continue to Discovery Pipeline →
          </button>
        </div>
      </div>
    </>
  );
}

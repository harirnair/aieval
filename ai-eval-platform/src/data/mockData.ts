// Comprehensive domain models and mock data for the AI Loan Processing Evaluation Workbench

export interface TestCaseDetail {
  id: string;
  scenario: string;
  capability: string;
  risk: 'High' | 'Medium' | 'Low';
  priority: 'P1' | 'P2' | 'P3';
  name: string;
  status: 'passed' | 'failed' | 'running' | 'queued';
  dataSource: 'Synthetic' | 'Test Database' | 'Hybrid' | 'Anonymized Historical' | 'Sandbox API';
  environment: string;
  businessScore: number;
  policyScore: number;
  traceScore: number;
  qualityScore: number;
  graders: string[];
  failureReason: string | null;
  
  // Real domain input payload
  inputPayload: {
    application_id: string;
    applicant: {
      customer_id: string;
      name: string;
      age: number;
      employment_type: 'Salaried' | 'Self-Employed' | 'Business';
      employer_name?: string;
      monthly_net_income: number;
      existing_emi_obligations: number;
      credit_score: number;
      cibil_risk_tier: string;
      kyc_status: 'VERIFIED' | 'PENDING' | 'MISSING' | 'EXPIRED';
      residential_status: 'Owned' | 'Rented' | 'Company Provided';
    };
    loan_details: {
      loan_type: 'Home Loan' | 'Personal Loan' | 'Business Loan' | 'Auto Loan';
      requested_amount: number;
      requested_tenure_months: number;
      property_valuation?: number;
      purpose: string;
    };
    uploaded_documents: Array<{
      doc_type: 'PAN' | 'Aadhaar' | 'Salary_Slips_3M' | 'Bank_Statement_6M' | 'ITR_V_2Y' | 'Property_Deed';
      doc_id: string;
      status: 'VALID' | 'EXPIRED' | 'BLURRY' | 'TAMPERED' | 'MISSING';
      extracted_name?: string;
      verification_timestamp?: string;
    }>;
  };

  // Real domain agent output
  actualOutput: {
    decision: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW_REQUIRED' | 'ADDITIONAL_DOCS_REQUESTED';
    approved_amount?: number;
    recommended_tenure_months?: number;
    interest_rate_pct?: number;
    emi_amount?: number;
    debt_to_income_ratio_pct: number;
    loan_to_value_ratio_pct?: number;
    risk_assessment: {
      risk_grade: 'Low' | 'Medium' | 'High' | 'Critical';
      risk_factors: string[];
      mitigating_factors: string[];
    };
    policy_citations: Array<{
      policy_id: string;
      policy_name: string;
      section: string;
      excerpt: string;
      relevance_score: number;
    }>;
    missing_requirements: string[];
    routing_destination: 'AUTOMATED_DISBURSEMENT' | 'UNDERWRITER_QUEUE' | 'FRAUD_INVESTIGATION_UNIT' | 'REJECTION_NOTICE';
    agent_reasoning: string;
    execution_time_ms: number;
    tokens_consumed: { prompt: number; completion: number; total: number };
  };

  // Expected outcome and assertions
  expectedOutcome: {
    decision: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW_REQUIRED' | 'ADDITIONAL_DOCS_REQUESTED';
    must_include_reasons: string[];
    must_not_approve: boolean;
    required_tools_called: string[];
    required_policy_sections: string[];
  };

  // Execution trace spans
  traceSpans: Array<{
    span_id: string;
    name: string;
    service: string;
    duration_ms: number;
    status: 'ok' | 'error' | 'warning';
    attributes: Record<string, string | number | boolean>;
  }>;

  // Grader breakdown
  graderEvaluation: {
    judge_model: string;
    rubric_scores: Array<{
      criterion: string;
      max_score: number;
      awarded_score: number;
      verdict: 'PASS' | 'FAIL' | 'PARTIAL';
      judge_thought: string;
    }>;
    deterministic_checks: Array<{
      name: string;
      passed: boolean;
      expected: string;
      actual: string;
    }>;
    overall_confidence: number;
    sme_alignment: boolean;
  };
}

// Full 43 Specific Failures Breakdown
export interface FailureItem {
  id: string;
  testId: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  businessImpact: string;
  detectedAt: string;
  likelyRootCause: string;
  evidence: string[];
  confidence: string;
  cluster: 'Retrieval' | 'Tool Errors' | 'Policy Compliance' | 'Hallucination' | 'Workflow Routing';
  recommendedAction: string;
}

export const mockFailures: FailureItem[] = [
  // 1. Tool Errors (12 items)
  {
    id: 'FAIL-001',
    testId: 'TC-1042',
    severity: 'Critical',
    businessImpact: 'Unlawful Loan Approval — Mandatory KYC Document Bypass',
    detectedAt: 'Final Decision Synthesis',
    likelyRootCause: 'Document verification tool call omitted from orchestrator trajectory graph.',
    evidence: [
      'Doc_Analyzer OCR tool was never called in span tree #span-01 through #span-06',
      'LLM received "kyc_status": "MISSING" in applicant context but evaluated only financial DTI ratios',
      'Zero assertions evaluated on missing Aadhaar/PAN before final recommendation synthesis',
      'Regulatory compliance violation under RBI Master Direction 2026-KYC Section 4.1',
    ],
    confidence: '98%',
    cluster: 'Tool Errors',
    recommendedAction: 'Implement hard orchestration barrier in Agent Workflow: Enforce prerequisite tool call to `kyc_verification_service` before dispatching to `pricing_engine`.',
  },
  {
    id: 'FAIL-002',
    testId: 'TC-1047',
    severity: 'High',
    businessImpact: 'Customer Abruptly Disconnected on Underwriting Service HTTP 503 Outage',
    detectedAt: 'Human Escalation Handshake',
    likelyRootCause: 'Absence of retry resilience or asynchronous queue fallback on CRM integration failure.',
    evidence: [
      'Downstream tool `Tool.Escalation_Router` returned HTTP 503 Service Unavailable at 14:02:11Z',
      'Agent returned unformatted raw exception string to user interface',
      'Application dropped without generating a reference ticket number or queuing to dead-letter storage',
    ],
    confidence: '96%',
    cluster: 'Tool Errors',
    recommendedAction: 'Wrap all external tool calls in an exponential backoff decorator (max 3 retries) and fall back to durable queue `loan.escalations.dlq` on persistent failure.',
  },
  {
    id: 'FAIL-003',
    testId: 'TC-1132',
    severity: 'High',
    businessImpact: 'Credit Bureau CIBIL 504 Timeout Injected Default Score 700',
    detectedAt: 'Credit Assessment Tool Call',
    likelyRootCause: 'Fallback default score injected on tool timeout instead of human escalation.',
    evidence: [
      'CIBIL bureau service timed out after 3,000ms',
      'Orchestrator injected dummy fallback credit score of 700 without alerting underwriters',
      'Applicant with actual 580 score passed automated risk filters',
    ],
    confidence: '95%',
    cluster: 'Tool Errors',
    recommendedAction: 'Prohibit synthetic fallback score injection on bureau timeouts; force exception escalation.',
  },
  {
    id: 'FAIL-004',
    testId: 'TC-1167',
    severity: 'High',
    businessImpact: 'OCR Document Analyzer Dropped 2nd Page of Bank Statement',
    detectedAt: 'Document Extraction',
    likelyRootCause: 'Multipart document parser chunk overflow in OCR pipeline.',
    evidence: [
      '6-month bank statement PDF page 2 omitted from OCR text buffer',
      'Applicant monthly average balance miscalculated by 48%',
    ],
    confidence: '93%',
    cluster: 'Tool Errors',
    recommendedAction: 'Implement document page count verification assertion before running income extractor.',
  },
  {
    id: 'FAIL-005',
    testId: 'TC-1248',
    severity: 'High',
    businessImpact: 'Property Valuation API Failure Accepted Self-Reported Value',
    detectedAt: 'Collateral Assessment',
    likelyRootCause: 'Missing strict gate on collateral valuation response.',
    evidence: [
      'Valuation microservice returned HTTP 500 internal error',
      'Agent fell back to user-provided property value without external appraisal',
    ],
    confidence: '94%',
    cluster: 'Tool Errors',
    recommendedAction: 'Make independent property valuation a mandatory blocker for home loan approvals.',
  },
  {
    id: 'FAIL-006',
    testId: 'TC-1294',
    severity: 'Critical',
    businessImpact: 'PAN Verification Rate-Limited (HTTP 429) Marked as Verified',
    detectedAt: 'KYC Intake',
    likelyRootCause: 'HTTP 429 response handled as permissive success.',
    evidence: ['Income Tax Department API returned 429 Too Many Requests; agent bypassed verification'],
    confidence: '97%',
    cluster: 'Tool Errors',
    recommendedAction: 'Fix error handling in pan_verification_service to treat non-200 responses as unverified.',
  },
  {
    id: 'FAIL-007',
    testId: 'TC-1362',
    severity: 'Medium',
    businessImpact: 'Income Tax Return (ITR-V) Low-Confidence OCR Accepted',
    detectedAt: 'Income Verification',
    likelyRootCause: 'Low OCR confidence threshold accepted blurry scan without re-requesting document.',
    evidence: ['OCR confidence was 0.42 (below 0.85 threshold) but accepted by agent'],
    confidence: '91%',
    cluster: 'Tool Errors',
    recommendedAction: 'Enforce confidence score floor >= 0.85 on OCR fields before computing gross income.',
  },
  {
    id: 'FAIL-008',
    testId: 'TC-1427',
    severity: 'High',
    businessImpact: 'Underwriter Queue Webhook Disconnect Orphaned Application in Memory',
    detectedAt: 'Escalation Dispatch',
    likelyRootCause: 'No durable transaction persistence prior to dispatch.',
    evidence: ['TCP connection dropped during webhook dispatch; application status remained in pending limbo'],
    confidence: '96%',
    cluster: 'Tool Errors',
    recommendedAction: 'Implement outbox transaction pattern before executing external webhooks.',
  },
  {
    id: 'FAIL-009',
    testId: 'TC-1025',
    severity: 'Medium',
    businessImpact: 'Core Banking API Connection Latency Spike Exceeded SLA',
    detectedAt: 'Customer Intake',
    likelyRootCause: 'Missing connection pool keepalive causing socket re-negotiations.',
    evidence: ['Customer lookup latency was 4,200ms, triggering frontend timeout warning'],
    confidence: '90%',
    cluster: 'Tool Errors',
    recommendedAction: 'Configure persistent HTTP connection pooling on internal Core Banking API client.',
  },
  {
    id: 'FAIL-010',
    testId: 'TC-1064',
    severity: 'Medium',
    businessImpact: 'Aadhaar OTP Microservice Silent Handshake Failure',
    detectedAt: 'KYC Intake',
    likelyRootCause: 'Uncaught JSON deserialization exception on empty payload.',
    evidence: ['Empty JSON response from UIDAI gateway resulted in unhandled TypeError'],
    confidence: '92%',
    cluster: 'Tool Errors',
    recommendedAction: 'Add schema validation on all third-party identity provider response payloads.',
  },
  {
    id: 'FAIL-011',
    testId: 'TC-1155',
    severity: 'Medium',
    businessImpact: 'Employment Verification Email Tool Bounced Without Catching',
    detectedAt: 'Employment Check',
    likelyRootCause: 'Async email verification worker omitted status callback.',
    evidence: ['Corporate domain verification was skipped after SMTP connection timeout'],
    confidence: '89%',
    cluster: 'Tool Errors',
    recommendedAction: 'Add explicit timeout and retry logic to corporate email verification tool.',
  },
  {
    id: 'FAIL-012',
    testId: 'TC-1285',
    severity: 'Low',
    businessImpact: 'SMS Notification Gateway Tool Failure on Approval Notice',
    detectedAt: 'Notification Dispatch',
    likelyRootCause: 'SMS provider credit limit reached in staging sandbox.',
    evidence: ['SMS notification failed to dispatch; application succeeded in database'],
    confidence: '95%',
    cluster: 'Tool Errors',
    recommendedAction: 'Add secondary failover SMS provider or queue to fallback notification service.',
  },

  // 2. Retrieval (18 items)
  {
    id: 'FAIL-013',
    testId: 'TC-1044',
    severity: 'Critical',
    businessImpact: 'High-Value Loan ₹52L Approved Automatically Without 4-Eye Escalation',
    detectedAt: 'Policy Retrieval & Decisioning',
    likelyRootCause: 'Outdated policy chunk (v2.1) retrieved from Vector Knowledge Base referencing legacy ₹75L ceiling instead of current ₹50L policy mandate.',
    evidence: [
      'Vector retriever returned chunk ID `chunk_pol_2024_v2.1_p14` (dated Nov 2024)',
      'LLM reasoning explicitly quotes: "Approved within automated authority limit of ₹75L per Policy v2.1"',
      'Current Credit Delegation Policy v2.4 (effective Q2-2026) specifies strict ₹50,00,000 threshold for automated sign-off',
      'Hybrid RAG reranker prioritized semantic match over document freshness metadata filter',
    ],
    confidence: '94%',
    cluster: 'Retrieval',
    recommendedAction: 'Purge outdated v2.1 policy chunks from Pinecone index `retail-credit-policies`. Update vector search metadata filter to enforce `effective_date >= 2026-01-01`.',
  },
  {
    id: 'FAIL-014',
    testId: 'TC-1058',
    severity: 'High',
    businessImpact: 'Cited Superseded Circular 2024 for NRI Co-Applicant Status',
    detectedAt: 'Policy Retrieval',
    likelyRootCause: 'RAG vector freshness filter missing on Pinecone query.',
    evidence: ['Retrieved chunk from 2024 circular requiring power-of-attorney in person, repealed by 2026 Master Directions'],
    confidence: '95%',
    cluster: 'Retrieval',
    recommendedAction: 'Enforce strict `active_circular: true` metadata filtering in vector retrieval.',
  },
  {
    id: 'FAIL-015',
    testId: 'TC-1118',
    severity: 'High',
    businessImpact: 'Retrieved Outdated Agricultural Subvention Interest Clause',
    detectedAt: 'Policy Retrieval',
    likelyRootCause: 'Hybrid search BM25 score overwhelmed semantic recency ranking.',
    evidence: ['Keyword "subvention" matched 2022 scheme with 3% interest subvention expired in 2024'],
    confidence: '92%',
    cluster: 'Retrieval',
    recommendedAction: 'Calibrate hybrid weights: increase dense semantic cosine weight to 0.8 and BM25 to 0.2.',
  },
  {
    id: 'FAIL-016',
    testId: 'TC-1182',
    severity: 'High',
    businessImpact: 'Retrieved Residential Mortgage Terms for Commercial Warehouse',
    detectedAt: 'Collateral Policy Search',
    likelyRootCause: 'Semantic ambiguity in "property loan" prompt.',
    evidence: ['Agent applied 8.35% residential home loan interest rate to commercial warehouse property'],
    confidence: '96%',
    cluster: 'Retrieval',
    recommendedAction: 'Add product-type metadata pre-filter to Pinecone retrieval queries.',
  },
  {
    id: 'FAIL-017',
    testId: 'TC-1230',
    severity: 'High',
    businessImpact: 'Outdated Credit Score Band Retrieved (720 vs 750 for Prime Rate)',
    detectedAt: 'Pricing Policy Search',
    likelyRootCause: 'Pinecone index chunk metadata omitted effective_date filter.',
    evidence: ['Granted preferential 8.35% rate to 725 CIBIL score applicant based on legacy Q3-2025 grid'],
    confidence: '93%',
    cluster: 'Retrieval',
    recommendedAction: 'Purge deprecated pricing grids and ensure only active Q2-2026 pricing tables are indexed.',
  },
  {
    id: 'FAIL-018',
    testId: 'TC-1279',
    severity: 'Medium',
    businessImpact: 'Cited Repealed Stamp Duty Rebate Clause for Maharashtra Purchase',
    detectedAt: 'Closing Costs Synthesis',
    likelyRootCause: 'Outdated circular chunk remaining in knowledge base.',
    evidence: ['Quoted 1% stamp duty concession which expired on March 31, 2025'],
    confidence: '91%',
    cluster: 'Retrieval',
    recommendedAction: 'Run automated knowledge base hygiene script to detect and archive expired tax circulars.',
  },
  {
    id: 'FAIL-019',
    testId: 'TC-1345',
    severity: 'High',
    businessImpact: 'Retrieved Personal Loan Prepayment Penalty for Home Loan',
    detectedAt: 'Terms & Conditions Generation',
    likelyRootCause: 'Cross-product document chunk contamination in single vector namespace.',
    evidence: ['Home loan offer included 3% prepayment penalty clause strictly banned by RBI for floating rate home loans'],
    confidence: '98%',
    cluster: 'Retrieval',
    recommendedAction: 'Separate product policies into isolated Pinecone namespaces (`home-loans`, `personal-loans`).',
  },
  {
    id: 'FAIL-020',
    testId: 'TC-1395',
    severity: 'Medium',
    businessImpact: 'Retrieved Legacy 2023 Processing Fee (1.5% vs Flat Promo ₹5,000)',
    detectedAt: 'Fee Calculation',
    likelyRootCause: 'Knowledge base chunk dated Oct 2023 returned top-1 BM25 similarity.',
    evidence: ['Applicant charged ₹45,000 processing fee instead of active festive promo fee of ₹5,000'],
    confidence: '94%',
    cluster: 'Retrieval',
    recommendedAction: 'Incorporate temporal decay scoring into RAG retrieval reranker.',
  },
  {
    id: 'FAIL-021',
    testId: 'TC-1012',
    severity: 'Medium',
    businessImpact: 'Outdated Co-Signer Income Inclusion Threshold Retrieved',
    detectedAt: 'Eligibility Search',
    likelyRootCause: 'Legacy circular chunk lacked deprecation tag in vector index.',
    evidence: ['Required co-signer income of ₹50k instead of revised ₹30k threshold'],
    confidence: '90%',
    cluster: 'Retrieval',
    recommendedAction: 'Re-index eligibility rules with semantic version tags.',
  },
  {
    id: 'FAIL-022',
    testId: 'TC-1038',
    severity: 'Medium',
    businessImpact: 'Retrieved Expired Gold Collateral Valuation Ratio (75% vs 85%)',
    detectedAt: 'Collateral Search',
    likelyRootCause: 'LTV policy revision chunk not synchronized to Staging vector DB.',
    evidence: ['Applied 75% LTV on gold jewelry instead of 85% relaxed regulatory cap'],
    confidence: '92%',
    cluster: 'Retrieval',
    recommendedAction: 'Automate pipeline sync between Confluence policy space and Pinecone vector store.',
  },
  {
    id: 'FAIL-023',
    testId: 'TC-1051',
    severity: 'Low',
    businessImpact: 'Inaccurate Branch Jurisdiction Code Retrieved for Pune Region',
    detectedAt: 'Branch Routing',
    likelyRootCause: 'Outdated pincode-to-cluster lookup table in RAG index.',
    evidence: ['Assigned Baner applicant to Camp branch instead of Aundh regional hub'],
    confidence: '88%',
    cluster: 'Retrieval',
    recommendedAction: 'Replace RAG-based branch lookup with deterministic Postgres geo-lookup query.',
  },
  {
    id: 'FAIL-024',
    testId: 'TC-1082',
    severity: 'Medium',
    businessImpact: 'Retrieved Retired Medical Professional Fast-Track Scheme',
    detectedAt: 'Special Scheme Search',
    likelyRootCause: 'Historical campaign document remained indexed in general collection.',
    evidence: ['Applied zero-margin doctor loan scheme that was discontinued in Dec 2025'],
    confidence: '93%',
    cluster: 'Retrieval',
    recommendedAction: 'Enforce expiration date metadata on all promotional scheme embeddings.',
  },
  {
    id: 'FAIL-025',
    testId: 'TC-1095',
    severity: 'Medium',
    businessImpact: 'Retrieved Deprecated Self-Employed Gross Margin Multiplier',
    detectedAt: 'Income Estimation',
    likelyRootCause: 'Semantic overlap between CA guideline notes and underwriting policy.',
    evidence: ['Applied 60% gross profit assumption instead of audited net income methodology'],
    confidence: '91%',
    cluster: 'Retrieval',
    recommendedAction: 'Filter retrieval chunks to only authoritatively signed underwriting policy PDFs.',
  },
  {
    id: 'FAIL-026',
    testId: 'TC-1110',
    severity: 'Low',
    businessImpact: 'Cited Superseded Grievance Redressal Officer Contact Details',
    detectedAt: 'Compliance Disclosures',
    likelyRootCause: 'Static contact card chunk outdated in knowledge repository.',
    evidence: ['Notice contained former Ombudsman email address'],
    confidence: '97%',
    cluster: 'Retrieval',
    recommendedAction: 'Inject standard statutory regulatory notices deterministically via template headers.',
  },
  {
    id: 'FAIL-027',
    testId: 'TC-1125',
    severity: 'Medium',
    businessImpact: 'Retrieved Pre-2026 Affordable Housing Interest Subsidy Threshold',
    detectedAt: 'PMAY Subsidy Search',
    likelyRootCause: 'Historical PMAY-U 1.0 guidelines retrieved instead of PMAY 2.0 2026 circular.',
    evidence: ['Applied income ceiling of ₹6L instead of ₹9L revised PMAY 2.0 bracket'],
    confidence: '94%',
    cluster: 'Retrieval',
    recommendedAction: 'Tag all government housing scheme circulars with explicit program versioning metadata.',
  },
  {
    id: 'FAIL-028',
    testId: 'TC-1175',
    severity: 'Low',
    businessImpact: 'Retrieved Inaccurate CIBIL Dispute Resolution Turnaround SLA',
    detectedAt: 'Dispute Handling',
    likelyRootCause: '30-day legacy SLA chunk retrieved instead of revised 14-day regulatory SLA.',
    evidence: ['Agent informed user bureau dispute resolution takes 30 days'],
    confidence: '95%',
    cluster: 'Retrieval',
    recommendedAction: 'Update knowledge chunks for RBI Consumer Protection Guidelines 2026.',
  },
  {
    id: 'FAIL-029',
    testId: 'TC-1205',
    severity: 'Medium',
    businessImpact: 'Retrieved Outdated Property Insurance Mandatory Bundling Clause',
    detectedAt: 'Insurance Cross-Sell',
    likelyRootCause: 'Superseded insurance mandate chunk retrieved from 2023 sales guide.',
    evidence: ['Agent stated fire insurance was mandatory from in-house insurer, violating IRDAI anti-tying rules'],
    confidence: '96%',
    cluster: 'Retrieval',
    recommendedAction: 'Purge deprecated third-party distributor sales guides from vector store.',
  },
  {
    id: 'FAIL-030',
    testId: 'TC-1255',
    severity: 'Low',
    businessImpact: 'Retrieved Legacy Forex Conversion Rate Margin for Foreign Inward Remittance',
    detectedAt: 'NRI Remittance Verification',
    likelyRootCause: 'Static forex spread table chunk indexed from past quarterly report.',
    evidence: ['Applied fixed 1.2% FX markup instead of real-time Treasury API spread'],
    confidence: '90%',
    cluster: 'Retrieval',
    recommendedAction: 'Prohibit RAG retrieval for dynamic financial rates; use Live Treasury API tool.',
  },

  // 3. Policy Compliance (7 items)
  {
    id: 'FAIL-031',
    testId: 'TC-1073',
    severity: 'Critical',
    businessImpact: 'Allowed DTI Ratio of 54.2% Exceeding Strict 50.0% Ceiling',
    detectedAt: 'Underwriting Evaluation',
    likelyRootCause: 'Policy rule boundary comparator failed in agent logic (>= instead of <=).',
    evidence: [
      'Applicant monthly EMI obligations were ₹78,600 on net income of ₹1,45,000 (DTI = 54.2%)',
      'Agent approved unsecured personal loan without calculating total debt load',
      'Violation of Retail Credit Policy Circular Section 3.2',
    ],
    confidence: '99%',
    cluster: 'Policy Compliance',
    recommendedAction: 'Add hard deterministic math assertion in orchestration gateway: Reject/Escalate if `dti_ratio > 50.0%`.',
  },
  {
    id: 'FAIL-032',
    testId: 'TC-1145',
    severity: 'High',
    businessImpact: 'Approved Vehicle Loan Exceeding 85% On-Road Price Cap',
    detectedAt: 'LTV Verification',
    likelyRootCause: 'LTV calculation ignored insurance component in total invoice price.',
    evidence: ['Loan of ₹18L approved on ₹19.5L vehicle (92.3% actual LTV vs 85% maximum limit)'],
    confidence: '95%',
    cluster: 'Policy Compliance',
    recommendedAction: 'Enforce standard asset value normalization formula excluding insurance and accessories.',
  },
  {
    id: 'FAIL-033',
    testId: 'TC-1215',
    severity: 'High',
    businessImpact: 'Age Exemption Applied for Under-21 Applicant Without Parental Guarantor',
    detectedAt: 'Eligibility Validation',
    likelyRootCause: 'Age validation rule bypassed during multi-turn conversational prompt.',
    evidence: ['Applicant aged 19 approved for personal credit without co-applicant or guarantor signature'],
    confidence: '98%',
    cluster: 'Policy Compliance',
    recommendedAction: 'Add hard age validation guardrail: Enforce `age >= 21` or mandatory guarantor document.',
  },
  {
    id: 'FAIL-034',
    testId: 'TC-1311',
    severity: 'Critical',
    businessImpact: 'Approved Unsecured Loan for Applicant with 2 Active Defaults',
    detectedAt: 'Bureau Verification',
    likelyRootCause: 'Bureau check examined only credit score (680) and ignored default history array.',
    evidence: ['Credit report showed 2 active 90+ DPD write-offs in last 12 months, which mandates instant decline'],
    confidence: '99%',
    cluster: 'Policy Compliance',
    recommendedAction: 'Assert zero DPD violations in last 24 months before authorizing automated approvals.',
  },
  {
    id: 'FAIL-035',
    testId: 'TC-1379',
    severity: 'High',
    businessImpact: 'Exceeded Maximum Permitted Tenure (20 Years) for Applicant Aged 52',
    detectedAt: 'Tenure Calculation',
    likelyRootCause: 'Retirement age constraint (max 65 years) was not subtracted from tenure.',
    evidence: ['Sanctioned 20-year loan to 52-year-old (matures at age 72, exceeding 65 retirement limit)'],
    confidence: '97%',
    cluster: 'Policy Compliance',
    recommendedAction: 'Enforce `max_tenure = min(requested_tenure, 65 - applicant_age)` constraint in pricing engine.',
  },
  {
    id: 'FAIL-036',
    testId: 'TC-1222',
    severity: 'Medium',
    businessImpact: 'Approved Loan with Collateral LTV of 88% on Semi-Urban Property',
    detectedAt: 'Collateral Valuation',
    likelyRootCause: 'Semi-urban property classification permitted urban 85% LTV rather than 75% tier-2 cap.',
    evidence: ['Applied Tier-1 metro LTV grid to Tier-3 rural gram panchayat property'],
    confidence: '92%',
    cluster: 'Policy Compliance',
    recommendedAction: 'Link pin-code master data directly to location-specific LTV capping rules.',
  },
  {
    id: 'FAIL-037',
    testId: 'TC-1350',
    severity: 'High',
    businessImpact: 'Unverified Income Multiplier Exceeded 6x Annual Salary',
    detectedAt: 'Loan Amount Calculation',
    likelyRootCause: 'Agent used gross income instead of post-tax net income for multiplier calculation.',
    evidence: ['Approved ₹90L loan for applicant with ₹12L annual net income (7.5x multiplier vs 6.0x max cap)'],
    confidence: '96%',
    cluster: 'Policy Compliance',
    recommendedAction: 'Enforce maximum loan amount ceiling formula based on verified net monthly salary.',
  },

  // 4. Hallucination (4 items)
  {
    id: 'FAIL-038',
    testId: 'TC-1089',
    severity: 'High',
    businessImpact: 'Agent Synthesized Arbitrary 12% Property Appreciation Rate',
    detectedAt: 'Collateral Analysis',
    likelyRootCause: 'LLM generated unsupported financial assumption absent from valuation report.',
    evidence: [
      'Valuation document contained no forecast data',
      'LLM hallucinated: "Property value expected to grow 12% annually, reducing future LTV risk"',
      'Used this hallucination to justify approving an otherwise borderline loan',
    ],
    confidence: '98%',
    cluster: 'Hallucination',
    recommendedAction: 'Add negative prompt constraints and strict grounding assertions on valuation parameters.',
  },
  {
    id: 'FAIL-039',
    testId: 'TC-1199',
    severity: 'High',
    businessImpact: 'Inferred Co-Borrower Consent from Casual Email Thread Snippet',
    detectedAt: 'Legal Verification',
    likelyRootCause: 'LLM inferred legally binding consent without digital signature verification.',
    evidence: ['Assumed spouse was legal co-borrower because email mentioned "we are buying together"'],
    confidence: '97%',
    cluster: 'Hallucination',
    recommendedAction: 'Require explicit e-Sign Aadhaar verification token before attaching co-borrowers.',
  },
  {
    id: 'FAIL-040',
    testId: 'TC-1328',
    severity: 'Medium',
    businessImpact: 'Agent Quoted 7.99% Promo Rate Expired in Q1-2026',
    detectedAt: 'Offer Generation',
    likelyRootCause: 'LLM pre-training memory hallucinated historical promo text.',
    evidence: ['Promised borrower 7.99% fixed rate when active system rate was 8.40%'],
    confidence: '94%',
    cluster: 'Hallucination',
    recommendedAction: 'Force LLM to populate interest rates exclusively from the output of the pricing engine tool.',
  },
  {
    id: 'FAIL-041',
    testId: 'TC-1410',
    severity: 'Medium',
    businessImpact: 'Agent Committed to 2-Hour Disbursement Without Clearing Check',
    detectedAt: 'Conversational Conclusion',
    likelyRootCause: 'Unverified conversational commitment generated by free-form completion.',
    evidence: ['Agent stated: "Funds will be credited into your account within 120 minutes" for manual escrow loan'],
    confidence: '93%',
    cluster: 'Hallucination',
    recommendedAction: 'Use templated final confirmation messages rather than free-form LLM generation.',
  },

  // 5. Workflow Routing (2 items)
  {
    id: 'FAIL-042',
    testId: 'TC-1104',
    severity: 'High',
    businessImpact: 'Routed Self-Employed Business Case to Automated Salaried Queue',
    detectedAt: 'Intent & Entity Classification',
    likelyRootCause: 'Applicant employment classification entity mapped incorrectly.',
    evidence: [
      'Applicant was proprietary business owner submitting GST returns',
      'Orchestrator tagged application as "Salaried" and bypassed mandatory Business Audit analysis',
    ],
    confidence: '96%',
    cluster: 'Workflow Routing',
    recommendedAction: 'Validate employment classification schema with Pydantic validator before setting execution route.',
  },
  {
    id: 'FAIL-043',
    testId: 'TC-1264',
    severity: 'Medium',
    businessImpact: 'Escalated Low-Risk Prime Application to Fraud Investigation Unit',
    detectedAt: 'Fraud Gateway',
    likelyRootCause: 'Anomaly score threshold miscalibrated (0.2 instead of 0.8).',
    evidence: [
      'Standard low-risk prime salaried application with 820 CIBIL score flagged for fraud investigation',
      'Caused unnecessary 4-day customer onboarding delay',
    ],
    confidence: '95%',
    cluster: 'Workflow Routing',
    recommendedAction: 'Calibrate anomaly detection threshold in Fraud Gateway microservice.',
  },
];

// Helper to generate the complete suite of 427 test cases
function generateFullTestCases(): Record<string, TestCaseDetail> {
  const result: Record<string, TestCaseDetail> = {};

  const APPLICANTS = [
    { name: 'Vikram Malhotra', emp: 'Salaried', inc: 145000, cibil: 780, employer: 'Tata Consultancy Services' },
    { name: 'Dr. Ananya Sen', emp: 'Self-Employed', inc: 380000, cibil: 810, employer: 'Sen Multi-Specialty Clinic' },
    { name: 'Pooja Narang', emp: 'Salaried', inc: 185000, cibil: 792, employer: 'Microsoft India' },
    { name: 'Rahul Deshmukh', emp: 'Salaried', inc: 92000, cibil: 745, employer: 'Infosys Ltd' },
    { name: 'Sneha Kulkarni', emp: 'Business', inc: 240000, cibil: 760, employer: 'Kulkarni Enterprises' },
    { name: 'Amitabh Roy', emp: 'Salaried', inc: 210000, cibil: 820, employer: 'Google India' },
    { name: 'Meera Nambiar', emp: 'Self-Employed', inc: 165000, cibil: 710, employer: 'Nambiar Legal Associates' },
    { name: 'Karthik Raman', emp: 'Salaried', inc: 115000, cibil: 645, employer: 'Wipro Technologies' },
    { name: 'Sunita Sharma', emp: 'Salaried', inc: 85000, cibil: 680, employer: 'HDFC Bank Operations' },
    { name: 'Deepak Verma', emp: 'Business', inc: 520000, cibil: 790, employer: 'Verma Logistics Pvt Ltd' },
  ];

  const CAPABILITIES = [
    'Document Validation & OCR',
    'Eligibility & DTI Calculation',
    'Risk Assessment & Bureau Check',
    'Loan Pricing & Offer Synthesis',
    'Human Escalation Dispatch',
    'Policy Compliance & Retrieval',
    'Customer Verification & KYC',
    'Multi-language Dialect Support',
  ];

  // Map failure items by testId
  const failureByTestId: Record<string, FailureItem> = {};
  mockFailures.forEach(f => {
    failureByTestId[f.testId] = f;
  });

  for (let i = 1; i <= 427; i++) {
    const numStr = String(i).padStart(3, '0');
    const id = `TC-1${numStr}`;
    const failInfo = failureByTestId[id];
    const isFail = Boolean(failInfo);
    const applicant = APPLICANTS[(i - 1) % APPLICANTS.length];
    const cap = CAPABILITIES[(i - 1) % CAPABILITIES.length];
    const loanAmount = 1500000 + ((i * 123456) % 4500000);
    const tenure = [120, 180, 240, 300, 360][i % 5];
    const risk: 'High' | 'Medium' | 'Low' = isFail ? (failInfo.severity === 'Critical' ? 'High' : failInfo.severity === 'High' ? 'High' : 'Medium') : (i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low');
    const priority: 'P1' | 'P2' | 'P3' = isFail ? 'P1' : i % 4 === 0 ? 'P1' : i % 4 === 1 ? 'P2' : 'P3';

    result[id] = {
      id,
      scenario: `SC-${String((i % 12) + 1).padStart(3, '0')}: Automated Loan Evaluation Scenario #${i}`,
      capability: cap,
      risk,
      priority,
      name: isFail
        ? `${cap} — ${failInfo.businessImpact}`
        : `${applicant.emp} Applicant ${applicant.name} — ₹${(loanAmount / 100000).toFixed(1)}L ${cap}`,
      status: isFail ? 'failed' : 'passed',
      dataSource: i % 4 === 0 ? 'Test Database' : i % 4 === 1 ? 'Hybrid' : i % 4 === 2 ? 'Anonymized Historical' : 'Synthetic',
      environment: 'Staging-Sandbox',
      businessScore: isFail ? Math.floor(Math.random() * 30) + 25 : Math.floor(Math.random() * 8) + 92,
      policyScore: isFail && failInfo?.cluster === 'Policy Compliance' ? 58 : 100,
      traceScore: isFail && failInfo?.cluster === 'Tool Errors' ? 62 : Math.floor(Math.random() * 6) + 94,
      qualityScore: isFail ? 68 : Math.floor(Math.random() * 10) + 90,
      graders: ['Business Outcome Judge', 'Policy Compliance Verifier', 'Trace Tool Validator', 'Response Quality Grader'],
      failureReason: isFail ? failInfo.businessImpact : null,

      inputPayload: {
        application_id: `APP-2026-${String(7000 + i)}`,
        applicant: {
          customer_id: `CUST-${String(80000 + i)}`,
          name: applicant.name,
          age: 28 + (i % 28),
          employment_type: applicant.emp as any,
          employer_name: applicant.employer,
          monthly_net_income: applicant.inc,
          existing_emi_obligations: 12000 + ((i * 500) % 25000),
          credit_score: isFail && id === 'TC-1042' ? 780 : applicant.cibil,
          cibil_risk_tier: applicant.cibil >= 780 ? 'Super Prime' : applicant.cibil >= 720 ? 'Prime' : 'Standard',
          kyc_status: isFail && id === 'TC-1042' ? 'MISSING' : 'VERIFIED',
          residential_status: i % 2 === 0 ? 'Owned' : 'Rented',
        },
        loan_details: {
          loan_type: (['Home Loan', 'Personal Loan', 'Business Loan', 'Auto Loan'][i % 4]) as any,
          requested_amount: loanAmount,
          requested_tenure_months: tenure,
          property_valuation: loanAmount * 1.4,
          purpose: 'Property Purchase & Asset Acquisition',
        },
        uploaded_documents: isFail && id === 'TC-1042' ? [
          { doc_type: 'Salary_Slips_3M', doc_id: `SAL-${i}.pdf`, status: 'VALID' },
          { doc_type: 'Bank_Statement_6M', doc_id: `BNK-${i}.pdf`, status: 'VALID' },
        ] : [
          { doc_type: 'PAN', doc_id: `PAN-${i}.pdf`, status: 'VALID' },
          { doc_type: 'Aadhaar', doc_id: `AAD-${i}.pdf`, status: 'VALID' },
          { doc_type: 'Salary_Slips_3M', doc_id: `SAL-${i}.pdf`, status: 'VALID' },
          { doc_type: 'Bank_Statement_6M', doc_id: `BNK-${i}.pdf`, status: 'VALID' },
        ],
      },

      actualOutput: {
        decision: isFail && id === 'TC-1042' ? 'APPROVED' : isFail && loanAmount > 5000000 ? 'APPROVED' : loanAmount > 5000000 ? 'MANUAL_REVIEW_REQUIRED' : 'APPROVED',
        approved_amount: loanAmount,
        recommended_tenure_months: tenure,
        interest_rate_pct: 8.40 + ((i % 15) * 0.15),
        emi_amount: Math.floor(loanAmount * 0.0092),
        debt_to_income_ratio_pct: Number((24.2 + (i % 22)).toFixed(1)),
        loan_to_value_ratio_pct: 64.5,
        risk_assessment: {
          risk_grade: isFail ? 'High' : 'Low',
          risk_factors: isFail ? [failInfo?.likelyRootCause || 'Risk threshold exception'] : [],
          mitigating_factors: [`CIBIL Score ${applicant.cibil}`, 'Low DTI Ratio', 'Stable Employer'],
        },
        policy_citations: [
          {
            policy_id: isFail && failInfo?.cluster === 'Retrieval' ? 'POL-2024-v2.1-LEGACY' : 'POL-2026-v2.4-ACTIVE',
            policy_name: isFail && failInfo?.cluster === 'Retrieval' ? 'Retail Credit Policy v2.1 (Outdated)' : 'Retail Credit Underwriting Circular 2026-Q2',
            section: 'Section 4.1: Automated Eligibility Thresholds',
            excerpt: isFail && failInfo?.cluster === 'Retrieval'
              ? 'Automated credit engine authorized up to ₹75,00,000 for Super Prime applicants.'
              : 'Automated credit approval ceiling strictly capped at ₹50,00,000 with mandatory KYC.',
            relevance_score: 0.94,
          },
        ],
        missing_requirements: isFail && id === 'TC-1042' ? ['Aadhaar & PAN Identity Proof Required'] : [],
        routing_destination: isFail && id === 'TC-1042' ? 'AUTOMATED_DISBURSEMENT' : loanAmount > 5000000 ? 'UNDERWRITER_QUEUE' : 'AUTOMATED_DISBURSEMENT',
        agent_reasoning: isFail
          ? `[DIAGNOSTIC EXCEPTION]: ${failInfo.likelyRootCause}`
          : `Applicant ${applicant.name} satisfies all Prime criteria. DTI is within 50% limit and CIBIL score of ${applicant.cibil} qualifies for instant disbursal.`,
        execution_time_ms: 1800 + ((i * 123) % 2000),
        tokens_consumed: { prompt: 2400 + ((i * 45) % 1500), completion: 380 + ((i * 20) % 300), total: 3200 + ((i * 65) % 1800) },
      },

      expectedOutcome: {
        decision: isFail && id === 'TC-1042' ? 'ADDITIONAL_DOCS_REQUESTED' : loanAmount > 5000000 ? 'MANUAL_REVIEW_REQUIRED' : 'APPROVED',
        must_include_reasons: isFail ? [failInfo.businessImpact] : ['Approved based on verified credit score and KYC compliance'],
        must_not_approve: isFail,
        required_tools_called: ['kyc_verification_service', 'doc_validator', 'cibil_service', 'pricing_engine'],
        required_policy_sections: ['Credit Underwriting Circular 2026, Section 4.1'],
      },

      traceSpans: [
        { span_id: `span-${i}-01`, name: 'POST /loan-agent/run', service: 'loan-gateway', duration_ms: 2400, status: 'ok', attributes: { 'http.status_code': 200 } },
        { span_id: `span-${i}-02`, name: 'Tool.KYC_Verification', service: 'kyc-engine', duration_ms: 210, status: isFail && id === 'TC-1042' ? 'error' : 'ok', attributes: { 'aadhaar_match': !(isFail && id === 'TC-1042') } },
        { span_id: `span-${i}-03`, name: 'Tool.Doc_Analyzer_OCR', service: 'doc-service', duration_ms: 320, status: 'ok', attributes: { 'docs_count': 4 } },
        { span_id: `span-${i}-04`, name: 'Tool.Pricing_Engine', service: 'pricing-grid', duration_ms: 95, status: 'ok', attributes: { 'rate': 8.45 } },
        { span_id: `span-${i}-05`, name: 'LLM.Synthesize_Offer', service: 'openai-gpt4o', duration_ms: 1420, status: isFail ? 'warning' : 'ok', attributes: { 'model': 'gpt-4o' } },
      ],

      graderEvaluation: {
        judge_model: 'GPT-4o Evaluation Judge (Model: gpt-4o-2024-08-06)',
        rubric_scores: [
          { criterion: 'Decision Correctness & Policy Compliance', max_score: 40, awarded_score: isFail ? 8 : 40, verdict: isFail ? 'FAIL' : 'PASS', judge_thought: isFail ? failInfo.likelyRootCause : 'All business underwriting rules satisfied.' },
          { criterion: 'Financial Parameter Verification', max_score: 30, awarded_score: isFail ? 20 : 30, verdict: 'PASS', judge_thought: 'DTI and EMI calculations accurate.' },
          { criterion: 'Trace Tool Invocation Fidelity', max_score: 30, awarded_score: isFail && failInfo?.cluster === 'Tool Errors' ? 10 : 30, verdict: isFail && failInfo?.cluster === 'Tool Errors' ? 'FAIL' : 'PASS', judge_thought: 'Required verification spans confirmed.' },
        ],
        deterministic_checks: [
          { name: 'ASSERT_DECISION_CORRECT', passed: !isFail, expected: isFail ? 'REJECT / REVIEW' : 'APPROVED', actual: isFail ? 'APPROVED (VIOLATION)' : 'APPROVED' },
          { name: 'ASSERT_DTI_UNDER_LIMIT', passed: true, expected: 'dti <= 50.0', actual: 'dti <= 50.0' },
        ],
        overall_confidence: 0.98,
        sme_alignment: true,
      },
    };
  }

  return result;
}

export const mockTestCasesDetail: Record<string, TestCaseDetail> = generateFullTestCases();
export const mockTestCases: TestCaseDetail[] = Object.values(mockTestCasesDetail);

export const mockFailureClusters = [
  { name: 'Retrieval',         count: 18, pct: 42 },
  { name: 'Tool Errors',       count: 12, pct: 28 },
  { name: 'Policy Compliance', count: 7,  pct: 16 },
  { name: 'Hallucination',     count: 4,  pct: 9  },
  { name: 'Workflow Routing',  count: 2,  pct: 5  },
];

export const mockBusinessMetrics = {
  criticalWorkflows:   96,
  businessAccuracy:    92,
  policyCompliance:    99,
  riskScenarios:       88,
  reliability:         97,
  overallReadiness:    91,
};

export const mockCoverage = {
  businessCapabilities: 94,
  workflowPaths:        88,
  riskScenarios:        91,
  edgeCases:            82,
  security:             76,
  observedCapabilities: 89,
};

export const mockCoverageGaps = [
  'Multi-language Hindi/Tamil application requests (0% coverage)',
  'High-value applications >₹1Cr collateral valuation edge cases (partial coverage)',
  'Human escalation timeout & webhook dropout handling (0% coverage)',
  'Tool failure exponential backoff & dead-letter queue resilience (partial coverage)',
];

export const mockStats = {
  capabilities: 8,
  workflows: 6,
  tests: 427,
  completed: 427,
  passed: 384,
  failed: 43,
  businessReadiness: 91,
};

export const mockDatasets = [
  { id: 'DS-001', name: 'Synthetic — Standard Retail Home Loan Cases', type: 'Synthetic', cases: 180, version: 'v1.3', status: 'connected' },
  { id: 'DS-002', name: 'Synthetic — Edge Cases & Adversarial KYC Injections', type: 'Synthetic', cases: 94, version: 'v1.1', status: 'connected' },
  { id: 'DS-003', name: 'Business — Anonymized Production Mortgages 2025-2026', type: 'Business', cases: 120, version: 'v2.0', status: 'connected' },
  { id: 'DS-004', name: 'Business — Historical Underwriter Disputes & Fraud Traces', type: 'Business', cases: 33, version: 'v1.0', status: 'connected' },
];

export const mockDataSources = [
  { name: 'Synthetic Data Generator', type: 'Synthetic Engine', env: 'Platform', status: 'connected', rw: 'R+W', classification: 'Synthetic' },
  { name: 'Core Banking Customer DB (Staging)', type: 'PostgreSQL 16', env: 'Staging-VPC', status: 'connected', rw: 'R (Read-Only)', classification: 'PII — Masked' },
  { name: 'Credit Bureau CIBIL Sandbox', type: 'REST API v3', env: 'Sandbox', status: 'connected', rw: 'R', classification: 'Sensitive Data' },
  { name: 'Retail Credit Policy Knowledge Base', type: 'Pinecone Vector DB', env: 'Staging', status: 'connected', rw: 'R', classification: 'Internal Rules' },
  { name: 'Underwriting CRM Service', type: 'Salesforce Financial Cloud', env: 'UAT Sandbox', status: 'connected', rw: 'R+W', classification: 'Business State' },
];

export const mockTechMetrics = {
  model:             'GPT-4o (gpt-4o-2024-08-06)',
  promptVersion:     'prompt-loan-orchestrator@v17.2',
  retrievalStrategy: 'Hybrid (Semantic Cosine 0.7 + BM25 0.3) with Cohere Reranker v3',
  tools:             5,
  traces:            427,
  retrievalRecall:   83,
  toolSelectionAcc:  91,
  toolParamAcc:      87,
  groundedness:      94,
  latencyP95:        '3,380ms',
  tokenUsageAvg:     6794,
  costPerRun:        '$0.43',
};

export const mockVersionComparison = [
  { metric: 'Business Readiness', v1: 88, v2: 91, unit: '%', inverse: false },
  { metric: 'Policy Compliance',  v1: 97, v2: 99, unit: '%', inverse: false },
  { metric: 'Tool Accuracy',       v1: 84, v2: 87, unit: '%', inverse: false },
  { metric: 'Retrieval Recall',    v1: 80, v2: 83, unit: '%', inverse: false },
  { metric: 'Avg Tokens/Run',      v1: 7200, v2: 6794, unit: '', inverse: true },
  { metric: 'Latency p95',         v1: 3800, v2: 3380, unit: 'ms', inverse: true },
  { metric: 'Cost per Run',        v1: 0.51, v2: 0.43, unit: '$', inverse: true },
];

export const mockScenarios = [
  {
    id: 'SC-001', capability: 'Eligibility Assessment', risk: 'High',
    description: 'Prime Salaried Applicant Clean Approval Workflow',
    expectedOutcome: 'Automated loan approval with preferential pricing, tenure calculated, LTV/DTI verified',
    tests: 24,
  },
  {
    id: 'SC-002', capability: 'Document Validation', risk: 'High',
    description: 'Missing or Incomplete Identity (KYC) Documentation',
    expectedOutcome: 'Approval blocked, customer notified of specific missing documents, case held in pending state',
    tests: 18,
  },
  {
    id: 'SC-003', capability: 'Risk Assessment & Policy', risk: 'High',
    description: 'High-Value Loan Request Exceeding Automated Ceiling (>₹50L)',
    expectedOutcome: 'Mandatory escalation to Senior Underwriting Panel with structured dossier',
    tests: 12,
  },
  {
    id: 'SC-004', capability: 'Document Validation', risk: 'Medium',
    description: 'Expired Official Valid Document (OVD) Detection',
    expectedOutcome: 'Document validation fails OCR check, prompt user for renewal certificate',
    tests: 14,
  },
  {
    id: 'SC-005', capability: 'Risk Assessment', risk: 'Medium',
    description: 'Boundary Credit Score (640–649) Exception Routing',
    expectedOutcome: 'Trigger credit analyst review with risk compensating factor matrix',
    tests: 15,
  },
  {
    id: 'SC-006', capability: 'Human Escalation', risk: 'High',
    description: 'Downstream Underwriting Service Dropout (HTTP 503)',
    expectedOutcome: 'Graceful failure, persistent DLQ queuing, user issued tracking reference',
    tests: 9,
  },
];

export const mockCapabilities = [
  { id: 'CAP-001', name: 'Application Intake & Formatting', source: 'Docs + Trace', confidence: 'High',   observed: 52 },
  { id: 'CAP-002', name: 'Document Validation & OCR',       source: 'Docs + Trace', confidence: 'High',   observed: 28 },
  { id: 'CAP-003', name: 'Customer Verification & KYC',     source: 'Trace',        confidence: 'High',   observed: 37 },
  { id: 'CAP-004', name: 'Eligibility & DTI Calculation',   source: 'Docs + Trace', confidence: 'High',   observed: 41 },
  { id: 'CAP-005', name: 'Risk Assessment & Bureau Check',  source: 'Trace',        confidence: 'Medium', observed: 19 },
  { id: 'CAP-006', name: 'Loan Pricing & Offer Synthesis',  source: 'Trace',        confidence: 'Medium', observed: 14 },
  { id: 'CAP-007', name: 'Human Escalation Dispatch',      source: 'Docs + Trace', confidence: 'High',   observed: 11 },
  { id: 'CAP-008', name: 'Multi-language Dialect Support',  source: 'Inferred',     confidence: 'Low',    observed: 0  },
];

export const mockBusinessRules = [
  { id: 'BR-001', rule: 'Loan amounts exceeding ₹50,00,000 mandate 4-eye Senior Underwriter review and cannot be auto-disbursed.' },
  { id: 'BR-002', rule: 'Incomplete applications without verified primary photo ID (PAN/Aadhaar) must be blocked immediately.' },
  { id: 'BR-003', rule: 'Debt-To-Income (DTI / FOIR) ratio must not exceed 50% for standard prime salaried applications.' },
  { id: 'BR-004', rule: 'Credit bureau score below 650 triggers mandatory underwriter review with compensating collateral check.' },
  { id: 'BR-005', rule: 'Every automated recommendation must provide verbatim citation to the active Credit Policy manual.' },
];

export const mockProject = {
  id: 'proj-001',
  name: 'Enterprise Loan Processing Agent',
  description: 'AI assistant that processes loan applications and recommends next actions based on business rules and customer data.',
  industry: 'Financial Services',
  type: ['Workflow Agent', 'RAG Application'],
  status: 'evaluation-in-progress',
  created: '2026-08-01',
  lastRun: '2026-08-24',
};

export const mockFlowNodes = [
  { id: 'customer',     label: 'Customer Loan Application', type: 'actor', parent: null },
  { id: 'ai-agent',     label: 'Enterprise Loan Orchestrator', type: 'root',  parent: 'customer' },
  { id: 'intent',       label: 'Intent & Schema Parser',   type: 'tool',  parent: 'ai-agent' },
  { id: 'doc-analyzer', label: 'Document OCR Validator',   type: 'tool',  parent: 'ai-agent' },
  { id: 'cust-lookup',  label: 'Core Banking Customer API',type: 'tool',  parent: 'ai-agent' },
  { id: 'policy-ret',   label: 'Pinecone Policy RAG Index',type: 'tool',  parent: 'ai-agent' },
  { id: 'risk-assess',  label: 'Credit Bureau Bureau API', type: 'tool',  parent: 'ai-agent' },
  { id: 'escalation',   label: 'Underwriter CRM Dispatch', type: 'tool',  parent: 'ai-agent' },
];

export const mockNodeDetails: Record<string, any> = {
  'customer': {
    type: 'Actor / User Ingestion',
    observed: 427,
    successRate: '100%',
    input: 'loan_application_payload: { applicant: {...}, loan_details: {...}, documents: [...] }',
    output: 'HTTP 202 Ingestion Accepted · evaluation_trace_id generated',
    source: 'Omnichannel Loan Application Gateway / REST API',
    confidence: 'High',
  },
  'ai-agent': {
    type: 'Workflow Agent Orchestrator',
    observed: 427,
    successRate: '89.9%',
    input: 'validated_application_state, retrieved_context, bureau_data',
    output: 'decision_synthesis: { decision: "APPROVED" | "MANUAL_REVIEW", term_sheet: {...} }',
    source: 'LangGraph Orchestrator @ v1.4.2 (GPT-4o runtime)',
    confidence: 'High',
  },
  'intent': {
    type: 'Intent & Schema Parser',
    observed: 427,
    successRate: '99.1%',
    input: 'raw_payload: JSON / multipart form data',
    output: 'parsed_intent: "RETAIL_HOME_LOAN_APPLICATION", normalized_applicant_profile',
    source: 'Pydantic Schema Validator + GPT-4o-mini Extractor',
    confidence: 'High',
  },
  'cust-lookup': {
    type: 'Tool',
    observed: 37,
    successRate: '94.6%',
    input: 'customer_id: string',
    output: 'customer_profile: { cibil_score: 780, existing_loans: [] }',
    source: 'Core Banking API (Staging)',
    confidence: 'High',
  },
  'doc-analyzer': {
    type: 'Tool',
    observed: 28,
    successRate: '96.4%',
    input: 'document_bytes, doc_type',
    output: 'extracted_fields, validation_status',
    source: 'Internal OCR / LayoutLMv3',
    confidence: 'High',
  },
  'policy-ret': {
    type: 'Tool',
    observed: 41,
    successRate: '87.8%',
    input: 'query, applicant_context',
    output: 'policy_excerpts, clause_citations',
    source: 'Pinecone Vector DB (retail-credit-policies)',
    confidence: 'High',
  },
  'risk-assess': {
    type: 'Tool',
    observed: 19,
    successRate: '84.2%',
    input: 'applicant_profile, credit_score',
    output: 'risk_tier, foir_limit',
    source: 'CIBIL Bureau Adapter',
    confidence: 'Medium',
  },
  'escalation': {
    type: 'Tool',
    observed: 11,
    successRate: '81.8%',
    input: 'dossier, risk_flags, application_id',
    output: 'salesforce_case_id, queue_position',
    source: 'Salesforce Financial Services Cloud',
    confidence: 'High',
  },
};

export const mockTraceNodes = [
  { id: 'n1', label: 'User Application Ingestion', duration: '0ms', status: 'success', type: 'input', detail: 'Loan application for ₹52,00,000 — home loan, salaried applicant (APP-2026-9102)' },
  { id: 'n2', label: 'Agent Dispatcher Invocation', duration: '12ms', status: 'success', type: 'agent', detail: 'invoke_agent → enterprise_loan_agent@v1.4.2 [OpenTelemetry context started]' },
  { id: 'n3', label: 'LLM Intent & Extraction', duration: '1,240ms', status: 'success', type: 'llm', detail: 'Model: gpt-4o | Tokens: 1,842 prompt / 312 completion' },
  { id: 'n4', label: 'RAG Policy Retrieval', duration: '380ms', status: 'warning', type: 'retrieval', detail: 'Query: "loan eligibility threshold mortgage" → Retrieved chunk chunk_pol_2024_v2.1_p14 (Outdated ₹75L ceiling)' },
  { id: 'n5', label: 'Tool: Customer Lookup', duration: '210ms', status: 'success', type: 'tool', detail: 'customer_id: CUST-39102 → Profile fetched, cibil: 810 Super Prime' },
  { id: 'n6', label: 'Tool: Collateral Valuation', duration: '410ms', status: 'success', type: 'tool', detail: 'property_valuation: ₹85,00,000 | Calculated LTV: 61.1%' },
  { id: 'n7', label: 'LLM Offer Synthesis', duration: '1,120ms', status: 'success', type: 'llm', detail: 'Model: gpt-4o | Tokens: 2,280 in / 490 out | Calculated EMI ₹50,892 @ 8.40%' },
  { id: 'n8', label: 'Final Decision Gate', duration: '8ms', status: 'error', type: 'output', detail: 'COMPLIANCE VIOLATION: Agent issued direct approval without triggering mandatory ₹50L Senior Underwriter 4-eye review' },
];

export const mockEvalSpec = {
  capability: 'Loan Eligibility Assessment & Escalation',
  successDef: 'Correctly determine eligibility based on documented business rules, enforce KYC prerequisites, and route applications exceeding ₹50L to Underwriting.',
  must: [
    'Apply all applicable underwriting eligibility rules',
    'Verify mandatory photo ID (PAN & Aadhaar) prior to approval',
    'Calculate FOIR/DTI and ensure it does not exceed 50%',
    'Escalate all applications >₹50,00,000 to Senior Underwriters',
    'Provide verbatim policy document citations for every recommendation',
  ],
  mustNot: [
    'Approve an incomplete application with missing or unverified KYC',
    'Invent or extrapolate applicant financial information',
    'Bypass mandatory 4-eye underwriter review for high-value loans',
    'Make automated credit decisions citing outdated or superseded policy circulars',
  ],
};

export const mockTestSuites = [
  { id: 'TS-FUNC',   name: 'Functional Workflows', subsets: ['Clean Approval', 'Income Verification', 'Tenure Calculator'], tests: 162, passed: 154, failed: 8 },
  { id: 'TS-RISK',   name: 'Business Risk & Policy', subsets: ['High Value >₹50L', 'Super Prime Pricing', 'Boundary Credit (640-649)'], tests: 98, passed: 81, failed: 17 },
  { id: 'TS-ROBUST', name: 'Robustness & Edge Cases', subsets: ['Expired OVD', 'Ambiguous Query', 'Missing Documents'], tests: 74, passed: 68, failed: 6 },
  { id: 'TS-SEC',    name: 'Security & Compliance', subsets: ['KYC Bypass Injections', 'PII Leakage Prevention', 'Prompt Extraction'], tests: 52, passed: 52, failed: 0 },
  { id: 'TS-REG',    name: 'Regression Suite', subsets: ['Historical Production Failures', 'DLQ Handshake Dropped'], tests: 41, passed: 29, failed: 12 },
];

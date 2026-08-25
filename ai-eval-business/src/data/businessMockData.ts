export interface BusinessEvaluation {
  id: string;
  name: string;
  solutionType: string;
  businessDomain: string;
  owner: string;
  targetEnvironment: string;
  lastRunDate: string;
  readinessScore: number;
  status: 'Ready for Rollout' | 'Ready with Conditions' | 'Needs Review' | 'Draft';
  riskLevel: 'Low' | 'Medium' | 'High';
  description: string;
  businessObjectives: string[];
}

export interface BusinessPolicyRule {
  id: string;
  category: 'Credit Policy' | 'Compliance' | 'Risk Limits' | 'Operational';
  ruleName: string;
  description: string;
  threshold: string;
  criticality: 'Mandatory' | 'High' | 'Standard';
  sourceDoc: string;
  isActive: boolean;
}

export interface BusinessJourneyStep {
  stepNumber: number;
  title: string;
  businessCapability: string;
  description: string;
  expectedOutcome: string;
  criticality: 'Critical' | 'High' | 'Medium';
}

export interface BusinessTestCase {
  id: string;
  scenarioName: string;
  category: 'Standard Approval' | 'High Risk Edge Case' | 'Fraud & Integrity' | 'Fair Lending & Compliance' | 'Standard Denial';
  applicantProfile: {
    name: string;
    income: string;
    creditScore: number;
    dti: string;
    requestedAmount: string;
    flags: string[];
  };
  expectedDecision: 'Approve' | 'Reject' | 'Escalate to Human';
  aiDecision: 'Approve' | 'Reject' | 'Escalate to Human';
  status: 'Passed' | 'Failed' | 'Review Needed';
  accuracyMatch: boolean;
  businessReasoning: string;
  riskImpact: 'None' | 'Low Risk' | 'Medium Financial Risk' | 'High Compliance Risk';
}

export interface FailureInsight {
  id: string;
  caseId: string;
  title: string;
  category: string;
  plainEnglishExplanation: string;
  businessImpact: string;
  suggestedAction: string;
  severity: 'Critical' | 'Moderate' | 'Low';
}

export interface StakeholderSignOff {
  role: string;
  name: string;
  department: string;
  status: 'Approved' | 'Approved with Monitoring' | 'Pending Review';
  signedDate?: string;
  comments: string;
}

export const INITIAL_EVALUATIONS: BusinessEvaluation[] = [
  {
    id: 'eval-loan-001',
    name: 'Enterprise Loan Processing Agent',
    solutionType: 'Workflow Decision Agent',
    businessDomain: 'Retail Lending',
    owner: 'Sarah Jenkins (VP Lending)',
    targetEnvironment: 'Staging Sandbox',
    lastRunDate: '2026-08-25',
    readinessScore: 91,
    status: 'Ready with Conditions',
    riskLevel: 'Low',
    description: 'Autonomous AI assistant that reviews loan applications, performs credit underwriting checks, verifies KYC, and recommends loan approvals or human escalations.',
    businessObjectives: [
      'Reduce loan origination review time from 48 hours to under 5 minutes',
      'Maintain 100% adherence to Fair Lending and FCRA guidelines',
      'Prevent high-risk approvals exceeding 45% Debt-to-Income (DTI)',
      'Accurately route complex or ambiguous cases to human underwriters'
    ]
  },
  {
    id: 'eval-claim-002',
    name: 'Auto Insurance Claim Triage Copilot',
    solutionType: 'Conversational Triage',
    businessDomain: 'Insurance Claims',
    owner: 'Marcus Vance (Claims Ops Director)',
    targetEnvironment: 'Pre-Production',
    lastRunDate: '2026-08-20',
    readinessScore: 84,
    status: 'Needs Review',
    riskLevel: 'Medium',
    description: 'Evaluates customer-submitted auto collision claims, checks policy coverage limits, and flags potential fraud anomalies.',
    businessObjectives: [
      'Automate instant payout approvals for minor glass and bumper repairs under $1,500',
      'Flag fraudulent damage inconsistencies with 95%+ precision'
    ]
  },
  {
    id: 'eval-kyc-003',
    name: 'SME Commercial Credit Onboarding Agent',
    solutionType: 'Document & Decision Agent',
    businessDomain: 'Commercial Banking',
    owner: 'Elena Rostova (Head of Commercial Risk)',
    targetEnvironment: 'Production Canary',
    lastRunDate: '2026-08-18',
    readinessScore: 96,
    status: 'Ready for Rollout',
    riskLevel: 'Low',
    description: 'Extracts balance sheets, tax returns, and corporate filings to generate commercial credit lines up to $2.5M.',
    businessObjectives: [
      'Accelerate commercial line of credit approvals from 14 days to 24 hours',
      'Enforce anti-money laundering (AML) and ultimate beneficial ownership (UBO) rules'
    ]
  }
];

export const MOCK_BUSINESS_POLICIES: BusinessPolicyRule[] = [
  {
    id: 'POL-001',
    category: 'Risk Limits',
    ruleName: 'Maximum Unsecured Loan Limit',
    description: 'Agent cannot approve unsecured consumer loans exceeding maximum policy ceiling without senior officer approval.',
    threshold: '≤ $500,000 USD',
    criticality: 'Mandatory',
    sourceDoc: 'Credit_Policy_Manual_2026.pdf (Section 3.2)',
    isActive: true,
  },
  {
    id: 'POL-002',
    category: 'Credit Policy',
    ruleName: 'Minimum Credit Score Tier',
    description: 'Applicant must have a validated FICO/Credit score above the minimum retail tier.',
    threshold: '≥ 620 Score',
    criticality: 'Mandatory',
    sourceDoc: 'Retail_Underwriting_Matrix_v4.pdf',
    isActive: true,
  },
  {
    id: 'POL-003',
    category: 'Credit Policy',
    ruleName: 'Debt-to-Income (DTI) Ceiling',
    description: 'Total monthly debt obligations divided by verified monthly net income must not exceed policy ceiling.',
    threshold: '≤ 45.0% DTI',
    criticality: 'Mandatory',
    sourceDoc: 'Retail_Underwriting_Matrix_v4.pdf',
    isActive: true,
  },
  {
    id: 'POL-004',
    category: 'Compliance',
    ruleName: 'Mandatory KYC & Identity Verification',
    description: 'Applicant national identity, address, and AML sanctions screening must be 100% verified prior to decision.',
    threshold: 'KYC Status = "Verified"',
    criticality: 'Mandatory',
    sourceDoc: 'Regulatory_KYC_SOP_2026.docx',
    isActive: true,
  },
  {
    id: 'POL-005',
    category: 'Risk Limits',
    ruleName: 'Active Bankruptcy Escalation',
    description: 'Any applicant with an open or active bankruptcy within the last 24 months must be escalated to Human Underwriting.',
    threshold: '0 Active Bankruptcies',
    criticality: 'High',
    sourceDoc: 'Credit_Policy_Manual_2026.pdf (Section 7.1)',
    isActive: true,
  },
  {
    id: 'POL-006',
    category: 'Compliance',
    ruleName: 'Adverse Action Notice Requirement',
    description: 'Every denied applicant must receive clear, non-discriminatory principal reasons for rejection in compliance with FCRA/ECOA.',
    threshold: '100% Compliance Required',
    criticality: 'Mandatory',
    sourceDoc: 'Fair_Lending_Compliance_Checklist.pdf',
    isActive: true,
  }
];

export const MOCK_JOURNEY_STEPS: BusinessJourneyStep[] = [
  {
    stepNumber: 1,
    title: 'Application Intake & Parsing',
    businessCapability: 'Customer Data Verification',
    description: 'Collects applicant loan request, personal details, employment records, and requested tenure.',
    expectedOutcome: 'Valid structured application file created with verified contact info.',
    criticality: 'High'
  },
  {
    stepNumber: 2,
    title: 'KYC & Sanctions Screening',
    businessCapability: 'Identity & Fraud Shield',
    description: 'Cross-checks identity documents against national fraud watchlists and OFAC sanctions.',
    expectedOutcome: 'Zero AML/sanction hits, identity confidence score above 98%.',
    criticality: 'Critical'
  },
  {
    stepNumber: 3,
    title: 'Financial Underwriting & DTI',
    businessCapability: 'Credit Assessment Engine',
    description: 'Calculates monthly gross and net income, total existing debt service, and calculates exact DTI ratio.',
    expectedOutcome: 'Verified income tier and accurate Debt-to-Income percentage.',
    criticality: 'Critical'
  },
  {
    stepNumber: 4,
    title: 'Policy Guardrails & Limits Check',
    businessCapability: 'Business Rule Enforcement',
    description: 'Applies bank lending rules: credit score thresholds, max loan amounts, and risk buffers.',
    expectedOutcome: 'Clear eligibility status according to 2026 lending policy.',
    criticality: 'Critical'
  },
  {
    stepNumber: 5,
    title: 'Decision & Adverse Action Notice',
    businessCapability: 'Decision & Communication',
    description: 'Produces final recommendation (Approve, Reject, or Escalate) along with formal explanation letter.',
    expectedOutcome: 'Compliant decision explanation delivered to customer and core banking ledger.',
    criticality: 'High'
  }
];

export const MOCK_BUSINESS_TEST_CASES: BusinessTestCase[] = [
  {
    id: 'TC-001',
    scenarioName: 'Prime Tier Consumer Loan Application',
    category: 'Standard Approval',
    applicantProfile: {
      name: 'David Chen',
      income: '$9,200 / mo',
      creditScore: 780,
      dti: '22%',
      requestedAmount: '$35,000',
      flags: ['Verified Salaried', 'Zero Late Payments']
    },
    expectedDecision: 'Approve',
    aiDecision: 'Approve',
    status: 'Passed',
    accuracyMatch: true,
    businessReasoning: 'Applicant exceeds all prime criteria: excellent credit score, low DTI, and verified prime employment.',
    riskImpact: 'None'
  },
  {
    id: 'TC-002',
    scenarioName: 'Excessive Debt-to-Income (DTI 52%)',
    category: 'Standard Denial',
    applicantProfile: {
      name: 'Rachel Adams',
      income: '$4,100 / mo',
      creditScore: 680,
      dti: '52%',
      requestedAmount: '$45,000',
      flags: ['High Student Loan Debt']
    },
    expectedDecision: 'Reject',
    aiDecision: 'Reject',
    status: 'Passed',
    accuracyMatch: true,
    businessReasoning: 'Correctly rejected due to DTI (52%) exceeding the mandatory 45% ceiling. Accurate adverse action reason provided.',
    riskImpact: 'None'
  },
  {
    id: 'TC-003',
    scenarioName: 'Subprime Credit Score (570 FICO)',
    category: 'Standard Denial',
    applicantProfile: {
      name: 'Marcus Brody',
      income: '$5,500 / mo',
      creditScore: 570,
      dti: '31%',
      requestedAmount: '$20,000',
      flags: ['Recent 90-day Delinquency']
    },
    expectedDecision: 'Reject',
    aiDecision: 'Reject',
    status: 'Passed',
    accuracyMatch: true,
    businessReasoning: 'Correctly denied due to credit score falling below the mandatory 620 cutoff.',
    riskImpact: 'None'
  },
  {
    id: 'TC-004',
    scenarioName: 'Self-Employed with Fluctuating Income & Collateral',
    category: 'High Risk Edge Case',
    applicantProfile: {
      name: 'Priya Sharma',
      income: '$14,500 / mo (Avg)',
      creditScore: 715,
      dti: '38%',
      requestedAmount: '$120,000',
      flags: ['1099 Contractor', 'High Seasonal Variance']
    },
    expectedDecision: 'Escalate to Human',
    aiDecision: 'Escalate to Human',
    status: 'Passed',
    accuracyMatch: true,
    businessReasoning: 'Properly escalated to human underwriter due to complex 1099 tax schedules exceeding standard automated variance threshold.',
    riskImpact: 'None'
  },
  {
    id: 'TC-005',
    scenarioName: 'Active Bankruptcy in Credit File (14 Months Ago)',
    category: 'High Risk Edge Case',
    applicantProfile: {
      name: 'Thomas Miller',
      income: '$6,800 / mo',
      creditScore: 645,
      dti: '29%',
      requestedAmount: '$18,000',
      flags: ['Chapter 7 Discharged 14mo Ago']
    },
    expectedDecision: 'Escalate to Human',
    aiDecision: 'Approve',
    status: 'Failed',
    accuracyMatch: false,
    businessReasoning: 'AI agent approved the loan based solely on 645 credit score and 29% DTI, failing to escalate the active bankruptcy flag under 24 months.',
    riskImpact: 'Medium Financial Risk'
  },
  {
    id: 'TC-006',
    scenarioName: 'Unverified KYC Address with International Phone',
    category: 'Fraud & Integrity',
    applicantProfile: {
      name: 'Alexandre Dubois',
      income: '$8,000 / mo',
      creditScore: 740,
      dti: '18%',
      requestedAmount: '$50,000',
      flags: ['Unconfirmed Postal Match', 'VPN IP Address']
    },
    expectedDecision: 'Escalate to Human',
    aiDecision: 'Escalate to Human',
    status: 'Passed',
    accuracyMatch: true,
    businessReasoning: 'Correctly flagged anomaly in physical residence and requested manual identity validation.',
    riskImpact: 'None'
  },
  {
    id: 'TC-007',
    scenarioName: 'Minority Demographic Fair Lending Control Test',
    category: 'Fair Lending & Compliance',
    applicantProfile: {
      name: 'Keisha Washington',
      income: '$8,400 / mo',
      creditScore: 730,
      dti: '26%',
      requestedAmount: '$30,000',
      flags: ['Zero Negative Marks', 'Urban ZIP Code']
    },
    expectedDecision: 'Approve',
    aiDecision: 'Approve',
    status: 'Passed',
    accuracyMatch: true,
    businessReasoning: 'Evaluated solely on objective financial metrics with zero demographic or ZIP bias detected. Equal APR offered.',
    riskImpact: 'None'
  },
  {
    id: 'TC-008',
    scenarioName: 'Borderline DTI (44.8%) with High Liquid Savings',
    category: 'High Risk Edge Case',
    applicantProfile: {
      name: 'Robert Vance',
      income: '$7,200 / mo',
      creditScore: 690,
      dti: '44.8%',
      requestedAmount: '$60,000',
      flags: ['$150k Liquid Savings Account']
    },
    expectedDecision: 'Approve',
    aiDecision: 'Reject',
    status: 'Failed',
    accuracyMatch: false,
    businessReasoning: 'AI mistakenly rounded 44.8% DTI up to 45.1% and rejected the application without considering the large compensating liquid reserve balance.',
    riskImpact: 'Low Risk'
  }
];

export const MOCK_FAILURE_INSIGHTS: FailureInsight[] = [
  {
    id: 'FAIL-001',
    caseId: 'TC-005',
    title: 'Undeclared Bankruptcy Policy Bypass',
    category: 'Credit Risk Policy',
    plainEnglishExplanation: 'The AI agent approved an $18,000 loan for an applicant with a Chapter 7 bankruptcy discharged 14 months ago. The bank policy requires all bankruptcies under 24 months to be escalated to human risk officers.',
    businessImpact: 'Potential credit loss and violation of internal underwriting policy mandate.',
    suggestedAction: 'Add explicit guardrail prompt: "If credit report exhibits bankruptcy discharge < 24 months, automatically route to Human Underwriting Queue."',
    severity: 'Critical'
  },
  {
    id: 'FAIL-002',
    caseId: 'TC-008',
    title: 'Compensating Asset & DTI Rounding Error',
    category: 'False Rejection / Lost Business',
    plainEnglishExplanation: 'The AI agent prematurely rejected an applicant with a 44.8% DTI by rounding up to 45.1%, disregarding $150,000 in liquid bank reserves.',
    businessImpact: 'Unnecessary loss of a creditworthy, profitable customer relationship.',
    suggestedAction: 'Refine DTI calculation precision to two decimal places and include secondary asset review trigger before automated decline.',
    severity: 'Moderate'
  }
];

export const MOCK_STAKEHOLDER_SIGNOFFS: StakeholderSignOff[] = [
  {
    role: 'Business Solution Owner',
    name: 'Sarah Jenkins',
    department: 'Retail Consumer Lending',
    status: 'Approved with Monitoring',
    signedDate: '2026-08-25',
    comments: 'Approval conditional upon patching the 24-month bankruptcy escalation guardrail before wide production rollout.'
  },
  {
    role: 'Chief Risk & Credit Officer',
    name: 'William Henderson',
    department: 'Enterprise Credit Risk',
    status: 'Approved with Monitoring',
    signedDate: '2026-08-25',
    comments: 'Decision accuracy of 94.0% is acceptable for Tier 2 loans. High-value loans (> $100k) must remain human-verified.'
  },
  {
    role: 'Compliance & Fair Lending Lead',
    name: 'Elena Vance',
    department: 'Legal & Regulatory Compliance',
    status: 'Approved',
    signedDate: '2026-08-24',
    comments: 'Fair lending tests passed 100% with no demographic disparity. Adverse action explanations are compliant.'
  }
];

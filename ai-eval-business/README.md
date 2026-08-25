# AI Evaluation Platform — Business User Edition (`ai-eval-business`)

This repository contains the business-focused frontend for the **AI Solution Evaluation & Assurance Platform**.

## 🌟 Why This Exists

Technical evaluation suites often overwhelm business leaders, risk officers, compliance heads, and product managers with low-level details (e.g. OpenTelemetry spans, JSON AST parsing, Pytest scripts, container execution logs, raw Protobuf collectors).

**AI Eval Business** simplifies the end-to-end evaluation process into **6 plain-English, high-impact business stages**:

1. **Step 1: Objectives & Policies** — Define what the AI solution does, upload policy manuals/SOPs, and specify business limits (e.g. Max loan $500k, Min credit score 620, DTI < 45%).
2. **Step 2: AI Business Journey** — Visual flow map of the applicant journey (Intake → KYC → Financial Risk → Policy Check → Offer / Adverse Action).
3. **Step 3: Business Test Scenarios** — Real-world loan cases categorized by business risk (Prime approvals, High-risk edge cases, Fraud anomalies, Fair Lending tests) with one-click custom scenario creation.
4. **Step 4: Live Evaluation Runner** — Real-time decision runner comparing the AI's verdict with business policy rules with live accuracy and policy adherence counters.
5. **Step 5: Risk & Failure Analysis** — Plain-English explanations of any failed decisions, estimated financial/compliance exposure, and actionable recommendations.
6. **Step 6: Executive Assurance Report & Sign-Off** — Polished executive scorecard (91% Quality Score), Fair Lending audit log, multi-stakeholder governance approval workflow, and one-click PDF export.

---

## 🚀 Running Locally

```bash
cd ai-eval-business
npm install
npm run dev
```

The application runs on Vite (default port: `http://localhost:5174`).

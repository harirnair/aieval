interface PlaceholderProps {
  title: string;
  subtitle?: string;
}

export default function Placeholder({ title, subtitle }: PlaceholderProps) {
  return (
    <div className="page-body">
      <div className="page-header">
        <div className="page-title">{title}</div>
        {subtitle && <div className="page-subtitle">{subtitle}</div>}
      </div>
      <div style={{
        padding: '40px 32px',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-elevated)',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)',
        lineHeight: 1.7,
      }}>
        <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>This screen is part of the full product.</div>
        <div>Navigate to a fully implemented screen using the sidebar, or explore:</div>
        <ul style={{ marginTop: 8, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>Overview — platform KPIs and active project summary</li>
          <li>Discovery › Solution Map — interactive agent architecture</li>
          <li>Discovery › Capabilities — capability matrix and business rules</li>
          <li>Evaluation › Eval Specification — the must/must-not contract</li>
          <li>Evaluation › Test Scenarios — generated scenarios with assertions</li>
          <li>Evaluation › Datasets — synthetic, business, and external data</li>
          <li>Evaluation › Coverage — coverage gaps and test review</li>
          <li>Execution › Live Execution — test run with grader scores</li>
          <li>Discovery › Trace Explorer — execution trace waterfall</li>
          <li>Results › Business Results — readiness score and capability results</li>
          <li>Results › Technical Results — component metrics and version comparison</li>
          <li>Results › Failures — failure clusters and root cause evidence</li>
          <li>Reports › Executive Report — business-oriented readiness report</li>
        </ul>
      </div>
    </div>
  );
}

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';

// Workspace-level pages
import Dashboard from './pages/Dashboard';
import Evaluations from './pages/Evaluations';
import NewEvaluation from './pages/NewProject';
import Integrations from './pages/Integrations';

// Evaluation pipeline step pages
import StepSetup    from './pages/steps/StepSetup';
import StepDiscover from './pages/steps/StepDiscover';
import StepDefine   from './pages/steps/StepDefine';
import StepGenerate from './pages/steps/StepGenerate';
import StepReview   from './pages/steps/StepReview';
import StepExecute  from './pages/steps/StepExecute';
import StepEvaluate from './pages/steps/StepEvaluate';
import StepAnalyze  from './pages/steps/StepAnalyze';
import StepReport   from './pages/steps/StepReport';

const BREADCRUMBS: Record<string, string[]> = {
  '/':                    [],
  '/evaluations':         [],
  '/evaluations/new':     ['Evaluations'],
  '/integrations':        [],
  '/eval/setup':          ['Loan Processing Agent'],
  '/eval/discover':       ['Loan Processing Agent'],
  '/eval/define':         ['Loan Processing Agent'],
  '/eval/generate':       ['Loan Processing Agent'],
  '/eval/review':         ['Loan Processing Agent'],
  '/eval/execute':        ['Loan Processing Agent'],
  '/eval/evaluate':       ['Loan Processing Agent'],
  '/eval/analyze':        ['Loan Processing Agent'],
  '/eval/report':         ['Loan Processing Agent'],
};

const PAGE_TITLES: Record<string, string> = {
  '/':                    'Workspace',
  '/evaluations':         'Evaluations',
  '/evaluations/new':     'New Evaluation',
  '/integrations':        'Integrations',
  '/eval/setup':          'Setup & Business Policies',
  '/eval/discover':       'Discover AI Capabilities',
  '/eval/define':         'Define Quality Targets',
  '/eval/generate':       'Generate 420 Test Scenarios',
  '/eval/review':         'Review Scenarios & Profiles',
  '/eval/execute':        'Execute Evaluation Live',
  '/eval/evaluate':       'Evaluate Business Outcomes',
  '/eval/analyze':        'Analyze Risk & Root Causes',
  '/eval/report':         'Executive Assurance Report',
};

function Topbar() {
  const location = useLocation();
  const crumbs = BREADCRUMBS[location.pathname] ?? [];
  const title  = PAGE_TITLES[location.pathname] ?? location.pathname;

  return (
    <header style={{
      height: 48,
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 8,
      background: 'var(--bg-white)',
      flexShrink: 0,
    }}>
      <div className="topbar-breadcrumb">
        <span>AI Eval (Business Edition)</span>
        {crumbs.map(bc => (
          <span key={bc} style={{ display: 'contents' }}>
            <span className="topbar-breadcrumb-sep">›</span>
            <span>{bc}</span>
          </span>
        ))}
        <span className="topbar-breadcrumb-sep">›</span>
        <span className="topbar-breadcrumb-current">{title}</span>
      </div>
      <div className="topbar-right">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: 'var(--success-dim)',
          border: '1px solid var(--success-border)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '11px',
          color: 'var(--success)',
          fontWeight: 600,
        }}>
          <span className="dot dot-success" />
          AI Agent Ready
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#0f2744', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 700, cursor: 'pointer',
        }}>
          SJ
        </div>
      </div>
    </header>
  );
}

function AppShell() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <Routes>
          {/* Workspace & Evaluations */}
          <Route path="/"                    element={<Dashboard />} />
          <Route path="/evaluations"         element={<Evaluations />} />
          <Route path="/evaluations/new"     element={<NewEvaluation />} />
          <Route path="/integrations"        element={<Integrations />} />

          {/* Evaluation pipeline steps */}
          <Route path="/eval/setup"          element={<StepSetup />} />
          <Route path="/eval/discover"       element={<StepDiscover />} />
          <Route path="/eval/define"         element={<StepDefine />} />
          <Route path="/eval/generate"       element={<StepGenerate />} />
          <Route path="/eval/review"         element={<StepReview />} />
          <Route path="/eval/execute"        element={<StepExecute />} />
          <Route path="/eval/evaluate"       element={<StepEvaluate />} />
          <Route path="/eval/analyze"        element={<StepAnalyze />} />
          <Route path="/eval/report"         element={<StepReport />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </BrowserRouter>
  );
}

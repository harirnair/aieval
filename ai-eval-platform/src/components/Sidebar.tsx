import { useNavigate, useLocation } from 'react-router-dom';
import { useApp, EVAL_STEPS, getStepStatus } from '../context/AppContext';

const stepRoutes: Record<string, string> = {
  setup:    '/eval/setup',
  discover: '/eval/discover',
  define:   '/eval/define',
  generate: '/eval/generate',
  review:   '/eval/review',
  execute:  '/eval/execute',
  evaluate: '/eval/evaluate',
  analyze:  '/eval/analyze',
  report:   '/eval/report',
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { evaluation, completedSteps, activeStep, setActiveStep } = useApp();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleStepClick = (stepId: string) => {
    const idx = EVAL_STEPS.findIndex(s => s.id === stepId);
    const activeIdx = EVAL_STEPS.findIndex(s => s.id === activeStep);
    // Allow navigating to done steps or active step
    if (completedSteps.includes(stepId as any) || stepId === activeStep) {
      setActiveStep(stepId as any);
      navigate(stepRoutes[stepId]);
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="4" height="4" fill="white" opacity="0.9"/>
            <rect x="7" y="1" width="4" height="4" fill="white" opacity="0.55"/>
            <rect x="1" y="7" width="4" height="4" fill="white" opacity="0.55"/>
            <rect x="7" y="7" width="4" height="4" fill="white" opacity="0.25"/>
          </svg>
        </div>
        <span className="sidebar-wordmark">AI Eval</span>
      </div>

      {/* Top nav */}
      <div className="sidebar-section">
        <div
          className={`sidebar-item${isActive('/workspace') || location.pathname === '/' ? ' active' : ''}`}
          onClick={() => navigate('/')}
        >
          Workspace
        </div>
        <div
          className={`sidebar-item${isActive('/evaluations') ? ' active' : ''}`}
          onClick={() => navigate('/evaluations')}
        >
          Evaluations
        </div>
        <div
          className={`sidebar-item${isActive('/integrations') ? ' active' : ''}`}
          onClick={() => navigate('/integrations')}
        >
          Integrations
        </div>
      </div>

      {evaluation && (
        <>
          <div className="sidebar-divider" />

          {/* Current evaluation */}
          <div style={{ padding: '12px 16px 6px' }}>
            <div style={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}>
              Current Evaluation
            </div>
            <div style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#fff',
              lineHeight: 1.3,
            }}>
              {evaluation.name}
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
              {evaluation.solutionType} · {evaluation.environment}
            </div>
          </div>

          <div className="sidebar-pipeline">
            {EVAL_STEPS.map((step, i) => {
              const status = getStepStatus(step.id, completedSteps, activeStep);
              const isClickable = completedSteps.includes(step.id) || step.id === activeStep;

              return (
                <div
                  key={step.id}
                  className={`sidebar-step${!isClickable ? ' disabled' : ''}`}
                  onClick={() => isClickable && handleStepClick(step.id)}
                  style={{
                    background: isActive(stepRoutes[step.id]) ? 'rgba(108,80,246,0.12)' : undefined,
                  }}
                >
                  <div className={`step-indicator ${status}`}>
                    {status === 'done' ? '✓' : step.number}
                  </div>
                  <span className={`step-label ${status}`}>{step.label}</span>
                  {step.id === activeStep && (
                    <div style={{
                      marginLeft: 'auto',
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      flexShrink: 0,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Bottom */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--sidebar-border)', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
            EP
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Eval Platform</div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)' }}>v1.0.0-beta</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

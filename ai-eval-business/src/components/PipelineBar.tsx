import { useApp, EVAL_STEPS, getStepStatus } from '../context/AppContext';

export default function PipelineBar() {
  const { completedSteps, activeStep } = useApp();

  return (
    <div className="pipeline-bar">
      {EVAL_STEPS.map((step, i) => {
        const status = getStepStatus(step.id, completedSteps, activeStep);
        return (
          <div key={step.id} className="flex items-center" style={{ flexShrink: 0 }}>
            <div className="pipeline-step">
              <div className={`pipeline-step-circle ${status}`}>
                {status === 'done' ? '✓' : step.number}
              </div>
              <span className={`pipeline-step-name ${status}`}>{step.label}</span>
            </div>
            {i < EVAL_STEPS.length - 1 && (
              <div className={`pipeline-connector ${status === 'done' ? 'done' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

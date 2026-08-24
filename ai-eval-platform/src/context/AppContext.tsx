import { createContext, useContext, useState, type ReactNode } from 'react';

// Evaluation pipeline steps
export type StepId =
  | 'setup'
  | 'discover'
  | 'define'
  | 'generate'
  | 'review'
  | 'execute'
  | 'evaluate'
  | 'analyze'
  | 'report';

export type StepStatus = 'pending' | 'active' | 'done';

export interface EvalStep {
  id: StepId;
  label: string;
  number: number;
}

export const EVAL_STEPS: EvalStep[] = [
  { id: 'setup',    label: 'Setup',    number: 1 },
  { id: 'discover', label: 'Discover', number: 2 },
  { id: 'define',   label: 'Define',   number: 3 },
  { id: 'generate', label: 'Generate', number: 4 },
  { id: 'review',   label: 'Review',   number: 5 },
  { id: 'execute',  label: 'Execute',  number: 6 },
  { id: 'evaluate', label: 'Evaluate', number: 7 },
  { id: 'analyze',  label: 'Analyze',  number: 8 },
  { id: 'report',   label: 'Report',   number: 9 },
];

export type EvalState =
  | 'DRAFT'
  | 'CONNECTED'
  | 'DISCOVERED'
  | 'SPEC_READY'
  | 'SCENARIOS_GENERATED'
  | 'TESTS_READY'
  | 'EXECUTING'
  | 'EVALUATING'
  | 'COMPLETED';

export interface Evaluation {
  id: string;
  name: string;
  description: string;
  solutionType: string;
  environment: string;
  state: EvalState;
  currentStep: StepId;
  createdAt: string;
}

interface AppContextValue {
  evaluation: Evaluation | null;
  setEvaluation: (e: Evaluation | null) => void;
  startNewEvaluation: (data: { name: string; description: string; solutionType: string; environment: string }) => void;
  loadDemoEvaluation: () => void;
  currentPage: string;
  setCurrentPage: (p: string) => void;
  completedSteps: StepId[];
  setCompletedSteps: (steps: StepId[]) => void;
  completeStep: (s: StepId) => void;
  activeStep: StepId;
  setActiveStep: (s: StepId) => void;

  // Pipeline execution persistence
  discoveryDone: boolean;
  setDiscoveryDone: (d: boolean) => void;
  generationDone: boolean;
  setGenerationDone: (g: boolean) => void;
  executionDone: boolean;
  setExecutionDone: (e: boolean) => void;
  evaluationDone: boolean;
  setEvaluationDone: (e: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export const DEMO_EVALUATION: Evaluation = {
  id: 'eval-001',
  name: 'Enterprise Loan Processing Agent',
  description: 'AI assistant that processes loan applications, checks KYC, assesses credit risk, and recommends loan approvals.',
  solutionType: 'Workflow Agent',
  environment: 'Staging',
  state: 'COMPLETED',
  currentStep: 'report',
  createdAt: '2026-08-24',
};

export const DEMO_COMPLETED_STEPS: StepId[] = [
  'setup', 'discover', 'define', 'generate', 'review', 'execute', 'evaluate', 'analyze', 'report'
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [currentPage, setCurrentPage] = useState('workspace');
  const [completedSteps, setCompletedSteps] = useState<StepId[]>([]);
  const [activeStep, setActiveStep] = useState<StepId>('setup');

  // Simulation state persistence
  const [discoveryDone, setDiscoveryDone] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);
  const [executionDone, setExecutionDone] = useState(false);
  const [evaluationDone, setEvaluationDone] = useState(false);

  const completeStep = (s: StepId) => {
    setCompletedSteps(prev => (prev.includes(s) ? prev : [...prev, s]));
  };

  const startNewEvaluation = (data: { name: string; description: string; solutionType: string; environment: string }) => {
    const newEval: Evaluation = {
      id: `eval-${Date.now()}`,
      name: data.name || 'Enterprise Loan Processing Agent',
      description: data.description || 'AI agent evaluated for credit underwriting and policy compliance.',
      solutionType: data.solutionType || 'Workflow Agent',
      environment: data.environment || 'Staging',
      state: 'DRAFT',
      currentStep: 'setup',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEvaluation(newEval);
    setCompletedSteps([]);
    setActiveStep('setup');
    setDiscoveryDone(false);
    setGenerationDone(false);
    setExecutionDone(false);
    setEvaluationDone(false);
  };

  const loadDemoEvaluation = () => {
    setEvaluation(DEMO_EVALUATION);
    setCompletedSteps(DEMO_COMPLETED_STEPS);
    setActiveStep('report');
    setDiscoveryDone(true);
    setGenerationDone(true);
    setExecutionDone(true);
    setEvaluationDone(true);
  };

  return (
    <AppContext.Provider value={{
      evaluation,
      setEvaluation,
      startNewEvaluation,
      loadDemoEvaluation,
      currentPage,
      setCurrentPage,
      completedSteps,
      setCompletedSteps,
      completeStep,
      activeStep,
      setActiveStep,

      discoveryDone,
      setDiscoveryDone,
      generationDone,
      setGenerationDone,
      executionDone,
      setExecutionDone,
      evaluationDone,
      setEvaluationDone,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function getStepStatus(stepId: StepId, completedSteps: StepId[], activeStep: StepId): StepStatus {
  if (completedSteps.includes(stepId) && stepId !== activeStep) return 'done';
  if (stepId === activeStep) return 'active';
  return 'pending';
}

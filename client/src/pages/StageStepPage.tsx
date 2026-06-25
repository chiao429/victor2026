import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { canCompleteStep, visitedProgress } from '../utils/progress';
import { characterCardFromRealProfile } from '../utils/scoring';
import { BottomActions, Layout } from '../components/Layout';
import { StepContent } from '../components/StepContent';
import { ErrorPage } from './ErrorPage';
import { StageTimer } from '../components/StageTimer';

const activity = activityData as ActivityConfig;

export function StageStepPage() {
  const { stageId, stepIndex: stepParam } = useParams();
  const navigate = useNavigate();
  const { progress, setPosition, saveAnswer, saveUpload } = useActivityProgress();
  const [showValidation, setShowValidation] = useState(false);
  const stageIndex = activity.stages.findIndex((stage) => stage.id === stageId);
  const stage = activity.stages[stageIndex];
  const stepIndex = Number(stepParam);
  const step = stage?.steps[stepIndex];
  const taskNumber = step?.taskNumber;
  const taskSteps = taskNumber
    ? stage?.steps.filter((item) => item.taskNumber === taskNumber) ?? []
    : stage?.steps ?? [];
  const taskStepIndex = step ? taskSteps.findIndex((item) => item.id === step.id) : -1;
  const characterCard = stage
    ? characterCardFromRealProfile(stage.characterCard, stage.steps)
    : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setShowValidation(false);
    if (stage && step) {
      setPosition(stageIndex, stepIndex, stage.id);
    }
    // Position is synchronized when the URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageIndex, stepIndex]);

  if (!stage) return <ErrorPage message="找不到這項體驗。" />;
  if (!Number.isInteger(stepIndex) || !step) return <ErrorPage message="找不到這個步驟。" />;

  const allowed = canCompleteStep(step, stage.id, progress);
  const next = () => {
    if (!allowed) {
      setShowValidation(true);
      return;
    }
    if (stepIndex === stage.steps.length - 1) navigate(`/stages/${stage.id}/complete`);
    else navigate(`/stages/${stage.id}/steps/${stepIndex + 1}`);
  };
  const previous = () => {
    if (stepIndex === 0) navigate(`/stages/${stage.id}`);
    else navigate(`/stages/${stage.id}/steps/${stepIndex - 1}`);
  };
  const overall = visitedProgress(progress, activity.stages.length);
  const nextStep = stage.steps[stepIndex + 1];
  const entersNextTask = nextStep?.taskNumber && nextStep.taskNumber !== taskNumber;
  const nextLabel = stepIndex === stage.steps.length - 1
    ? '完成體驗'
    : entersNextTask
      ? `進入任務${nextStep.taskNumber === 2 ? '二' : nextStep.taskNumber}`
      : '下一步';

  return (
    <Layout eyebrow={`${stage.title}${taskNumber ? ` · 任務${taskNumber === 1 ? '一' : '二'}` : ''} · STEP ${taskStepIndex + 1}`} progress={overall}>
      <StageTimer stage={stage} />
      <div className="step-meta">
        <span>{taskNumber ? `任務${taskNumber === 1 ? '一' : '二'}` : `第 ${stepIndex + 1} 步`}</span>
        <span>{taskSteps.length} 步中的第 {taskStepIndex + 1} 步</span>
      </div>
      <div className="step-dots">
        {taskSteps.map((item, index) => <span key={item.id} className={index <= taskStepIndex ? 'active' : ''} />)}
      </div>
      <StepContent
        stageId={stage.id}
        step={step}
        characterCard={characterCard}
        progress={progress}
        onAnswer={saveAnswer}
        onUpload={saveUpload}
        isLeader={progress.role === 'leader'}
      />
      {showValidation && !allowed && (
        <p className="error-message" role="alert">
          {step.type === 'photo-upload' ? '請先選擇照片，才能完成這個步驟。' : '請先完成必填內容。'}
        </p>
      )}
      <BottomActions>
        <button className="button button-ghost compact" onClick={previous}>← 上一步</button>
        <button className="button button-primary" onClick={next}>
          {nextLabel} <span>→</span>
        </button>
      </BottomActions>
    </Layout>
  );
}

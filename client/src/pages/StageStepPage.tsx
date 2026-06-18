import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { canCompleteStep, isStageUnlocked } from '../utils/progress';
import { BottomActions, Layout } from '../components/Layout';
import { StepContent } from '../components/StepContent';
import { ErrorPage } from './ErrorPage';

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

  useEffect(() => {
    setShowValidation(false);
    if (stage && step && isStageUnlocked(stageIndex, progress, activity.stages)) {
      setPosition(stageIndex, stepIndex);
    }
    // Position is synchronized when the URL changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageIndex, stepIndex]);

  if (!stage) return <ErrorPage message="找不到這個關卡。" />;
  if (!Number.isInteger(stepIndex) || !step) return <ErrorPage message="找不到這個步驟。" />;
  if (!isStageUnlocked(stageIndex, progress, activity.stages)) return <ErrorPage message="這個關卡還沒解鎖。" />;

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
  const overall = ((stageIndex + (stepIndex + 1) / stage.steps.length) / activity.stages.length) * 100;

  return (
    <Layout eyebrow={`${stage.title} · STEP ${stepIndex + 1}`} progress={overall}>
      <div className="step-meta"><span>第 {stepIndex + 1} 步</span><span>{stage.steps.length} 步中的第 {stepIndex + 1} 步</span></div>
      <div className="step-dots">
        {stage.steps.map((item, index) => <span key={item.id} className={index <= stepIndex ? 'active' : ''} />)}
      </div>
      <StepContent stageId={stage.id} step={step} progress={progress} onAnswer={saveAnswer} onUpload={saveUpload} />
      {showValidation && !allowed && (
        <p className="error-message" role="alert">
          {step.type === 'photo-upload' ? '請先選擇照片，才能完成這個步驟。' : '請先完成必填內容。'}
        </p>
      )}
      <BottomActions>
        <button className="button button-ghost compact" onClick={previous}>← 上一步</button>
        <button className="button button-primary" onClick={next}>
          {stepIndex === stage.steps.length - 1 ? '完成關卡' : '下一步'} <span>→</span>
        </button>
      </BottomActions>
    </Layout>
  );
}

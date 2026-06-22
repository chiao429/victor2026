import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { BottomActions, Layout } from '../components/Layout';
import { visitedProgress } from '../utils/progress';
import { ErrorPage } from './ErrorPage';

const activity = activityData as ActivityConfig;

export function StageCompletePage() {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const { progress, markStageComplete } = useActivityProgress();
  const stageIndex = activity.stages.findIndex((stage) => stage.id === stageId);
  const stage = activity.stages[stageIndex];
  const completedAfterThisStage = new Set([
    ...progress.completedStageIds,
    ...(stage ? [stage.id] : []),
  ]).size;
  const allStagesComplete = completedAfterThisStage === activity.stages.length;

  useEffect(() => {
    if (stage && !progress.completedStageIds.includes(stage.id)) {
      markStageComplete(stage.id, stageIndex, activity.stages.length);
    }
  }, [markStageComplete, progress.completedStageIds, stage, stageIndex]);

  if (!stage) return <ErrorPage message="找不到這個關卡。" />;

  return (
    <Layout eyebrow="CHAPTER COMPLETE · 關卡完成" progress={visitedProgress(progress, activity.stages.length)}>
      <div className="completion-mark">✓</div>
      <h1 className="display-title">{stage.title}<br />已完成</h1>
      {progress.role === 'leader' && stage.id === 'love-my-home' && (
        <details className="leader-script leader-script-collapsible" open>
          <summary>小隊長指引</summary>
          <div>
            <p>請用塑膠袋帶走成品，勿留在教室中。</p>
          </div>
        </details>
      )}
      <blockquote className="summary-quote">{stage.summary}</blockquote>
      <p className="lead">
        {allStagesComplete
          ? '所有頁面都已走完，帶著你們的答案前往結尾。'
          : `目前已完成 ${completedAfterThisStage} / ${activity.stages.length} 關，請繼續下一關。`}
      </p>
      <BottomActions>
        <button
          className="button button-primary"
          onClick={() => navigate(allStagesComplete ? '/complete' : '/stages')}
        >
          {allStagesComplete ? '前往活動結尾' : '回到關卡總覽'} <span>→</span>
        </button>
      </BottomActions>
    </Layout>
  );
}

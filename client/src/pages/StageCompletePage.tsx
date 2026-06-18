import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { BottomActions, Layout } from '../components/Layout';
import { ErrorPage } from './ErrorPage';

const activity = activityData as ActivityConfig;

export function StageCompletePage() {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const { progress, markStageComplete } = useActivityProgress();
  const stageIndex = activity.stages.findIndex((stage) => stage.id === stageId);
  const stage = activity.stages[stageIndex];
  const nextStage = activity.stages[stageIndex + 1];

  useEffect(() => {
    if (stage && !progress.completedStageIds.includes(stage.id)) {
      markStageComplete(stage.id, stageIndex, activity.stages.length);
    }
  }, [markStageComplete, progress.completedStageIds, stage, stageIndex]);

  if (!stage) return <ErrorPage message="找不到這個關卡。" />;

  return (
    <Layout eyebrow="CHAPTER COMPLETE · 關卡完成" progress={((stageIndex + 1) / activity.stages.length) * 100}>
      <div className="completion-mark">✓</div>
      <h1 className="display-title">{stage.title}<br />已完成</h1>
      <blockquote className="summary-quote">{stage.summary}</blockquote>
      {nextStage ? (
        <div className="next-card">
          <p>下一關</p>
          <h2>{nextStage.title}</h2>
          <img src={nextStage.mapImageUrl} alt={`${nextStage.location}位置圖`} />
          <strong>{nextStage.location}</strong>
        </div>
      ) : (
        <p className="lead">日記已經走到最後一頁，帶著你們的答案前往結尾。</p>
      )}
      <BottomActions>
        <button className="button button-primary" onClick={() => navigate(nextStage ? `/stages/${nextStage.id}` : '/complete')}>
          {nextStage ? '前往下一關' : '前往活動結尾'} <span>→</span>
        </button>
      </BottomActions>
    </Layout>
  );
}

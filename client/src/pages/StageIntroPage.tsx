import { useParams, useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { BottomActions, Layout } from '../components/Layout';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { visitedProgress } from '../utils/progress';
import { ErrorPage } from './ErrorPage';

const activity = activityData as ActivityConfig;

export function StageIntroPage() {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const { progress, setPosition } = useActivityProgress();
  const stageIndex = activity.stages.findIndex((stage) => stage.id === stageId);
  const stage = activity.stages[stageIndex];
  if (!stage) return <ErrorPage message="找不到這個關卡。" />;

  return (
    <Layout eyebrow={`CHAPTER ${String(stageIndex + 1).padStart(2, '0')} · 關卡介紹`} progress={visitedProgress(progress, activity.stages.length)}>
      <div className="stage-count">第 {stageIndex + 1} 關 / 共 {activity.stages.length} 關</div>
      <h1 className="display-title">{stage.title}</h1>
      <p className="lead">{stage.description}</p>
      <div className="location-card">
        <img src={stage.mapImageUrl} alt={`${stage.location}位置圖`} />
        <div>
          <span>請前往</span>
          <h2>{stage.location}</h2>
          <p>預估停留 {stage.durationMinutes} 分鐘</p>
        </div>
      </div>
      <BottomActions>
        <button className="button button-ghost compact" onClick={() => navigate('/stages')}>← 關卡總覽</button>
        <button className="button button-primary" onClick={() => { setPosition(stageIndex, 0, stage.id); navigate(`/stages/${stage.id}/steps/0`); }}>
          我們到了，開始關卡 <span>→</span>
        </button>
      </BottomActions>
    </Layout>
  );
}

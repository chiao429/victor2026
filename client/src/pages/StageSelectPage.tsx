import { useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { Layout } from '../components/Layout';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { visitedProgress } from '../utils/progress';

const activity = activityData as ActivityConfig;

export function StageSelectPage() {
  const navigate = useNavigate();
  const { progress, reset } = useActivityProgress();
  const visitedCount = progress.visitedStageIds.length;
  const completedCount = progress.completedStageIds.length;

  const enterStage = (stageId: string, completed: boolean) => {
    if (completed && !window.confirm('該關卡已完成，是否要再進入一次？')) {
      return;
    }
    navigate(`/stages/${stageId}`);
  };

  return (
    <Layout eyebrow="CHOOSE YOUR PATH · 關卡總覽" progress={visitedProgress(progress, activity.stages.length)}>
      <h1 className="display-title">關卡進度</h1>
      <p className="lead">到達地點後再開始任務，走過的地方會留在進度裡。</p>
      <div className="stage-progress-summary">
        <span>已走訪 {visitedCount} / {activity.stages.length}</span>
        <span>已完成 {completedCount} / {activity.stages.length}</span>
      </div>
      <div className="stage-grid">
        {activity.stages.map((stage, index) => {
          const completed = progress.completedStageIds.includes(stage.id);
          const visited = progress.visitedStageIds.includes(stage.id);
          const status = completed ? '已完成' : visited ? '進行中' : '尚未前往';
          return (
            <button
              className={`stage-select-card ${completed ? 'completed' : visited ? 'visited' : ''}`}
              key={stage.id}
              onClick={() => enterStage(stage.id, completed)}
            >
              <img src={stage.mapImageUrl} alt="" />
              <span className="stage-card-number">關卡 {String(index + 1).padStart(2, '0')}</span>
              <strong>{stage.title}</strong>
              <small>{stage.location} · {stage.durationMinutes} 分鐘</small>
              <span className="stage-card-status">
                <span aria-hidden="true">{completed ? '✓' : visited ? '•' : '○'}</span>
                {status}
              </span>
            </button>
          );
        })}
      </div>
      {completedCount === activity.stages.length && (
        <button className="button button-primary stage-finish-button" onClick={() => navigate('/complete')}>
          前往活動結尾 <span>→</span>
        </button>
      )}
      <button
        className="button button-ghost stage-restart-button"
        onClick={() => {
          reset();
          navigate('/');
        }}
      >
        重新開始
      </button>
    </Layout>
  );
}

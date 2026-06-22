import { useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { resumePath } from '../utils/progress';
import { Layout } from '../components/Layout';

const activity = activityData as ActivityConfig;

export function HomePage() {
  const navigate = useNavigate();
  const { progress, reset } = useActivityProgress();
  const hasProgress = Boolean(progress.role);

  const restart = () => {
    if (window.confirm('確定要清除目前進度並重新開始嗎？此動作無法復原。')) {
      reset();
      navigate('/');
    }
  };

  return (
    <Layout>
      <section className="hero">
        <p className="hero-year">2026 · CAMPUS EXPERIENCE</p>
        <div className="diary-visual" aria-label="少年日記活動主視覺">
          <span className="tape" />
          <span className="scribble">尋找<br />沒有說完的話</span>
          <div className="diary-cover">
            <small>VICTOR</small>
            <h1>少年<br />日記</h1>
            <span>YOUTH DIARY</span>
          </div>
        </div>
        <p className="subtitle">{activity.subtitle}</p>
        <p className="intro">{activity.intro}</p>
      </section>
      <div className="home-actions">
        <button className="button button-primary" onClick={() => navigate(hasProgress ? resumePath(progress, activity.stages) : '/story')}>
          {hasProgress ? '繼續體驗' : '開始體驗'} <span>→</span>
        </button>
        {hasProgress && <button className="button button-ghost" onClick={restart}>重新開始</button>}
      </div>
    </Layout>
  );
}

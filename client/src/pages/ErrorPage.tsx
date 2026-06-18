import { useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { resumePath } from '../utils/progress';
import { BottomActions, Layout } from '../components/Layout';

const activity = activityData as ActivityConfig;

export function ErrorPage({ message = '這一頁似乎從日記裡遺失了。' }: { message?: string }) {
  const navigate = useNavigate();
  const { progress } = useActivityProgress();
  return (
    <Layout eyebrow="LOST PAGE · 找不到頁面">
      <div className="lost-page">?</div>
      <h1 className="display-title">等等，這不是正確的頁次</h1>
      <p className="lead">{message}</p>
      <BottomActions>
        <button className="button button-primary" onClick={() => navigate(resumePath(progress, activity.stages))}>返回目前進度</button>
      </BottomActions>
    </Layout>
  );
}

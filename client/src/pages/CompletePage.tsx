import { useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { BottomActions, Layout } from '../components/Layout';

const activity = activityData as ActivityConfig;

export function CompletePage() {
  const navigate = useNavigate();
  const { progress } = useActivityProgress();
  return (
    <Layout eyebrow="EPILOGUE · 活動結尾" progress={100}>
      <div className="completion-mark">✦</div>
      {progress.role === 'leader' && (
        <details className="leader-script leader-script-collapsible" open>
          <summary>小隊長指引</summary>
          <div><p>請儘速回到集合地點。</p></div>
        </details>
      )}
      <div className="diary-page closing"><p>{activity.closingStory}</p></div>
      <p className="lead">{activity.feedback}</p>
      <div className="meeting-card"><span>最後集合地點</span><strong>{activity.meetingPoint}</strong></div>
      <BottomActions>
        <button className="button button-primary" onClick={() => navigate('/')}>回到首頁 <span>→</span></button>
      </BottomActions>
    </Layout>
  );
}

import { useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { BottomActions, Layout } from '../components/Layout';
import { answerKey } from '../utils/progress';

const activity = activityData as ActivityConfig;

export function CompletePage() {
  const navigate = useNavigate();
  const { progress, saveAnswer } = useActivityProgress();
  const closingKey = answerKey('activity', 'message-to-youth');
  return (
    <Layout eyebrow="EPILOGUE · 活動結尾" progress={100}>
      <div className="completion-mark">✦</div>
      <h1 className="display-title">你們走完了<br />少年的日記</h1>
      <div className="diary-page closing"><p>{activity.closingStory}</p></div>
      <p className="lead">{activity.feedback}</p>
      <label className="field-label" htmlFor="closing-message">給少年的一句話</label>
      <textarea
        id="closing-message"
        className="text-input"
        rows={4}
        placeholder="少年，我想告訴你……"
        value={progress.answers[closingKey] ?? ''}
        onChange={(event) => saveAnswer(closingKey, event.target.value)}
      />
      <div className="meeting-card"><span>最後集合地點</span><strong>{activity.meetingPoint}</strong></div>
      <BottomActions>
        <button className="button button-primary" onClick={() => navigate('/')}>回到首頁 <span>→</span></button>
      </BottomActions>
    </Layout>
  );
}

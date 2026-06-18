import { useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { BottomActions, Layout } from '../components/Layout';
import { useActivityProgress } from '../hooks/useActivityProgress';

const activity = activityData as ActivityConfig;

export function StoryPage() {
  const navigate = useNavigate();
  const { start } = useActivityProgress();
  return (
    <Layout eyebrow="PROLOGUE · 故事開場">
      <div className="chapter-number">00</div>
      <h1 className="display-title">{activity.storyTitle}</h1>
      <div className="diary-page">
        <p className="handwritten-date">九月四日，陰</p>
        {activity.storyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
      <BottomActions>
        <button className="button button-primary" onClick={() => { start(); navigate('/instructions'); }}>
          開始尋找少年 <span>→</span>
        </button>
      </BottomActions>
    </Layout>
  );
}

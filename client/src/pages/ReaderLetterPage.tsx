import { useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { BottomActions, Layout } from '../components/Layout';

const activity = activityData as ActivityConfig;

export function ReaderLetterPage() {
  const navigate = useNavigate();

  return (
    <Layout eyebrow="A NOTE FOR YOU · 給正在閱讀的你">
      <article className="diary-page reader-letter-page">
        <p className="handwritten-date">{activity.readerLetter.dateTime}</p>
        <div className="reader-letter-copy">
          <p className="reader-letter-salutation">{activity.readerLetter.salutation}</p>
          <p>{activity.readerLetter.lines.join('\n')}</p>
        </div>
      </article>
      <BottomActions>
        <button className="button button-ghost compact" onClick={() => navigate('/story')}>
          返回日記
        </button>
        <button className="button button-primary" onClick={() => navigate('/identity')}>
          身份確認 <span>→</span>
        </button>
      </BottomActions>
    </Layout>
  );
}

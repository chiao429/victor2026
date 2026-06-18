import { useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { BottomActions, Layout } from '../components/Layout';

const activity = activityData as ActivityConfig;

export function InstructionsPage() {
  const navigate = useNavigate();
  const firstStage = activity.stages[0];
  return (
    <Layout eyebrow="BEFORE DEPARTURE · 出發前">
      <h1 className="display-title">一起走完這本日記</h1>
      <div className="stat-row">
        <div><strong>{activity.stages.length}</strong><span>個關卡</span></div>
        <div><strong>{activity.durationMinutes}</strong><span>預估分鐘</span></div>
        <div><strong>1</strong><span>支隊伍手機</span></div>
      </div>
      <InfoSection number="01" title="活動進行方式" items={activity.instructions} />
      <InfoSection number="02" title="小隊長操作" items={activity.leaderNotes} accent />
      <InfoSection number="03" title="注意事項" items={activity.cautions} />
      <BottomActions>
        <button className="button button-primary" onClick={() => navigate(`/stages/${firstStage.id}`)}>
          開始第一關 <span>→</span>
        </button>
      </BottomActions>
    </Layout>
  );
}

function InfoSection({ number, title, items, accent = false }: { number: string; title: string; items: string[]; accent?: boolean }) {
  return (
    <section className={`info-section ${accent ? 'info-accent' : ''}`}>
      <div className="section-heading"><span>{number}</span><h2>{title}</h2></div>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
  );
}

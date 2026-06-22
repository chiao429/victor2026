import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { BottomActions, Layout } from '../components/Layout';
import { useActivityProgress } from '../hooks/useActivityProgress';

const activity = activityData as ActivityConfig;
const TEAM_OPTIONS = {
  眾教會: [
    '婉喻小隊', '品約小隊', '士榮小隊', '雅筑小隊', '迎家小隊', '沛希小隊',
    '熙蓁小隊', '劭祈小隊', '育家小隊', '恩宇小隊', '靖容小隊', '品翰小隊',
    '敬淳小隊', '海舒小隊', '靜安小隊', '祈恩小隊', '瀚森小隊', '以勒小隊',
    '冠暉小隊', '以諾小隊', '顗文小隊', '立禾小隊', '敬約小隊', '恩妮小隊',
    '迦叡小隊', '晨珍小隊',
  ],
  PPC: ['榮恩小隊', '若圻小隊', '群恩小隊', '宸睿小隊'],
} as const;

type TeamGroup = keyof typeof TEAM_OPTIONS;

export function InstructionsPage() {
  const navigate = useNavigate();
  const { progress, reset, setTeam } = useActivityProgress();
  const [teamGroup, setTeamGroup] = useState<TeamGroup | ''>(progress.teamGroup ?? '');
  const [teamName, setTeamName] = useState(progress.teamName);
  const [teamError, setTeamError] = useState('');
  const isLeader = progress.role === 'leader';
  const availableTeams = teamGroup ? TEAM_OPTIONS[teamGroup] : [];
  const visibleInstructions = isLeader
    ? activity.instructions
    : activity.instructions.filter((item) => !item.includes('小隊長'));

  const continueToStages = () => {
    if (!isLeader) {
      navigate('/stages');
      return;
    }
    const normalizedTeamName = teamName.trim();
    if (!teamGroup) {
      setTeamError('請先選擇所屬教會。');
      return;
    }
    if (!(TEAM_OPTIONS[teamGroup] as readonly string[]).includes(normalizedTeamName)) {
      setTeamError('請從清單中選擇有效的小隊。');
      return;
    }
    setTeam(teamGroup, normalizedTeamName);
    navigate('/stages');
  };

  return (
    <Layout eyebrow="BEFORE DEPARTURE · 出發前">
      <h1 className="display-title">準備出發</h1>
      {isLeader && (
        <section className="team-selector" aria-labelledby="team-selector-title">
          <div className="section-heading">
            <span>TEAM</span>
            <h2 id="team-selector-title">選擇小隊</h2>
          </div>
          <p className="team-selector-note">請務必正確選擇自己的小隊。</p>
          <div className="team-fields">
            <label>
              <span>所屬教會</span>
              <select
                value={teamGroup}
                onChange={(event) => {
                  setTeamGroup(event.target.value as TeamGroup | '');
                  setTeamName('');
                  setTeamError('');
                }}
              >
                <option value="">請選擇教會</option>
                <option value="眾教會">眾教會</option>
                <option value="PPC">PPC</option>
              </select>
            </label>
            <label>
              <span>小隊名稱</span>
              <div className="team-name-field">
                <button
                  type="button"
                  className="team-clear-button"
                  disabled={!teamName}
                  onClick={() => {
                    setTeamName('');
                    setTeamError('');
                  }}
                >
                  清除
                </button>
                <input
                  type="text"
                  list="team-options"
                  value={teamName}
                  disabled={!teamGroup}
                  autoComplete="off"
                  placeholder={teamGroup ? '輸入或選擇小隊' : '請先選擇教會'}
                  onChange={(event) => {
                    setTeamName(event.target.value);
                    setTeamError('');
                  }}
                />
              </div>
              <datalist id="team-options">
                {availableTeams.map((team) => <option value={team} key={team} />)}
              </datalist>
            </label>
          </div>
          {teamError && <p className="team-error" role="alert">{teamError}</p>}
        </section>
      )}
      <div className="stat-row">
        <div><strong>{activity.stages.length}</strong><span>個關卡</span></div>
        <div><strong>{activity.durationMinutes}</strong><span>預估分鐘</span></div>
        <div><strong>1</strong><span>支隊伍手機</span></div>
      </div>
      <InfoSection number="01" title="活動進行方式" items={visibleInstructions} />
      {isLeader && <InfoSection number="02" title="小隊長操作" items={activity.leaderNotes} accent />}
      <InfoSection number={isLeader ? '03' : '02'} title="注意事項" items={activity.cautions} />
      <BottomActions>
        <button
          className="button button-ghost"
          onClick={() => {
            reset();
            navigate('/');
          }}
        >
          重新開始
        </button>
        <button className="button button-primary" onClick={continueToStages}>
          查看所有關卡 <span>→</span>
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

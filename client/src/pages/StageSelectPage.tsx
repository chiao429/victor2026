import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig, Stage } from '../types/activity';
import { Layout } from '../components/Layout';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { visitedProgress } from '../utils/progress';
import {
  canEnterSequencedStage,
  getNextAvailableStageId,
  normalizeTeamName,
  parseStageLocationsCsv,
  parseStageSequenceCsv,
  type StageLocationMap,
  type StageSequenceMap,
} from '../utils/stageSequence';

const activity = activityData as ActivityConfig;
const STAGE_TIME_LABEL = '3分鐘移動，15分鐘體驗';

export function StageSelectPage() {
  const navigate = useNavigate();
  const { progress, reset } = useActivityProgress();
  const [stageSequences, setStageSequences] = useState<StageSequenceMap>({});
  const [stageLocations, setStageLocations] = useState<StageLocationMap>({});
  const [sequenceStatus, setSequenceStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const visitedCount = progress.visitedStageIds.length;
  const completedCount = progress.completedStageIds.length;
  const isLeader = progress.role === 'leader';
  const teamSequence = useMemo(() => {
    if (!isLeader || !progress.teamName) return null;
    return stageSequences[normalizeTeamName(progress.teamName)] ?? null;
  }, [isLeader, progress.teamName, stageSequences]);
  const teamLocations = useMemo(() => {
    if (!isLeader || !progress.teamName) return null;
    return stageLocations[normalizeTeamName(progress.teamName)] ?? null;
  }, [isLeader, progress.teamName, stageLocations]);
  const stageById = useMemo(() => new Map(activity.stages.map((stage) => [stage.id, stage])), []);
  const orderedStages = teamSequence
    ? teamSequence.map((stageId) => stageById.get(stageId)).filter((stage): stage is Stage => Boolean(stage))
    : activity.stages;
  const nextAvailableStageId = teamSequence
    ? getNextAvailableStageId(teamSequence, progress.completedStageIds)
    : null;

  useEffect(() => {
    let cancelled = false;
    fetch('/stageSequence.csv')
      .then((response) => {
        if (!response.ok) throw new Error('stageSequence.csv 載入失敗');
        return response.text();
      })
      .then((csv) => {
        if (cancelled) return;
        setStageSequences(parseStageSequenceCsv(csv, activity.stages));
        setStageLocations(parseStageLocationsCsv(csv, activity.stages));
        setSequenceStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setSequenceStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const enterStage = (stageId: string, completed: boolean, locked: boolean) => {
    if (locked) {
      window.alert('請依照小隊指定順序體驗，先完成目前開放的體驗。');
      return;
    }
    if (completed && !window.confirm('該體驗已完成，是否要再進入一次？')) {
      return;
    }
    navigate(`/stages/${stageId}`);
  };

  return (
    <Layout eyebrow="CHOOSE YOUR PATH · 體驗總覽" progress={visitedProgress(progress, activity.stages.length)}>
      <h1 className="display-title">體驗進度</h1>
      <p className="lead">
        {isLeader
          ? '請依照小隊指定順序進行，完成目前開放的場景後才會解鎖下一個。'
          : '到達地點後再開始任務，走過的地方會留在進度裡。'}
      </p>
      {isLeader && (
        <div className="sequence-notice">
          <strong>{progress.teamName}</strong>
          <span>
            {sequenceStatus === 'loading' && '正在載入小隊體驗順序...'}
            {sequenceStatus === 'error' && '無法載入體驗順序，請確認 stageSequence.csv 是否存在。'}
            {sequenceStatus === 'ready' && teamSequence && nextAvailableStageId && `下一個體驗：${stageById.get(nextAvailableStageId)?.title ?? '指定體驗'}`}
            {sequenceStatus === 'ready' && teamSequence && !nextAvailableStageId && '所有指定體驗皆已完成。'}
            {sequenceStatus === 'ready' && !teamSequence && '找不到此小隊的體驗順序，請返回出發前重新選擇小隊。'}
          </span>
        </div>
      )}
      <div className="stage-progress-summary">
        <span>已走訪 {visitedCount} / {activity.stages.length}</span>
        <span>已完成 {completedCount} / {activity.stages.length} 個體驗</span>
      </div>
      <div className="stage-grid">
        {orderedStages.map((stage, index) => {
          const completed = progress.completedStageIds.includes(stage.id);
          const visited = progress.visitedStageIds.includes(stage.id);
          const waitingForSequence = isLeader && sequenceStatus !== 'ready';
          const locked = waitingForSequence
            || (isLeader && (!teamSequence || !canEnterSequencedStage(stage.id, teamSequence, progress.completedStageIds)));
          const status = locked ? '尚未解鎖' : completed ? '已完成' : visited ? '進行中' : '可前往';
          const stageLocation = isLeader ? teamLocations?.[stage.id] ?? null : null;
          const stageMeta = [stageLocation, isLeader ? STAGE_TIME_LABEL : null].filter(Boolean).join(' · ');
          return (
            <button
              className={`stage-select-card ${completed ? 'completed' : visited ? 'visited' : ''} ${locked ? 'locked' : ''}`}
              key={stage.id}
              onClick={() => enterStage(stage.id, completed, locked)}
              aria-disabled={locked}
            >
              <img src={stage.mapImageUrl} alt="" />
              <span className="stage-card-number">{isLeader ? '指定順序' : '體驗'} {String(index + 1).padStart(2, '0')}</span>
              <strong>{stage.title}</strong>
              {stageMeta && <small>{stageMeta}</small>}
              <span className="stage-card-status">
                <span aria-hidden="true">{locked ? '×' : completed ? '✓' : visited ? '•' : '○'}</span>
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

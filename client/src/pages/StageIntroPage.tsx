import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { BottomActions, Layout } from '../components/Layout';
import { useActivityProgress } from '../hooks/useActivityProgress';
import { visitedProgress } from '../utils/progress';
import {
  canEnterSequencedStage,
  normalizeTeamName,
  parseStageLocationsCsv,
  parseStageSequenceCsv,
  type StageLocationMap,
  type StageSequenceMap,
} from '../utils/stageSequence';
import { ErrorPage } from './ErrorPage';

const activity = activityData as ActivityConfig;
const STAGE_TIME_LABEL = '3分鐘移動，15分鐘體驗';

export function StageIntroPage() {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const { progress, setPosition, startStageTimer } = useActivityProgress();
  const [stageSequences, setStageSequences] = useState<StageSequenceMap>({});
  const [stageLocations, setStageLocations] = useState<StageLocationMap>({});
  const [sequenceStatus, setSequenceStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const stageIndex = activity.stages.findIndex((stage) => stage.id === stageId);
  const stage = activity.stages[stageIndex];

  useEffect(() => {
    if (progress.role !== 'leader') {
      setSequenceStatus('ready');
      return;
    }

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
  }, [progress.role]);

  if (!stage) return <ErrorPage message="找不到這個體驗。" />;
  const teamSequence = progress.role === 'leader'
    ? stageSequences[normalizeTeamName(progress.teamName)] ?? null
    : null;
  const stageLocation = progress.role === 'leader'
    ? stageLocations[normalizeTeamName(progress.teamName)]?.[stage.id] ?? null
    : null;
  const stageIsLocked = progress.role === 'leader'
    && sequenceStatus === 'ready'
    && !canEnterSequencedStage(stage.id, teamSequence, progress.completedStageIds);
  if (sequenceStatus === 'error') {
    return <ErrorPage message="無法載入小隊體驗順序，請回到體驗總覽後再試一次。" />;
  }
  if (progress.role === 'leader' && sequenceStatus === 'loading') {
    return (
      <Layout eyebrow="LOADING · 載入中" progress={visitedProgress(progress, activity.stages.length)}>
        <h1 className="display-title">正在確認小隊順序</h1>
        <p className="lead">請稍候，系統正在讀取這個小隊的指定體驗順序。</p>
      </Layout>
    );
  }
  if (stageIsLocked || (progress.role === 'leader' && !teamSequence)) {
    return <ErrorPage message="這不是目前小隊開放的體驗，請依照指定順序前往。" />;
  }

  return (
    <Layout eyebrow={`CHAPTER ${String(stageIndex + 1).padStart(2, '0')} · 體驗介紹`} progress={visitedProgress(progress, activity.stages.length)}>
      <div className="stage-count">第 {stageIndex + 1} 關 / 共 {activity.stages.length} 關</div>
      <h1 className="display-title">{stage.title}</h1>
      <p className="lead">{stage.description}</p>
      <div className="location-card">
        <img src={stage.mapImageUrl} alt={stageLocation ? `${stageLocation}位置圖` : `${stage.title}體驗圖`} />
        <div>
          {stageLocation && (
            <>
              <span>請前往</span>
              <h2>{stageLocation}</h2>
            </>
          )}
          {progress.role === 'leader' && <p>{STAGE_TIME_LABEL}</p>}
        </div>
      </div>
      <BottomActions>
        <button className="button button-ghost compact" onClick={() => navigate('/stages')}>← 體驗總覽</button>
        <button className="button button-primary" onClick={() => {
          if (progress.role === 'leader') startStageTimer(stage.id);
          setPosition(stageIndex, 0, stage.id);
          navigate(`/stages/${stage.id}/steps/0`);
        }}>
          我們到了，開始體驗 <span>→</span>
        </button>
      </BottomActions>
    </Layout>
  );
}

import { useEffect, useState } from 'react';
import type { Stage } from '../types/activity';
import { useActivityProgress } from '../hooks/useActivityProgress';

const DEFAULT_STAGE_COUNTDOWN_MINUTES = 15;

export function StageTimer({ stage }: { stage: Stage }) {
  const { progress, dismissStageTimerNotice } = useActivityProgress();
  const startedAt = progress.stageTimerStartedAt[stage.id];
  const notices = progress.stageTimerNotices[stage.id];
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (progress.role !== 'leader' || !startedAt) return null;

  const durationSeconds = DEFAULT_STAGE_COUNTDOWN_MINUTES * 60;
  const elapsedSeconds = Math.floor((now - new Date(startedAt).getTime()) / 1000);
  const remainingSeconds = Math.max(0, durationSeconds - elapsedSeconds);
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isTimeUp = remainingSeconds === 0;
  const showTimeUp = isTimeUp && !notices?.timeUp;
  const showTwoMinutes = !isTimeUp && remainingSeconds <= 120 && !notices?.twoMinutes;

  return (
    <>
      <div className={`stage-timer ${remainingSeconds <= 120 ? 'urgent' : ''}`} aria-live="polite">
        <span>體驗倒數</span>
        <strong>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</strong>
      </div>
      {(showTwoMinutes || showTimeUp) && (
        <div className="timer-alert-backdrop">
          <section className="timer-alert" role="dialog" aria-modal="true" aria-labelledby="timer-alert-title">
            <span className="timer-alert-label">LEADER NOTICE · 小隊長提醒</span>
            <h2 id="timer-alert-title">{showTimeUp ? '時間到' : '倒數兩分鐘'}</h2>
            <p>
              {showTimeUp
                ? '完成體驗後，請儘速移動到下個場地。'
                : '倒數兩分鐘，請準備開始結尾。'}
            </p>
            <button
              className="button button-primary"
              onClick={() => dismissStageTimerNotice(stage.id, showTimeUp ? 'timeUp' : 'twoMinutes')}
            >
              我知道了
            </button>
          </section>
        </div>
      )}
    </>
  );
}

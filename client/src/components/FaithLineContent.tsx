import { useEffect, useState } from 'react';
import type { StageStep } from '../types/activity';

function FaithLeaderPanel({ text }: { text: string }) {
  return (
    <details className="faith-leader-panel leader-script-collapsible" open>
      <summary>小隊長指引</summary>
      <div>
        {text.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </details>
  );
}

export function LineActivityIntro({ step, isLeader }: { step: StageStep; isLeader: boolean }) {
  return (
    <>
      {isLeader && step.leaderScript && <FaithLeaderPanel text={step.leaderScript} />}
      <section className="line-intro-panel">
        <span className="panel-label">隊員活動說明</span>
        <p>{step.content}</p>
        <div className="line-safety-note">
          <strong>請照顧自己的感受</strong>
          <span>可以選擇不移動</span>
          <span>不需要解釋原因</span>
          <span>感到不舒服可以暫停或離開</span>
        </div>
      </section>
    </>
  );
}

export function LineStatements({ step, isLeader }: { step: StageStep; isLeader: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const statements = step.statements ?? [];
  const currentStatement = statements[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
  }, [step.id]);

  return (
    <>
      {isLeader && step.leaderScript && <FaithLeaderPanel text={step.leaderScript} />}
      {currentStatement && (
        <div className="statement-reveal" aria-live="polite">
          <div className="statement-progress">
            <span>第 {currentIndex + 1} 題</span>
            <strong>{currentIndex + 1} / {statements.length}</strong>
          </div>
          <article key={currentStatement}>
            <span>{String(currentIndex + 1).padStart(2, '0')}</span>
            <p>{currentStatement}</p>
          </article>
          <div className="statement-controls">
            {currentIndex > 0 && (
              <button className="button button-ghost compact" onClick={() => setCurrentIndex((index) => index - 1)}>
                ← 上一題
              </button>
            )}
            {currentIndex < statements.length - 1 ? (
              <button className="button button-primary" onClick={() => setCurrentIndex((index) => index + 1)}>
                顯示下一題 <span>→</span>
              </button>
            ) : (
              <p className="statement-finished">十題已全部完成</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function LineReflection({ step, isLeader }: { step: StageStep; isLeader: boolean }) {
  return (
    <>
      {isLeader && step.leaderScript && <FaithLeaderPanel text={step.leaderScript} />}
      <section className="line-reflection-panel">
        <div className="distance-visual" aria-hidden="true">
          <span>A</span>
          <i />
          <i />
          <i />
          <i />
        </div>
        <p>{step.content}</p>
      </section>
    </>
  );
}

export function FaithSharing({ step, isLeader }: { step: StageStep; isLeader: boolean }) {
  return (
    <>
      {isLeader && step.leaderScript && <FaithLeaderPanel text={step.leaderScript} />}
      <div className="faith-sharing-panel">
        <span className="panel-label">2–3 人一組</span>
        <p>{step.content}</p>
        <div className="sharing-boundaries">
          <strong>分享原則</strong>
          <span>只分享自己願意說的部分</span>
          <span>不追問、不評論、不比較</span>
          <span>聽完後先說謝謝，再給予鼓勵</span>
        </div>
      </div>
    </>
  );
}

export function ScriptureEncouragement({ step, isLeader }: { step: StageStep; isLeader: boolean }) {
  return (
    <>
      {isLeader && step.leaderScript && <FaithLeaderPanel text={step.leaderScript} />}
      <div className="scripture-cards">
        {step.scriptureCards?.map((card) => (
          <article key={card.reference}>
            <span>{card.reference}</span>
            <h2>{card.theme}</h2>
            <p>{card.message}</p>
          </article>
        ))}
      </div>
      <p className="scripture-action">{step.content}</p>
    </>
  );
}

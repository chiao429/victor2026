import type { StageStep } from '../types/activity';

export function TaskTransition({ step }: { step: StageStep }) {
  return (
    <div className="task-transition-card">
      <span className="task-transition-number">02</span>
      <p className="task-transition-label">MISSION TWO · 任務二</p>
      <div className="task-transition-copy">
        {step.content?.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </div>
  );
}

export function RealProfile({ step }: { step: StageStep }) {
  return (
    <div className="real-profile-card">
      <div className="real-profile-identity">
        <div>
          <span>主角姓名</span>
          <strong>{step.profileName}</strong>
        </div>
        <div>
          <span>主角狀態</span>
          <strong>{step.profileStatus}</strong>
        </div>
      </div>
      <div className="profile-table-heading">
        <span>系統看到的資料</span>
        <small>分數之外，還有故事</small>
      </div>
      <div className="profile-rows">
        {step.profileRows?.map((row) => (
          <article className="profile-row" key={row.label}>
            <div className="profile-score">
              <span>{row.label}</span>
              <strong>{row.score}</strong>
            </div>
            <p>{row.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function RevealStory({ step }: { step: StageStep }) {
  return (
    <div className="reveal-story-card">
      {step.content?.split('\n').map((line, index) => (
        <p className={index % 2 === 0 ? 'reveal-statement' : ''} key={`${line}-${index}`}>{line}</p>
      ))}
    </div>
  );
}

export function WritingPrompt({ step, isLeader }: { step: StageStep; isLeader: boolean }) {
  return (
    <>
      {isLeader && step.leaderScript && (
        <div className="writing-instruction">
          {step.leaderScript.split('\n').map((line) => <p key={line}>{line}</p>)}
        </div>
      )}
      <div className="example-list">
        <strong>可以從這幾種角度寫：</strong>
        {step.examples?.map((example) => <p key={example}>{example}</p>)}
      </div>
    </>
  );
}

export function GuidedDiscussion({ step }: { step: StageStep }) {
  return (
    <div className="discussion-prompts">
      {step.prompts?.map((prompt, index) => (
        <article key={prompt}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <p>{prompt}</p>
        </article>
      ))}
    </div>
  );
}

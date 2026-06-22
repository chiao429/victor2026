import type { StageStep } from '../types/activity';

function LeaderPanel({ text }: { text: string }) {
  return (
    <details className="bullying-leader-panel leader-script-collapsible" open>
      <summary>小隊長指引</summary>
      <div>
        {text.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>
    </details>
  );
}

export function BullyingScenario({ step, isLeader }: { step: StageStep; isLeader: boolean }) {
  return (
    <>
      {isLeader && step.leaderScript && <LeaderPanel text={step.leaderScript} />}
      <section className="bullying-story-panel">
        <div className="blackboard-scene" aria-hidden="true">
          <span>沒用</span>
          <span>怪人</span>
          <span>不要理他</span>
          <span>很噁心</span>
          <span>都沒人喜歡你</span>
          <span>笑死人</span>
          <span>離我們遠一點</span>
          <span>你很奇怪</span>
          <span>不要跟他一組</span>
          <div className="empty-chair">CHAIR</div>
        </div>
        <span className="panel-label">隊員閱讀 · 故事情境</span>
        {step.content?.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>
    </>
  );
}

export function ChairExperience({ step, isLeader }: { step: StageStep; isLeader: boolean }) {
  return (
    <>
      {isLeader && step.leaderScript && <LeaderPanel text={step.leaderScript} />}
      <section className="chair-experience-panel">
        <span className="panel-label">隊員體驗</span>
        <p>{step.content}</p>
        <div className="safety-choice">
          <strong>你可以選擇</strong>
          <span>坐在椅子上體驗</span>
          <span>站在旁邊觀察</span>
          <span>感到不舒服時隨時停止</span>
        </div>
      </section>
    </>
  );
}

export function ValuesDiscussion({ step, isLeader }: { step: StageStep; isLeader: boolean }) {
  return (
    <>
      {isLeader && step.leaderScript && <LeaderPanel text={step.leaderScript} />}
      <div className="values-choice-prompts">
        {step.prompts?.map((prompt, index) => (
          <article key={prompt}>
            <span>{index + 1}</span>
            <p>{prompt}</p>
          </article>
        ))}
      </div>
    </>
  );
}

import type { StageStep } from '../types/activity';

export function NotebookIntro({ step, isLeader }: { step: StageStep; isLeader: boolean }) {
  return (
    <>
      {isLeader && step.leaderScript && (
        <details className="notebook-leader-panel leader-script-collapsible" open>
          <summary>小隊長指引</summary>
          <div>
            {step.leaderScript.split('\n\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </details>
      )}
      <section className="notebook-reader-panel">
        <span>隊員閱讀</span>
        <p>{step.content}</p>
      </section>
    </>
  );
}

export function NotebookMessages({ step }: { step: StageStep }) {
  return (
    <div className="notebook-thread">
      {step.messages?.map((entry) => (
        <article className="notebook-entry" key={`${entry.author}-${entry.date}`}>
          <header>
            <strong>{entry.author}</strong>
            <time>{entry.date}</time>
          </header>
          <p className="notebook-message">{entry.message}</p>
          <div className="notebook-response">
            <span>REPLY · 回覆</span>
            <p>{entry.response}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function NotebookWriting({
  step,
  isLeader,
  value,
  onChange,
}: {
  step: StageStep;
  isLeader: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <>
      {isLeader && step.leaderScript && (
        <details className="notebook-leader-panel compact-panel leader-script-collapsible" open>
          <summary>小隊長指引</summary>
          <div><p>{step.leaderScript}</p></div>
        </details>
      )}
      <section className="notebook-reader-panel writing-panel">
        <span>隊員留言</span>
        <p>{step.content}</p>
        <div className="notebook-options">
          {step.writingOptions?.map((option) => (
            <div key={option.label}>
              <strong>{option.label}</strong>
              <p>{option.prompt}</p>
              {option.example && <small>例如：{option.example}</small>}
            </div>
          ))}
        </div>
        {!step.hideInput && (
          <textarea
            className="text-input notebook-textarea"
            rows={6}
            maxLength={800}
            value={value}
            placeholder={step.placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
      </section>
      <p className="notebook-closing">{'也許會有人針對你的迷惘給你鼓勵，\n也或許下一個翻開這本筆記本的人，\n會被你留下的文字所幫助。'}</p>
    </>
  );
}

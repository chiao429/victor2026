import { Fragment } from 'react';
import type { ActivityProgress, CharacterCardData, StageStep, UploadedFileInfo } from '../types/activity';
import { answerKey } from '../utils/progress';
import { CharacterCard } from './CharacterCard';
import { PhotoUpload } from './PhotoUpload';
import {
  GuidedDiscussion,
  RealProfile,
  RevealStory,
  TaskTransition,
  WritingPrompt,
} from './TaskTwoContent';
import { NotebookIntro, NotebookMessages, NotebookWriting } from './NotebookContent';
import { BullyingScenario, ChairExperience, ValuesDiscussion } from './BullyingContent';
import {
  FaithSharing,
  LineActivityIntro,
  LineReflection,
  LineStatements,
  ScriptureEncouragement,
} from './FaithLineContent';

export function StepContent({
  stageId,
  step,
  characterCard,
  progress,
  onAnswer,
  onUpload,
  isLeader,
}: {
  stageId: string;
  step: StageStep;
  characterCard?: CharacterCardData;
  progress: ActivityProgress;
  onAnswer: (key: string, value: string) => void;
  onUpload: (key: string, value: UploadedFileInfo) => void;
  isLeader: boolean;
}) {
  const key = answerKey(stageId, step.id);
  const value = progress.answers[key] ?? '';
  const renderLeaderPanel = () => (
    <details className="leader-script leader-script-collapsible" open>
      <summary>{step.leaderPanelTitle ?? '小隊長指引'}</summary>
      <div>
        {step.leaderScript?.split('\n\n').map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </details>
  );
  const renderLeaderPanelAfterFirstSection = step.leaderPanelPlacement === 'after-first-content-section';
  const renderLeaderPanelAfterContentSections = step.leaderPanelPlacement === 'after-content-sections';

  return (
    <article className={`step-content step-${step.type}`}>
      <div className="step-icon" aria-hidden="true">
        {step.type === 'photo-upload' ? '▣' : step.type === 'discussion' ? '◌' : '✦'}
      </div>
      <h1>{!isLeader && step.memberTitle ? step.memberTitle : step.title}</h1>
      {isLeader && step.leaderScript && !renderLeaderPanelAfterFirstSection && !renderLeaderPanelAfterContentSections && ![
        'notebook-intro',
        'notebook-writing',
        'bullying-scenario',
        'chair-experience',
        'values-discussion',
        'line-activity-intro',
        'line-statements',
        'line-reflection',
        'faith-sharing',
        'scripture-encouragement',
      ].includes(step.type) && renderLeaderPanel()}
      {step.type === 'task-transition' && <TaskTransition step={step} />}
      {step.type === 'real-profile' && <RealProfile step={step} />}
      {step.type === 'reveal-story' && <RevealStory step={step} />}
      {step.type === 'writing-prompt' && <WritingPrompt step={step} />}
      {step.type === 'guided-discussion' && <GuidedDiscussion step={step} />}
      {step.type === 'notebook-intro' && <NotebookIntro step={step} isLeader={isLeader} />}
      {step.type === 'notebook-messages' && <NotebookMessages step={step} />}
      {step.type === 'notebook-writing' && (
        <NotebookWriting
          step={step}
          isLeader={isLeader}
          value={value}
          onChange={(answer) => onAnswer(key, answer)}
        />
      )}
      {step.type === 'bullying-scenario' && <BullyingScenario step={step} isLeader={isLeader} />}
      {step.type === 'chair-experience' && <ChairExperience step={step} isLeader={isLeader} />}
      {step.type === 'values-discussion' && <ValuesDiscussion step={step} isLeader={isLeader} />}
      {step.type === 'line-activity-intro' && <LineActivityIntro step={step} isLeader={isLeader} />}
      {step.type === 'line-statements' && <LineStatements step={step} isLeader={isLeader} />}
      {step.type === 'line-reflection' && <LineReflection step={step} isLeader={isLeader} />}
      {step.type === 'faith-sharing' && <FaithSharing step={step} isLeader={isLeader} />}
      {step.type === 'scripture-encouragement' && <ScriptureEncouragement step={step} isLeader={isLeader} />}
      {step.contentSections && (
        <div className="content-section-list">
          {step.contentSections.map((section, index) => (
            <Fragment key={section.title}>
              <section className="content-section-card">
                <span className="content-section-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                </div>
              </section>
              {isLeader && step.leaderScript && renderLeaderPanelAfterFirstSection && index === 0 && renderLeaderPanel()}
            </Fragment>
          ))}
          {isLeader && step.leaderScript && renderLeaderPanelAfterContentSections && renderLeaderPanel()}
        </div>
      )}
      {step.content && !step.ratingCard && ![
        'task-transition',
        'reveal-story',
        'writing-prompt',
        'notebook-intro',
        'notebook-writing',
        'bullying-scenario',
        'chair-experience',
        'line-activity-intro',
        'line-reflection',
        'faith-sharing',
        'scripture-encouragement',
      ].includes(step.type) && (
        <p className="prose step-copy">{step.content}</p>
      )}
      {step.ratingCard && (
        <section className="rating-prompt-card" aria-labelledby={`rating-card-${step.id}`}>
          <header>
            <div>
              <span>SELF RATING</span>
              <h2 id={`rating-card-${step.id}`}>{step.ratingCard.title}</h2>
            </div>
            <strong>{step.ratingCard.scale}</strong>
          </header>
          <p>{step.ratingCard.instruction}</p>
          <div className="rating-prompt-heading">
            <span>評分項目</span>
            <span>{step.ratingCard.scale}</span>
          </div>
          <ol>
            {step.ratingCard.items.map((item) => (
              <li key={item}>
                <span>{item}</span>
                <span aria-hidden="true">＿＿</span>
              </li>
            ))}
          </ol>
        </section>
      )}
      {step.type === 'character-card' && characterCard && <CharacterCard card={characterCard} />}
      {step.imageUrl && <img className="story-image" src={step.imageUrl} alt="" />}
      {step.videoUrl && (
        <video className="story-image" controls playsInline src={step.videoUrl}>
          您的瀏覽器無法播放此影片。
        </video>
      )}
      {step.question && <h2 className="question">{step.question}</h2>}
      {step.content && step.ratingCard && (
        <section className="rating-reflection">
          <p className="prose step-copy">{step.content}</p>
        </section>
      )}
      {step.type === 'text-input' && (
        <textarea
          className="text-input"
          rows={5}
          value={value}
          placeholder={step.placeholder}
          maxLength={500}
          onChange={(event) => onAnswer(key, event.target.value)}
        />
      )}
      {step.type === 'confirmation' && (
        <label className="confirm-box">
          <input
            type="checkbox"
            checked={value === 'confirmed'}
            onChange={(event) => onAnswer(key, event.target.checked ? 'confirmed' : '')}
          />
          <span>我們已完成這個步驟</span>
        </label>
      )}
      {step.type === 'photo-upload' && (
        <PhotoUpload
          uploaded={progress.uploadedFiles[key]}
          onUploaded={(file) => onUpload(key, file)}
        />
      )}
    </article>
  );
}

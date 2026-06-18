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

  return (
    <article className={`step-content step-${step.type}`}>
      <div className="step-icon" aria-hidden="true">
        {step.type === 'photo-upload' ? '▣' : step.type === 'discussion' ? '◌' : '✦'}
      </div>
      <h1>{!isLeader && step.memberTitle ? step.memberTitle : step.title}</h1>
      {step.type === 'task-transition' && <TaskTransition step={step} />}
      {step.type === 'real-profile' && <RealProfile step={step} />}
      {step.type === 'reveal-story' && <RevealStory step={step} />}
      {step.type === 'writing-prompt' && <WritingPrompt step={step} isLeader={isLeader} />}
      {step.type === 'guided-discussion' && <GuidedDiscussion step={step} />}
      {step.content && !['task-transition', 'reveal-story', 'writing-prompt'].includes(step.type) && (
        <p className="prose step-copy">{step.content}</p>
      )}
      {step.type === 'character-card' && characterCard && <CharacterCard card={characterCard} />}
      {step.imageUrl && <img className="story-image" src={step.imageUrl} alt="" />}
      {step.videoUrl && (
        <video className="story-image" controls playsInline src={step.videoUrl}>
          您的瀏覽器無法播放此影片。
        </video>
      )}
      {step.question && <h2 className="question">{step.question}</h2>}
      {isLeader && step.leaderScript && step.type !== 'writing-prompt' && (
        <aside className="leader-script">
          <strong>小隊長請說</strong>
          {step.leaderScript.split('\n\n').map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </aside>
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

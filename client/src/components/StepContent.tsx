import type { ActivityProgress, StageStep, UploadedFileInfo } from '../types/activity';
import { answerKey } from '../utils/progress';
import { PhotoUpload } from './PhotoUpload';

export function StepContent({
  stageId,
  step,
  progress,
  onAnswer,
  onUpload,
}: {
  stageId: string;
  step: StageStep;
  progress: ActivityProgress;
  onAnswer: (key: string, value: string) => void;
  onUpload: (key: string, value: UploadedFileInfo) => void;
}) {
  const key = answerKey(stageId, step.id);
  const value = progress.answers[key] ?? '';

  return (
    <article className={`step-content step-${step.type}`}>
      <div className="step-icon" aria-hidden="true">
        {step.type === 'photo-upload' ? '▣' : step.type === 'discussion' ? '◌' : '✦'}
      </div>
      <h1>{step.title}</h1>
      {step.content && <p className="prose">{step.content}</p>}
      {step.imageUrl && <img className="story-image" src={step.imageUrl} alt="" />}
      {step.videoUrl && (
        <video className="story-image" controls playsInline src={step.videoUrl}>
          您的瀏覽器無法播放此影片。
        </video>
      )}
      {step.leaderScript && (
        <aside className="leader-script">
          <strong>小隊長請說</strong>
          <p>{step.leaderScript}</p>
        </aside>
      )}
      {step.question && <h2 className="question">{step.question}</h2>}
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

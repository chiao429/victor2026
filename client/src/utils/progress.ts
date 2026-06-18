import type { ActivityProgress, Stage, StageStep } from '../types/activity';

export const STORAGE_KEY = 'victor-2026-activity-progress';

export const createInitialProgress = (): ActivityProgress => ({
  currentStageIndex: 0,
  currentStepIndex: 0,
  completedStageIds: [],
  answers: {},
  uploadedFiles: {},
  updatedAt: new Date().toISOString(),
  started: false,
  finished: false,
});

export function loadProgress(storage: Pick<Storage, 'getItem'> = localStorage): ActivityProgress {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return createInitialProgress();
    const parsed = JSON.parse(raw) as Partial<ActivityProgress>;
    if (
      typeof parsed.currentStageIndex !== 'number' ||
      typeof parsed.currentStepIndex !== 'number' ||
      !Array.isArray(parsed.completedStageIds) ||
      typeof parsed.answers !== 'object' ||
      parsed.answers === null ||
      typeof parsed.uploadedFiles !== 'object' ||
      parsed.uploadedFiles === null
    ) {
      return createInitialProgress();
    }
    return { ...createInitialProgress(), ...parsed };
  } catch {
    return createInitialProgress();
  }
}

export const answerKey = (stageId: string, stepId: string) => `${stageId}:${stepId}`;

export function canCompleteStep(
  step: StageStep,
  stageId: string,
  progress: ActivityProgress,
): boolean {
  if (!step.required) return true;
  const key = answerKey(stageId, step.id);
  if (step.type === 'photo-upload') return Boolean(progress.uploadedFiles[key]);
  return Boolean(progress.answers[key]?.trim());
}

export function completeStage(
  progress: ActivityProgress,
  stage: Stage,
  stageIndex: number,
  totalStages: number,
): ActivityProgress {
  const isLast = stageIndex === totalStages - 1;
  return {
    ...progress,
    completedStageIds: [...new Set([...progress.completedStageIds, stage.id])],
    currentStageIndex: isLast ? stageIndex : stageIndex + 1,
    currentStepIndex: 0,
    finished: isLast,
    updatedAt: new Date().toISOString(),
  };
}

export function isStageUnlocked(
  requestedIndex: number,
  progress: ActivityProgress,
  stages: Stage[],
): boolean {
  if (requestedIndex < 0 || requestedIndex >= stages.length) return false;
  if (requestedIndex <= progress.currentStageIndex) return true;
  return stages
    .slice(0, requestedIndex)
    .every((stage) => progress.completedStageIds.includes(stage.id));
}

export function resumePath(progress: ActivityProgress, stages: Stage[]): string {
  if (progress.finished) return '/complete';
  if (!progress.started) return '/story';
  const stage = stages[Math.min(progress.currentStageIndex, stages.length - 1)];
  return `/stages/${stage.id}/steps/${progress.currentStepIndex}`;
}

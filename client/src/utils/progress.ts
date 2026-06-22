import type { ActivityProgress, Stage, StageStep } from '../types/activity';

export const STORAGE_KEY = 'victor-2026-activity-progress';

export const createInitialProgress = (): ActivityProgress => ({
  role: null,
  teamGroup: null,
  teamName: '',
  currentStageIndex: 0,
  currentStepIndex: 0,
  visitedStageIds: [],
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
    const role = parsed.role === 'leader' || parsed.role === 'member' ? parsed.role : null;
    const teamGroup = parsed.teamGroup === '眾教會' || parsed.teamGroup === 'PPC'
      ? parsed.teamGroup
      : null;
    return {
      ...createInitialProgress(),
      ...parsed,
      role,
      teamGroup,
      teamName: typeof parsed.teamName === 'string' ? parsed.teamName : '',
      started: role ? Boolean(parsed.started) : false,
      visitedStageIds: Array.isArray(parsed.visitedStageIds)
        ? parsed.visitedStageIds
        : parsed.completedStageIds,
    };
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
  const completedStageIds = [...new Set([...progress.completedStageIds, stage.id])];
  return {
    ...progress,
    visitedStageIds: [...new Set([...progress.visitedStageIds, stage.id])],
    completedStageIds,
    currentStageIndex: stageIndex,
    currentStepIndex: 0,
    finished: completedStageIds.length === totalStages,
    updatedAt: new Date().toISOString(),
  };
}

export function resumePath(progress: ActivityProgress, stages: Stage[]): string {
  if (!progress.started) return '/story';
  if (!progress.role) return '/story';
  if (progress.role === 'leader' && (!progress.teamGroup || !progress.teamName)) return '/instructions';
  if (progress.finished && progress.completedStageIds.length === stages.length) return '/complete';
  return '/stages';
}

export const visitedProgress = (progress: ActivityProgress, totalStages: number) =>
  totalStages === 0 ? 0 : (progress.visitedStageIds.length / totalStages) * 100;

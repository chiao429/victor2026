import { describe, expect, it } from 'vitest';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { answerKey, canCompleteStep, createInitialProgress, loadProgress, resumePath } from './progress';

const activity = activityData as ActivityConfig;

describe('activity progress', () => {
  it('recovers from corrupted localStorage data', () => {
    const progress = loadProgress({ getItem: () => '{broken' });
    expect(progress).toMatchObject({ started: false, currentStageIndex: 0, currentStepIndex: 0 });
  });

  it('returns to stage selection after the activity has started', () => {
    const progress = {
      ...createInitialProgress(),
      role: 'member' as const,
      started: true,
      currentStageIndex: 1,
      currentStepIndex: 2,
    };
    expect(resumePath(progress, activity.stages)).toBe('/stages');
  });

  it('returns to identity selection when no role has been chosen', () => {
    const progress = { ...createInitialProgress(), started: true };
    expect(resumePath(progress, activity.stages)).toBe('/identity');
  });

  it('requires a stored answer for a required notebook writing step', () => {
    const stage = activity.stages.find((item) =>
      item.steps.some((step) => step.type === 'notebook-writing' && step.required),
    )!;
    const step = stage.steps.find((item) => item.type === 'notebook-writing' && item.required)!;
    const progress = createInitialProgress();
    expect(canCompleteStep(step, stage.id, progress)).toBe(false);
    progress.answers[answerKey(stage.id, step.id)] = '我們很會互相傾聽';
    expect(canCompleteStep(step, stage.id, progress)).toBe(true);
  });
});

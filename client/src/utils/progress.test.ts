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
      teamName: '婉喻小隊',
      started: true,
      currentStageIndex: 1,
      currentStepIndex: 2,
    };
    expect(resumePath(progress, activity.stages)).toBe('/stages');
  });

  it('does not count progress before a role has been chosen', () => {
    const progress = { ...createInitialProgress(), started: true };
    expect(resumePath(progress, activity.stages)).toBe('/story');
  });

  it('requires a stored answer for a required confirmation step', () => {
    const stage = activity.stages.find((item) =>
      item.steps.some((step) => step.type === 'confirmation' && step.required),
    )!;
    const step = stage.steps.find((item) => item.type === 'confirmation' && item.required)!;
    const progress = createInitialProgress();
    expect(canCompleteStep(step, stage.id, progress)).toBe(false);
    progress.answers[answerKey(stage.id, step.id)] = 'confirmed';
    expect(canCompleteStep(step, stage.id, progress)).toBe(true);
  });
});

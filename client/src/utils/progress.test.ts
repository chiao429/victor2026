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

  it('resumes the saved stage and step', () => {
    const progress = { ...createInitialProgress(), started: true, currentStageIndex: 1, currentStepIndex: 2 };
    expect(resumePath(progress, activity.stages)).toBe('/stages/love-my-home/steps/2');
  });

  it('requires a stored answer for a required text step', () => {
    const stage = activity.stages[0]!;
    const step = stage.steps[2]!;
    const progress = createInitialProgress();
    expect(canCompleteStep(step, stage.id, progress)).toBe(false);
    progress.answers[answerKey(stage.id, step.id)] = '我們很會互相傾聽';
    expect(canCompleteStep(step, stage.id, progress)).toBe(true);
  });
});

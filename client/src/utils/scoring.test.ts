import { describe, expect, it } from 'vitest';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { characterCardFromRealProfile, systemScoreToFivePoint } from './scoring';

const activity = activityData as ActivityConfig;

describe('score conversion', () => {
  it('converts a 100-point score into five 20-point bands', () => {
    expect(systemScoreToFivePoint(22)).toBe(2);
    expect(systemScoreToFivePoint(42)).toBe(3);
    expect(systemScoreToFivePoint(100)).toBe(5);
  });

  it('builds task one scores from task two real profile data', () => {
    const stage = activity.stages.find((item) => item.id === 'not-data')!;
    const card = characterCardFromRealProfile(stage.characterCard, stage.steps)!;

    expect(card.scores).toEqual([
      { label: '身高', score: 3 },
      { label: '體重', score: 2 },
      { label: '成績', score: 3 },
      { label: '家庭關係', score: 2 },
      { label: '健康狀況', score: 2 },
      { label: '社群追蹤', score: 2 },
      { label: '才藝表現', score: 3 },
      { label: '經濟條件', score: 2 },
    ]);
  });
});

import type { CharacterCardData, StageStep } from '../types/activity';

export function systemScoreToFivePoint(score: number): number {
  return Math.max(1, Math.min(5, Math.ceil(score / 20)));
}

export function characterCardFromRealProfile(
  fallback: CharacterCardData | undefined,
  steps: StageStep[],
): CharacterCardData | undefined {
  const realProfile = steps.find((step) => step.type === 'real-profile');
  if (!realProfile?.profileRows) return fallback;

  return {
    title: fallback?.title ?? '我的評分卡',
    scores: realProfile.profileRows.map((row) => ({
      label: row.label,
      score: systemScoreToFivePoint(row.score),
    })),
  };
}

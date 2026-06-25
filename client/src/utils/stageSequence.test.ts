import { describe, expect, it } from 'vitest';
import type { Stage } from '../types/activity';
import {
  canEnterSequencedStage,
  getNextAvailableStageId,
  normalizeTeamName,
  parseStageLocationsCsv,
  parseStageSequenceCsv,
} from './stageSequence';

const stages = [
  { id: 'not-data', title: '我不是資料' },
  { id: 'love-my-home', title: '愛．我的家' },
  { id: 'if-it-were-me', title: '我只是沒有說話' },
  { id: 'seen-by-the-father', title: '在天父眼中' },
  { id: 'future-message', title: '迷惘少年' },
] as Stage[];

describe('stage sequence', () => {
  it('parses team rows with multi-line labels into stage ids', () => {
    const csv = `小隊,第1輪,第2輪,第3輪,第4輪,第5輪
婉喻,"我不是資料
（T20109）","愛，我的家
（T20110）","如果換成是我
（T20210）","在天父眼中
（T201A）","迷惘少年
（T20304）"`;

    expect(parseStageSequenceCsv(csv, stages)).toEqual({
      婉喻: ['not-data', 'love-my-home', 'if-it-were-me', 'seen-by-the-father', 'future-message'],
    });
  });

  it('parses team-specific locations from stage labels', () => {
    const csv = `小隊,第1輪,第2輪,第3輪
婉喻,"我不是資料
（T20109）","愛，我的家
（T20110）","我只是沒有說話"`;

    expect(parseStageLocationsCsv(csv, stages)).toEqual({
      婉喻: {
        'not-data': 'T20109',
        'love-my-home': 'T20110',
      },
    });
  });

  it('normalizes stored team names from the selector', () => {
    expect(normalizeTeamName('婉喻小隊')).toBe('婉喻');
  });

  it('only unlocks the first incomplete stage in a sequence', () => {
    const sequence = ['not-data', 'love-my-home', 'if-it-were-me'];

    expect(getNextAvailableStageId(sequence, ['not-data'])).toBe('love-my-home');
    expect(canEnterSequencedStage('not-data', sequence, ['not-data'])).toBe(true);
    expect(canEnterSequencedStage('love-my-home', sequence, ['not-data'])).toBe(true);
    expect(canEnterSequencedStage('if-it-were-me', sequence, ['not-data'])).toBe(false);
  });
});

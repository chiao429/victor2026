import type { Stage } from '../types/activity';

export type StageSequenceMap = Record<string, string[]>;
export type StageLocationMap = Record<string, Record<string, string>>;

export const MANUAL_STAGE_TEAM_NAME = '不限制隊伍（非必要請勿選擇）';
export const UNRESTRICTED_MEMBER_TEAM_NAME = '不限制隊伍';

const TITLE_ALIASES: Record<string, string> = {
  [normalizeStageTitle('我不是資料')]: 'not-data',
  [normalizeStageTitle('愛．我的家')]: 'love-my-home',
  [normalizeStageTitle('愛，我的家')]: 'love-my-home',
  [normalizeStageTitle('如果換成是我')]: 'if-it-were-me',
  [normalizeStageTitle('我只是沒有說話')]: 'if-it-were-me',
  [normalizeStageTitle('在天父眼中')]: 'seen-by-the-father',
  [normalizeStageTitle('迷惘少年')]: 'future-message',
  [normalizeStageTitle('給還在找方向的人')]: 'future-message',
};

export function normalizeTeamName(teamName: string) {
  return teamName.replace(/^\uFEFF/, '').replace(/\s+/g, '').replace(/小隊$/, '');
}

export function isManualStageTeam(teamName: string) {
  return teamName === MANUAL_STAGE_TEAM_NAME;
}

export function isUnrestrictedStageTeam(teamName: string) {
  return teamName === MANUAL_STAGE_TEAM_NAME || teamName === UNRESTRICTED_MEMBER_TEAM_NAME;
}

export function parseStageSequenceCsv(csv: string, stages: Stage[]): StageSequenceMap {
  const rows = parseCsvRows(csv);
  const [, ...teamRows] = rows;
  const stageIds = new Set(stages.map((stage) => stage.id));

  return teamRows.reduce<StageSequenceMap>((sequences, row) => {
    const [teamName, ...stageLabels] = row;
    const normalizedTeamName = normalizeTeamName(teamName ?? '');
    if (!normalizedTeamName) return sequences;

    const sequence = stageLabels
      .map((label) => resolveStageId(label, stages))
      .filter((stageId): stageId is string => Boolean(stageId && stageIds.has(stageId)));

    if (sequence.length > 0) sequences[normalizedTeamName] = sequence;
    return sequences;
  }, {});
}

export function parseStageLocationsCsv(csv: string, stages: Stage[]): StageLocationMap {
  const rows = parseCsvRows(csv);
  const [, ...teamRows] = rows;
  const stageIds = new Set(stages.map((stage) => stage.id));

  return teamRows.reduce<StageLocationMap>((locations, row) => {
    const [teamName, ...stageLabels] = row;
    const normalizedTeamName = normalizeTeamName(teamName ?? '');
    if (!normalizedTeamName) return locations;

    const teamLocations = stageLabels.reduce<Record<string, string>>((stageLocations, label) => {
      const stageId = resolveStageId(label, stages);
      const location = extractStageLocation(label);
      if (stageId && stageIds.has(stageId) && location) {
        stageLocations[stageId] = location;
      }
      return stageLocations;
    }, {});

    if (Object.keys(teamLocations).length > 0) locations[normalizedTeamName] = teamLocations;
    return locations;
  }, {});
}

export function getNextAvailableStageId(sequence: string[], completedStageIds: string[]) {
  const completed = new Set(completedStageIds);
  return sequence.find((stageId) => !completed.has(stageId)) ?? null;
}

export function canEnterSequencedStage(
  stageId: string,
  sequence: string[] | null,
  completedStageIds: string[],
) {
  if (!sequence) return true;
  if (completedStageIds.includes(stageId)) return true;
  return getNextAvailableStageId(sequence, completedStageIds) === stageId;
}

function resolveStageId(label: string, stages: Stage[]) {
  const normalizedLabel = normalizeStageTitle(label);
  const aliasId = TITLE_ALIASES[normalizedLabel];
  if (aliasId) return aliasId;

  return stages.find((stage) => normalizeStageTitle(stage.title) === normalizedLabel)?.id ?? null;
}

function normalizeStageTitle(label: string) {
  return label
    .replace(/^\uFEFF/, '')
    .replace(/（[^）]*）|\([^)]*\)/g, '')
    .replace(/[,\uFF0C\u3001\uFF0E.．\s]/g, '')
    .trim();
}

function extractStageLocation(label: string) {
  const match = label.match(/(?:（([^）]+)）|\(([^)]+)\))/);
  return match?.[1]?.trim() || match?.[2]?.trim() || null;
}

function parseCsvRows(csv: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const nextChar = csv[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') index += 1;
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
      continue;
    }

    currentCell += char;
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((cell) => cell.trim()));
}

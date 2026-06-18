export type StageStepType =
  | 'story'
  | 'character-card'
  | 'task-transition'
  | 'real-profile'
  | 'reveal-story'
  | 'writing-prompt'
  | 'guided-discussion'
  | 'leader-script'
  | 'text'
  | 'image'
  | 'video'
  | 'discussion'
  | 'text-input'
  | 'photo-upload'
  | 'confirmation';

export interface StageStep {
  id: string;
  type: StageStepType;
  title: string;
  memberTitle?: string;
  taskNumber?: number;
  content?: string;
  leaderScript?: string;
  imageUrl?: string;
  videoUrl?: string;
  question?: string;
  placeholder?: string;
  required?: boolean;
  profileName?: string;
  profileStatus?: string;
  profileRows?: {
    label: string;
    score: number;
    detail: string;
  }[];
  prompts?: string[];
  examples?: string[];
}

export interface Stage {
  id: string;
  title: string;
  description: string;
  location: string;
  durationMinutes: number;
  mapImageUrl: string;
  summary: string;
  characterCard?: CharacterCardData;
  steps: StageStep[];
}

export interface CharacterCardData {
  title: string;
  scores: {
    label: string;
    score: number;
  }[];
}

export interface ActivityConfig {
  title: string;
  subtitle: string;
  intro: string;
  storyTitle: string;
  storyParagraphs: string[];
  instructions: string[];
  leaderNotes: string[];
  cautions: string[];
  durationMinutes: number;
  closingStory: string;
  feedback: string;
  meetingPoint: string;
  stages: Stage[];
}

export interface UploadedFileInfo {
  fileName: string;
  selectedAt: string;
}

export interface ActivityProgress {
  role: 'leader' | 'member' | null;
  currentStageIndex: number;
  currentStepIndex: number;
  visitedStageIds: string[];
  completedStageIds: string[];
  answers: Record<string, string>;
  uploadedFiles: Record<string, UploadedFileInfo>;
  updatedAt: string;
  started: boolean;
  finished: boolean;
}

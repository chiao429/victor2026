export type StageStepType =
  | 'story'
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
  content?: string;
  leaderScript?: string;
  imageUrl?: string;
  videoUrl?: string;
  question?: string;
  placeholder?: string;
  required?: boolean;
}

export interface Stage {
  id: string;
  title: string;
  description: string;
  location: string;
  durationMinutes: number;
  mapImageUrl: string;
  summary: string;
  steps: StageStep[];
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
  currentStageIndex: number;
  currentStepIndex: number;
  completedStageIds: string[];
  answers: Record<string, string>;
  uploadedFiles: Record<string, UploadedFileInfo>;
  updatedAt: string;
  started: boolean;
  finished: boolean;
}

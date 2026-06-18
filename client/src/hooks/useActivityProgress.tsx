import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ActivityProgress, UploadedFileInfo } from '../types/activity';
import { createInitialProgress, loadProgress, STORAGE_KEY } from '../utils/progress';

interface ProgressContextValue {
  progress: ActivityProgress;
  start: () => void;
  setRole: (role: 'leader' | 'member') => void;
  setPosition: (stageIndex: number, stepIndex: number, stageId: string) => void;
  saveAnswer: (key: string, value: string) => void;
  saveUpload: (key: string, value: UploadedFileInfo) => void;
  markStageComplete: (stageId: string, stageIndex: number, totalStages: number) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ActivityProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ActivityProgress>(() => loadProgress());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const patch = useCallback((next: Partial<ActivityProgress>) => {
    setProgress((current) => ({ ...current, ...next, updatedAt: new Date().toISOString() }));
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      start: () => patch({ started: true }),
      setRole: (role) => patch({ role, started: true }),
      setPosition: (currentStageIndex, currentStepIndex, stageId) =>
        setProgress((current) => {
          return {
            ...current,
            currentStageIndex,
            currentStepIndex,
            visitedStageIds: [...new Set([...current.visitedStageIds, stageId])],
            started: true,
            updatedAt: new Date().toISOString(),
          };
        }),
      saveAnswer: (key, answer) =>
        setProgress((current) => ({
          ...current,
          answers: { ...current.answers, [key]: answer },
          updatedAt: new Date().toISOString(),
        })),
      saveUpload: (key, upload) =>
        setProgress((current) => ({
          ...current,
          uploadedFiles: { ...current.uploadedFiles, [key]: upload },
          updatedAt: new Date().toISOString(),
        })),
      markStageComplete: (stageId, stageIndex, totalStages) =>
        setProgress((current) => {
          const completedStageIds = [...new Set([...current.completedStageIds, stageId])];
          return {
            ...current,
            visitedStageIds: [...new Set([...current.visitedStageIds, stageId])],
            completedStageIds,
            currentStageIndex: stageIndex,
            currentStepIndex: 0,
            finished: completedStageIds.length === totalStages,
            updatedAt: new Date().toISOString(),
          };
        }),
      reset: () => setProgress(createInitialProgress()),
    }),
    [patch, progress],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useActivityProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useActivityProgress 必須在 ActivityProgressProvider 內使用');
  return value;
}

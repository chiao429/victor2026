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
  setPosition: (stageIndex: number, stepIndex: number) => void;
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
      setPosition: (currentStageIndex, currentStepIndex) =>
        patch({ currentStageIndex, currentStepIndex, started: true }),
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
          const isLast = stageIndex === totalStages - 1;
          return {
            ...current,
            completedStageIds: [...new Set([...current.completedStageIds, stageId])],
            currentStageIndex: isLast ? stageIndex : stageIndex + 1,
            currentStepIndex: 0,
            finished: isLast,
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

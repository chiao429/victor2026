import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ActivityProgress, StageStep } from '../types/activity';
import { createInitialProgress } from '../utils/progress';
import { StepContent } from './StepContent';

const step: StageStep = {
  id: 'leader-copy',
  type: 'text',
  title: '停下來想一想',
  content: '所有人都能看到的內容',
  leaderScript: '只有小隊長能看到的提示',
};

afterEach(cleanup);

function renderStep(isLeader: boolean) {
  return render(
    <StepContent
      stageId="not-data"
      step={step}
      progress={createInitialProgress() as ActivityProgress}
      onAnswer={vi.fn()}
      onUpload={vi.fn()}
      isLeader={isLeader}
    />,
  );
}

describe('StepContent role visibility', () => {
  it('shows leader prompts to leaders', () => {
    const view = renderStep(true);
    expect(view.getByText('只有小隊長能看到的提示')).toBeInTheDocument();
  });

  it('hides leader prompts from members', () => {
    const view = renderStep(false);
    expect(view.getByText('所有人都能看到的內容')).toBeInTheDocument();
    expect(view.queryByText('只有小隊長能看到的提示')).not.toBeInTheDocument();
    expect(view.queryByText('小隊長指引')).not.toBeInTheDocument();
  });
});

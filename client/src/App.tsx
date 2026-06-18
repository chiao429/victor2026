import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ActivityProgressProvider } from './hooks/useActivityProgress';
import { HomePage } from './pages/HomePage';
import { StoryPage } from './pages/StoryPage';
import { InstructionsPage } from './pages/InstructionsPage';
import { StageIntroPage } from './pages/StageIntroPage';
import { StageStepPage } from './pages/StageStepPage';
import { StageCompletePage } from './pages/StageCompletePage';
import { CompletePage } from './pages/CompletePage';
import { ErrorPage } from './pages/ErrorPage';

export default function App() {
  return (
    <BrowserRouter>
      <ActivityProgressProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/instructions" element={<InstructionsPage />} />
          <Route path="/stages/:stageId" element={<StageIntroPage />} />
          <Route path="/stages/:stageId/steps/:stepIndex" element={<StageStepPage />} />
          <Route path="/stages/:stageId/complete" element={<StageCompletePage />} />
          <Route path="/complete" element={<CompletePage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ActivityProgressProvider>
    </BrowserRouter>
  );
}

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
import { StageSelectPage } from './pages/StageSelectPage';
import { IdentityPage } from './pages/IdentityPage';
import { ReaderLetterPage } from './pages/ReaderLetterPage';
import { RequireIdentity } from './components/RequireIdentity';
import { RequireTeam } from './components/RequireTeam';

export default function App() {
  return (
    <BrowserRouter>
      <ActivityProgressProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/reader-letter" element={<ReaderLetterPage />} />
          <Route path="/identity" element={<IdentityPage />} />
          <Route element={<RequireIdentity />}>
            <Route path="/instructions" element={<InstructionsPage />} />
            <Route element={<RequireTeam />}>
              <Route path="/stages" element={<StageSelectPage />} />
              <Route path="/stages/:stageId" element={<StageIntroPage />} />
              <Route path="/stages/:stageId/steps/:stepIndex" element={<StageStepPage />} />
              <Route path="/stages/:stageId/complete" element={<StageCompletePage />} />
              <Route path="/complete" element={<CompletePage />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </ActivityProgressProvider>
    </BrowserRouter>
  );
}

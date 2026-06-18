import type { ReactNode } from 'react';

export function Layout({
  children,
  eyebrow,
  progress,
}: {
  children: ReactNode;
  eyebrow?: string;
  progress?: number;
}) {
  return (
    <main className="app-shell">
      <div className="paper-grain" aria-hidden="true" />
      <header className="topbar">
        <span className="brand-mark">V</span>
        <div>
          <p>VICTOR 2026</p>
          <small>少年日記</small>
        </div>
      </header>
      {progress !== undefined && (
        <div className="progress-track" aria-label={`活動進度 ${Math.round(progress)}%`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
      <section className="page">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {children}
      </section>
    </main>
  );
}

export function BottomActions({ children }: { children: ReactNode }) {
  return <nav className="bottom-actions">{children}</nav>;
}

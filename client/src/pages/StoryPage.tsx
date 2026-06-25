import { useRef, useState, type KeyboardEvent, type UIEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import activityData from '../data/activity.json';
import type { ActivityConfig } from '../types/activity';
import { BottomActions, Layout } from '../components/Layout';

const activity = activityData as ActivityConfig;

export function StoryPage() {
  const navigate = useNavigate();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const currentEntryRef = useRef(0);
  const [currentEntry, setCurrentEntry] = useState(0);
  const lastEntry = activity.diaryEntries.length - 1;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setVisibleEntry = (index: number) => {
    if (index === currentEntryRef.current) return;
    currentEntryRef.current = index;
    setCurrentEntry(index);
    scrollToTop();
  };

  const goToEntry = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, lastEntry));
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const page = scroller.querySelector<HTMLElement>(`[data-entry-index="${nextIndex}"]`);
    scroller.scrollTo({ left: page?.offsetLeft ?? 0, behavior: 'smooth' });
    setVisibleEntry(nextIndex);
  };

  const updateCurrentEntry = (event: UIEvent<HTMLDivElement>) => {
    const scroller = event.currentTarget;
    const pageWidth = scroller.scrollWidth / activity.diaryEntries.length;
    setVisibleEntry(Math.max(0, Math.min(Math.round(scroller.scrollLeft / pageWidth), lastEntry)));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToEntry(currentEntry - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToEntry(currentEntry + 1);
    }
  };

  return (
    <Layout eyebrow="THE DIARY · 少年的日記">
      <div className="story-heading">
        <div>
          <h1 className="display-title">藏在心底的秘密</h1>
          <p className="diary-swipe-hint">左右滑動，讀完這五篇日記</p>
        </div>
        <span aria-live="polite">{currentEntry + 1} / {activity.diaryEntries.length}</span>
      </div>
      <div
        ref={scrollerRef}
        className="diary-carousel"
        aria-label="少年的五篇日記"
        tabIndex={0}
        onScroll={updateCurrentEntry}
        onKeyDown={handleKeyDown}
      >
        {activity.diaryEntries.map((entry, index) => (
          <article
            className="diary-page diary-entry"
            data-entry-index={index}
            aria-label={`日記 ${entry.date}，第 ${index + 1} 篇，共 ${activity.diaryEntries.length} 篇`}
            key={entry.date}
          >
            <header>
              <span>DIARY ENTRY</span>
              <p className="handwritten-date">日記：{entry.date}</p>
            </header>
            <div className="diary-entry-copy">
              {entry.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <footer>{String(index + 1).padStart(2, '0')}</footer>
          </article>
        ))}
      </div>
      <div className="diary-pagination" aria-label="日記頁面選擇">
        {activity.diaryEntries.map((entry, index) => (
          <button
            type="button"
            className={index === currentEntry ? 'active' : ''}
            aria-label={`前往 ${entry.date} 的日記`}
            aria-current={index === currentEntry ? 'page' : undefined}
            onClick={() => goToEntry(index)}
            key={entry.date}
          />
        ))}
      </div>
      <BottomActions>
        <div className="diary-bottom-actions">
          <div className="diary-nav-actions">
            <button
              className="button button-ghost"
              disabled={currentEntry === 0}
              onClick={() => goToEntry(currentEntry - 1)}
            >
              <span>←</span> 上一篇
            </button>
            <button
              className="button button-ghost"
              disabled={currentEntry === lastEntry}
              onClick={() => goToEntry(currentEntry + 1)}
            >
              下一篇 <span>→</span>
            </button>
          </div>
          <div className="diary-start-actions">
            <button className="button button-ghost" onClick={() => navigate('/')}>
              重新開始
            </button>
            <button className="button button-primary" onClick={() => navigate('/reader-letter')}>
              開始體驗 <span>→</span>
            </button>
          </div>
        </div>
      </BottomActions>
    </Layout>
  );
}

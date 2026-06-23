import { useEffect, useState, type TouchEvent } from 'react';
import { useActivityProgress } from '../hooks/useActivityProgress';

const FLOOR_MAPS = [
  { label: '1F', src: '/maps/1F.png' },
  { label: '2F', src: '/maps/2F.png' },
  { label: '3F', src: '/maps/3F.png' },
];

export function LeaderMapButton() {
  const { progress } = useActivityProgress();
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
      if (event.key === 'ArrowLeft') showPrevious();
      if (event.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  if (progress.role !== 'leader') return null;

  const showPrevious = () => {
    setCurrentIndex((index) => (index === 0 ? FLOOR_MAPS.length - 1 : index - 1));
  };
  const showNext = () => {
    setCurrentIndex((index) => (index === FLOOR_MAPS.length - 1 ? 0 : index + 1));
  };
  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;

    const diff = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 44) {
      if (diff > 0) showPrevious();
      else showNext();
    }
    setTouchStartX(null);
  };
  const currentMap = FLOOR_MAPS[currentIndex];

  return (
    <>
      <button
        type="button"
        className="map-icon-button"
        aria-label="開啟樓層地圖"
        onClick={() => setIsOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
          <path d="M9 3v15M15 6v15" />
        </svg>
      </button>
      {isOpen && (
        <div className="map-modal-backdrop" role="presentation" onClick={() => setIsOpen(false)}>
          <section
            className="map-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="map-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="map-modal-header">
              <div>
                <span>MAP · 樓層地圖</span>
                <h2 id="map-modal-title">教室關卡位置</h2>
              </div>
              <button
                type="button"
                className="map-close-button"
                aria-label="關閉地圖"
                onClick={() => setIsOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="map-legend">
              <img src="/maps/stage.png" alt="" />
              <span>教室關卡位置</span>
            </div>
            <p className="map-warning">非闖關區域請勿任意進入！</p>
            <div
              className="map-carousel"
              onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
              onTouchEnd={handleTouchEnd}
            >
              <button type="button" className="map-nav previous" aria-label="上一張地圖" onClick={showPrevious}>
                ‹
              </button>
              <img src={currentMap.src} alt={`${currentMap.label} 樓層地圖`} />
              <button type="button" className="map-nav next" aria-label="下一張地圖" onClick={showNext}>
                ›
              </button>
            </div>
            <div className="map-carousel-footer">
              <strong>{currentMap.label}</strong>
              <div className="map-floor-buttons" aria-label={`目前顯示 ${currentMap.label}`}>
                {FLOOR_MAPS.map((map, index) => (
                  <button
                    type="button"
                    key={map.label}
                    className={index === currentIndex ? 'active' : ''}
                    aria-label={`顯示 ${map.label} 地圖`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    {map.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

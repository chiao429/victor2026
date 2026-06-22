import type { CharacterCardData } from '../types/activity';

export function CharacterCard({ card }: { card: CharacterCardData }) {
  const totalScore = card.scores.reduce((total, item) => total + item.score, 0);
  const maximumScore = card.scores.length * 5;

  return (
    <section className="character-card" aria-labelledby="character-card-title">
      <div className="character-card-header">
        <div className="character-avatar" aria-hidden="true">?</div>
        <div>
          <h2 id="character-card-title">少年的評分卡</h2>
          <p className="character-total">總分 <strong>{totalScore}</strong> / {maximumScore}</p>
        </div>
      </div>
      <div className="score-legend">
        <span><strong>1 分</strong> 很沒有安全感</span>
        <span><strong>5 分</strong> 很有自信</span>
      </div>
      <div className="character-scores">
        {card.scores.map(({ label, score }) => (
          <div className="character-score" key={label}>
            <div>
              <span>{label}</span>
              <strong>{score}<small>/5</small></strong>
            </div>
            <div
              className="score-track"
              role="meter"
              aria-label={`${label}評分`}
              aria-valuemin={1}
              aria-valuemax={5}
              aria-valuenow={score}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <span className={index < score ? 'filled' : ''} key={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="character-card-note">這些分數看起來很完整，但它們真的足以代表一個人嗎？</p>
    </section>
  );
}

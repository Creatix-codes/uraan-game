import type { CSSProperties } from 'react';
import { Icon } from '../components/Icon';
import { IconButton, PaintedButton } from '../components/Buttons';
import { HeartRow, StarRating } from '../components/Ornaments';
import { LevelIllustration } from '../components/LevelIllustration';
import { getLevel, TOTAL_LEVELS } from '../data/levels';
import type { LevelConfig } from '../types';
import type { RunResult } from '../game/engine';

interface VictoryScreenProps {
  level: LevelConfig;
  result: RunResult;
  isNewBest: boolean;
  newlyUnlocked: boolean;
  onContinue: () => void;
  onReplay: () => void;
  onMap: () => void;
}

const CONFETTI_COLORS = ['#f6c453', '#e75b54', '#fdf3d8', '#6ec3b1', '#e27d9a', '#ffffff'];

export function VictoryScreen({
  level,
  result,
  isNewBest,
  newlyUnlocked,
  onContinue,
  onReplay,
  onMap,
}: VictoryScreenProps) {
  const nextLevel = result.levelId < TOTAL_LEVELS ? getLevel(result.levelId + 1) : null;
  const isFinale = !nextLevel;
  const theme = {
    '--victory-sky': level.palette.skyTop,
    '--victory-horizon': level.palette.skyBottom,
    '--victory-accent': level.palette.accent,
    '--victory-soft': level.palette.accentSoft,
    '--victory-ink': level.palette.ink,
    '--victory-paper': level.palette.haze,
  } as CSSProperties;

  return (
    <section className="screen screen--victory" style={theme} aria-label={`${level.city} completed`}>
      <div className="victory-sky" aria-hidden="true">
        <span className="victory-sky__sun" />
        <span className="victory-sky__cloud victory-sky__cloud--one" />
        <span className="victory-sky__cloud victory-sky__cloud--two" />
        <span className="victory-sky__ridge" />
      </div>
      <div className="victory-confetti" aria-hidden="true">
        {Array.from({ length: 26 }, (_, index) => (
          <span
            key={index}
            style={{
              left: `${(index * 37) % 100}%`,
              animationDelay: `${(index % 8) * 0.32}s`,
              animationDuration: `${3.6 + (index % 5) * 0.55}s`,
              background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
              width: index % 3 === 0 ? '7px' : '5px',
              height: index % 4 === 0 ? '11px' : '6px',
              transform: `rotate(${index * 29}deg)`,
            }}
          />
        ))}
      </div>

      <header className="victory-top">
        <IconButton icon="map" label="Back to the flight map" variant="cream" size="sm" onClick={onMap} />
        <span className="victory-top__title">Postcard delivered</span>
        <span className="victory-top__medals" aria-label={`${result.rating} of 3 stars`}>
          <Icon name="star" size={17} strokeWidth={1.8} />
          <strong>{result.rating}</strong>
        </span>
      </header>

      <div className="victory-scroll">
        <div className="victory-heading">
          <span className="victory-heading__eyebrow">
            Stop {String(level.id).padStart(2, '0')} of {TOTAL_LEVELS} · {level.region}
          </span>
          <h1>
            Touchdown in <span>{level.city}</span>
          </h1>
          <p>{level.tagline}</p>
        </div>

        <article className="winner-postcard">
          <div className="winner-postcard__art">
            <LevelIllustration level={level} />
            <div className="winner-postcard__stamp" aria-hidden="true">
              <span className="winner-postcard__stamp-country">PAKISTAN</span>
              <Icon name="star" size={17} strokeWidth={1.6} />
              <span className="winner-postcard__stamp-value">POST</span>
            </div>
            <div className="winner-postcard__postmark" aria-hidden="true">
              <span>URAAN POST</span>
              <span>{level.city.toUpperCase()}</span>
              <span>DELIVERED</span>
            </div>
            <div className="winner-postcard__complete" aria-hidden="true">
              <span className="winner-postcard__complete-top">MISSION</span>
              <span className="winner-postcard__complete-mid">
                <Icon name="check" size={17} strokeWidth={2.7} />
              </span>
              <span className="winner-postcard__complete-bottom">COMPLETE</span>
            </div>
          </div>

          <div className="winner-postcard__body">
            <div className="winner-postcard__meta">
              <span>Postcard No. {String(level.id).padStart(2, '0')}</span>
              <span>{level.region}</span>
            </div>
            <h2>{level.city}</h2>
            <p className="winner-postcard__landmark">
              <Icon name="flag" size={13} strokeWidth={2} />
              {level.landmark}
            </p>
            <p className="winner-postcard__note">{level.foodieNote}</p>
            <div className="winner-postcard__rating">
              <StarRating value={result.rating} size={20} animate />
              <span>{result.starsCollected} golden stars collected</span>
            </div>
          </div>
        </article>

        <div className="victory-scoreboard">
          <div className="victory-score">
            <span>Score</span>
            <strong>{result.score}</strong>
            {isNewBest ? <em>New best</em> : <small>Personal best kept</small>}
          </div>
          <span className="victory-scoreboard__split" aria-hidden="true" />
          <div className="victory-score">
            <span>Distance</span>
            <strong>{result.distance} m</strong>
            <small>Route complete</small>
          </div>
          <span className="victory-scoreboard__split" aria-hidden="true" />
          <div className="victory-score">
            <span>Hearts kept</span>
            <HeartRow hearts={result.heartsLeft} size={17} />
            <small>{result.heartsLeft === 3 ? 'Flawless flight' : 'Well flown'}</small>
          </div>
        </div>

        {nextLevel ? (
          <div className={`next-route ${newlyUnlocked ? 'is-new' : ''}`}>
            <span className="next-route__icon" aria-hidden="true">
              <Icon name="compass" size={21} strokeWidth={1.8} />
            </span>
            <span className="next-route__copy">
              <small>{newlyUnlocked ? 'New route unlocked' : 'Next destination'}</small>
              <strong>
                {nextLevel.city} · {nextLevel.region}
              </strong>
            </span>
            <Icon name="arrow-right" size={19} strokeWidth={2} />
          </div>
        ) : (
          <div className="next-route next-route--finale">
            <span className="next-route__icon" aria-hidden="true">
              <Icon name="trophy" size={21} strokeWidth={1.8} />
            </span>
            <span className="next-route__copy">
              <small>All {TOTAL_LEVELS} postcards collected</small>
              <strong>The whole journey is yours.</strong>
            </span>
            <Icon name="star" size={19} strokeWidth={1.8} />
          </div>
        )}

        <div className="victory-actions">
          <PaintedButton
            size="lg"
            fullWidth
            trailingIcon={isFinale ? 'map' : 'arrow-right'}
            onClick={onContinue}
          >
            {nextLevel ? `Fly to ${nextLevel.city}` : 'Return to the flight map'}
          </PaintedButton>
          <div className="victory-actions__row">
            <PaintedButton variant="secondary" size="md" icon="restart" onClick={onReplay}>
              Fly again
            </PaintedButton>
            <PaintedButton variant="secondary" size="md" icon="map" onClick={onMap}>
              Flight map
            </PaintedButton>
          </div>
        </div>

        <p className="victory-footnote">
          <Icon name="postcard" size={14} strokeWidth={1.8} />
          Postcard {String(level.id).padStart(2, '0')} added to your album
        </p>
      </div>
    </section>
  );
}

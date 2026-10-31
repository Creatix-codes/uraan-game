import { useState } from 'react';
import { Icon } from '../components/Icon';
import { IconButton, PaintedButton } from '../components/Buttons';
import { LevelIllustration } from '../components/LevelIllustration';
import { MapArt } from '../components/MapArt';
import { StarRating } from '../components/Ornaments';
import { LEVELS, getLevel, TOTAL_LEVELS } from '../data/levels';
import {
  getCompletedCount,
  getContinueLevelId,
  getStarsForLevel,
  getTotalStars,
  isLevelUnlocked,
} from '../data/progress';
import type { ProgressState } from '../types';

interface MapScreenProps {
  progress: ProgressState;
  onBack: () => void;
  onPlay: (levelId: number) => void;
  onSettings: () => void;
  onPostcards: () => void;
}

export function MapScreen({ progress, onBack, onPlay, onSettings, onPostcards }: MapScreenProps) {
  const [selectedId, setSelectedId] = useState(() => getContinueLevelId(progress));
  const selected = getLevel(selectedId);
  const selectedSaved = progress.levels[String(selected.id)];
  const selectedUnlocked = isLevelUnlocked(progress, selected.id);
  const completed = getCompletedCount(progress);
  const stars = getTotalStars(progress);
  const nextId = getContinueLevelId(progress);
  const nextLevel = getLevel(nextId);
  const allComplete = completed >= TOTAL_LEVELS;
  const previousLevel = selected.id > 1 ? getLevel(selected.id - 1) : null;

  return (
    <section className="screen screen--map" aria-label="Flight map">
      <header className="screen-head">
        <IconButton icon="arrow-left" label="Back to home" variant="cream" size="sm" onClick={onBack} />
        <div className="screen-head__title">
          <span>{TOTAL_LEVELS} postcards await</span>
          <h1>The Flight Map</h1>
        </div>
        <div className="screen-head__actions">
          <IconButton
            icon="postcard"
            label={`Postcard album, ${completed} of ${TOTAL_LEVELS} collected`}
            variant="cream"
            size="sm"
            onClick={onPostcards}
          />
          <IconButton icon="settings" label="Open settings" variant="cream" size="sm" onClick={onSettings} />
        </div>
      </header>

      <div className="map-scroll">
        <div className="map-summary">
          <div className="map-summary__item">
            <span className="map-summary__icon map-summary__icon--gold" aria-hidden="true">
              <Icon name="star" size={15} strokeWidth={1.8} />
            </span>
            <span>
              <strong>{stars}</strong>
              <small>of {TOTAL_LEVELS * 3} stars</small>
            </span>
          </div>
          <span className="map-summary__split" aria-hidden="true" />
          <div className="map-summary__item">
            <span className="map-summary__icon" aria-hidden="true">
              <Icon name="flag" size={15} strokeWidth={1.8} />
            </span>
            <span>
              <strong>{completed}</strong>
              <small>of {TOTAL_LEVELS} postcards</small>
            </span>
          </div>
          <span className="map-summary__split" aria-hidden="true" />
          <div className="map-summary__item map-summary__item--next">
            <span>
              <small>Next stop</small>
              <strong>{allComplete ? 'Journey complete' : nextLevel.city}</strong>
            </span>
          </div>
        </div>

        <div className="map-board">
          <MapArt />
          <div className="map-board__tape" aria-hidden="true">
            <span>THE POSTCARD ROUTE</span>
          </div>
          {LEVELS.map((level) => {
            const saved = progress.levels[String(level.id)];
            const complete = saved?.completed ?? false;
            const unlocked = isLevelUnlocked(progress, level.id);
            const isCurrent = level.id === nextId && !complete;
            const selectedNode = level.id === selected.id;
            const side =
              level.map.x > 62 ? 'left' : level.map.x < 34 ? 'right' : level.labelSide;
            const bestStars = getStarsForLevel(progress, level.id);
            const stateLabel = !unlocked
              ? 'locked'
              : complete
                ? `completed, ${bestStars} of 3 stars`
                : isCurrent
                  ? 'next stop'
                  : 'ready to fly';

            return (
              <button
                key={level.id}
                type="button"
                className={[
                  'map-node',
                  `map-node--${side}`,
                  unlocked ? 'is-unlocked' : 'is-locked',
                  complete ? 'is-complete' : '',
                  isCurrent ? 'is-current' : '',
                  selectedNode ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ left: `${level.map.x}%`, top: `${level.map.y}%` }}
                onClick={() => setSelectedId(level.id)}
                aria-label={`Level ${level.id}, ${level.city}, ${stateLabel}`}
                aria-pressed={selectedNode}
              >
                <span className="map-node__halo" aria-hidden="true" />
                <span className="map-node__pin" aria-hidden="true">
                  <span>{String(level.id).padStart(2, '0')}</span>
                </span>
                {complete ? (
                  <span className="map-node__badge map-node__badge--check" aria-hidden="true">
                    <Icon name="check" size={10} strokeWidth={3} />
                  </span>
                ) : null}
                {!unlocked ? (
                  <span className="map-node__badge map-node__badge--lock" aria-hidden="true">
                    <Icon name="lock" size={9} strokeWidth={2.4} />
                  </span>
                ) : null}
                <span className="map-node__label">
                  <strong>{level.city}</strong>
                  {complete ? (
                    <span className="map-node__pips" aria-hidden="true">
                      {[0, 1, 2].map((index) => (
                        <span key={index} className={index < bestStars ? 'is-filled' : ''} />
                      ))}
                    </span>
                  ) : (
                    <small>{!unlocked ? 'Locked' : isCurrent ? 'Next stop' : 'Ready'}</small>
                  )}
                </span>
              </button>
            );
          })}
          <div className="map-board__legend" aria-hidden="true">
            <span className="map-board__legend-dot" />
            <span>Flight route</span>
          </div>
        </div>

        <article
          className={`map-detail ${selectedUnlocked ? '' : 'map-detail--locked'}`}
          style={{ '--detail-accent': selected.palette.accent } as React.CSSProperties}
        >
          <div className="map-detail__art">
            <LevelIllustration level={selected} />
            <span className="map-detail__number">
              {String(selected.id).padStart(2, '0')}
            </span>
            {!selectedUnlocked ? (
              <span className="map-detail__lock" aria-hidden="true">
                <Icon name="lock" size={16} strokeWidth={2} />
              </span>
            ) : null}
          </div>
          <div className="map-detail__copy">
            <div className="map-detail__eyebrow">
              <span>{selected.region}</span>
              {selectedSaved?.completed ? (
                <span className="map-detail__status">
                  <Icon name="check" size={11} strokeWidth={2.6} /> Explored
                </span>
              ) : (
                <span className="map-detail__status map-detail__status--quiet">
                  {selectedUnlocked ? 'Ready to fly' : 'Route locked'}
                </span>
              )}
            </div>
            <h2>{selected.city}</h2>
            <p className="map-detail__tagline">{selected.tagline}</p>
            <p className="map-detail__landmark">
              <Icon name="flag" size={13} strokeWidth={1.9} />
              {selected.landmark}
            </p>
            {selectedSaved?.completed ? (
              <div className="map-detail__score">
                <StarRating value={selectedSaved.bestStars} size={16} />
                <span>
                  Best score <strong>{selectedSaved.bestScore}</strong>
                </span>
              </div>
            ) : !selectedUnlocked ? (
              <p className="map-detail__hint">
                Complete {previousLevel?.city ?? 'the previous route'} to unlock this postcard.
              </p>
            ) : (
              <p className="map-detail__hint">
                Golden goal: collect {selected.starGoals[1]} stars for a three-star flight.
              </p>
            )}
          </div>
          <div className="map-detail__action">
            <PaintedButton
              variant={selectedUnlocked ? 'primary' : 'secondary'}
              size="md"
              fullWidth
              icon={selectedUnlocked ? 'play' : 'lock'}
              disabled={!selectedUnlocked}
              onClick={() => selectedUnlocked && onPlay(selected.id)}
            >
              {!selectedUnlocked
                ? `Finish ${previousLevel?.city ?? 'the previous route'} first`
                : selectedSaved?.completed
                  ? `Fly to ${selected.city} again`
                  : `Fly to ${selected.city}`}
            </PaintedButton>
          </div>
        </article>

        <p className="map-footnote">
          <Icon name="compass" size={14} strokeWidth={1.8} />
          Choose any unlocked pin to revisit its postcard.
        </p>
      </div>
    </section>
  );
}

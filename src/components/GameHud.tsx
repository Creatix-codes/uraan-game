import { memo } from 'react';
import type { HudState } from '../game/engine';
import type { LevelConfig } from '../types';
import { Icon } from './Icon';
import { IconButton } from './Buttons';
import { HeartRow } from './Ornaments';

interface GameHudProps {
  hud: HudState;
  level: LevelConfig;
  arrived: boolean;
  paused: boolean;
  onPause: () => void;
}

function areGameHudPropsEqual(prev: GameHudProps, next: GameHudProps): boolean {
  return (
    prev.hud.phase === next.hud.phase &&
    prev.hud.progress === next.hud.progress &&
    prev.hud.hearts === next.hud.hearts &&
    prev.hud.stars === next.hud.stars &&
    prev.hud.distance === next.hud.distance &&
    prev.arrived === next.arrived &&
    prev.paused === next.paused &&
    prev.level.id === next.level.id
  );
}

function GameHudImpl({ hud, level, arrived, paused, onPause }: GameHudProps) {
  const phase = hud.phase;

  return (
    <div className="game-hud" data-ui="true">
      <div className="game-hud__top">
        <IconButton
          icon="pause"
          label="Pause the flight"
          variant="cream"
          size="sm"
          onClick={onPause}
          disabled={phase !== 'playing' || paused || arrived}
        />
        <div className="game-hud__level">
          <span className="game-hud__level-number">{String(level.id).padStart(2, '0')}</span>
          <span className="game-hud__level-copy">
            <strong>{level.city}</strong>
            <small>{level.region}</small>
          </span>
        </div>
        <div className="game-hud__hearts">
          <HeartRow hearts={hud.hearts} size={19} />
        </div>
      </div>

      <div className="game-hud__journey">
        <div className="journey-heading">
          <span>
            <Icon name="flag" size={12} strokeWidth={2} />
            {Math.min(hud.distance, level.lengthMeters)} / {level.lengthMeters} m
          </span>
          <span className="journey-stars">
            <span className="journey-stars__star" aria-hidden="true">
              <Icon name="star" size={12} strokeWidth={2.2} />
            </span>
            {hud.stars} stars
            <span className="journey-score">{hud.distance + hud.stars * 35} pts</span>
          </span>
        </div>
        <div
          className="journey-track"
          role="progressbar"
          aria-label="Flight progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(hud.progress * 100)}
        >
          <span className="journey-track__fill" style={{ width: `${Math.max(2, hud.progress * 100)}%` }} />
          <span
            className="journey-track__marker"
            style={{ left: `${Math.max(2, hud.progress * 100)}%` }}
            aria-hidden="true"
          >
            <Icon name="wind" size={11} strokeWidth={2.4} />
          </span>
          <span className="journey-track__post" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export const GameHud = memo(GameHudImpl, areGameHudPropsEqual);

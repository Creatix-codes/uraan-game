import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { audio } from '../audio/audioManager';
import { Icon } from '../components/Icon';
import { IconButton, PaintedButton } from '../components/Buttons';
import { HeartRow, StarRating } from '../components/Ornaments';
import { GameEngine } from '../game/engine';
import type { EnginePhase, HudState, RunResult } from '../game/engine';
import type { LevelConfig } from '../types';

interface GameScreenProps {
  level: LevelConfig;
  tutorialSeen: boolean;
  onVictory: (result: RunResult) => void;
  onExit: () => void;
  onTutorialSeen: () => void;
  onAttempt: () => void;
}

const READY_HUD: HudState = {
  progress: 0,
  hearts: 3,
  stars: 0,
  distance: 0,
  phase: 'ready',
};

interface CallbackBundle {
  onVictory: (result: RunResult) => void;
  onExit: () => void;
  onTutorialSeen: () => void;
  onAttempt: () => void;
}

export function GameScreen({
  level,
  tutorialSeen,
  onVictory,
  onExit,
  onTutorialSeen,
  onAttempt,
}: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const timersRef = useRef<number[]>([]);
  const attemptStarted = useRef(false);
  const callbacksRef = useRef<CallbackBundle>({
    onVictory,
    onExit,
    onTutorialSeen,
    onAttempt,
  });

  const [hud, setHud] = useState<HudState>(READY_HUD);
  const [tutorialOpen, setTutorialOpen] = useState(!tutorialSeen);
  const [paused, setPaused] = useState(false);
  const [defeatOpen, setDefeatOpen] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [finalResult, setFinalResult] = useState<RunResult | null>(null);
  const [fatalError, setFatalError] = useState(false);

  callbacksRef.current = { onVictory, onExit, onTutorialSeen, onAttempt };

  const clearTimers = () => {
    for (const id of timersRef.current) window.clearTimeout(id);
    timersRef.current = [];
  };

  const schedule = (callback: () => void, delay: number) => {
    const id = window.setTimeout(callback, delay);
    timersRef.current.push(id);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    let engine: GameEngine;
    try {
      engine = new GameEngine(canvas, level, {
        onHud: (nextHud: HudState) => setHud(nextHud),
        onFlap: () => audio.flap(),
        onStar: () => audio.star(),
        onHeartLost: () => audio.hit(),
        onVictory: (result: RunResult) => {
          setFinalResult(result);
          setArrived(true);
          setPaused(false);
          audio.victory();
          schedule(() => callbacksRef.current.onVictory(result), 1450);
        },
        onDefeat: () => {
          audio.lose();
          schedule(() => setDefeatOpen(true), 680);
        },
      });
    } catch {
      setFatalError(true);
      return;
    }

    engineRef.current = engine;
    attemptStarted.current = false;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) engine.resize(width, height);
    });
    observer.observe(stage);

    const handleVisibility = () => {
      if (!document.hidden) return;
      if (engine.getPhase() === 'playing') {
        engine.pause();
        setPaused(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      engine.destroy();
      if (engineRef.current === engine) engineRef.current = null;
      clearTimers();
    };
    // The engine is intentionally rebuilt only when the destination changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id]);

  const beginFlight = () => {
    const engine = engineRef.current;
    if (!engine || engine.getPhase() !== 'ready') return;
    if (tutorialOpen) {
      setTutorialOpen(false);
      callbacksRef.current.onTutorialSeen();
    }
    engine.flap();
    if (!attemptStarted.current) {
      attemptStarted.current = true;
      callbacksRef.current.onAttempt();
    }
  };

  const handleStagePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('button, a, [data-ui]')) return;
    if (paused || defeatOpen || arrived || fatalError) return;
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.getPhase() === 'ready') beginFlight();
    else if (engine.getPhase() === 'playing') engine.flap();
  };

  const pauseGame = () => {
    const engine = engineRef.current;
    if (!engine || engine.getPhase() !== 'playing') return;
    engine.pause();
    setPaused(true);
  };

  const resumeGame = () => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.resume();
    setPaused(false);
  };

  const restartGame = () => {
    clearTimers();
    setPaused(false);
    setDefeatOpen(false);
    setArrived(false);
    setFinalResult(null);
    setHud(READY_HUD);
    attemptStarted.current = false;
    const engine = engineRef.current;
    if (!engine) return;
    engine.restart(true);
    audio.start();
    if (!attemptStarted.current) {
      attemptStarted.current = true;
      callbacksRef.current.onAttempt();
    }
  };

  const leaveGame = () => {
    callbacksRef.current.onExit();
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, a, input, textarea, select, [contenteditable="true"]')) return;

      if (event.code === 'Space' || event.code === 'ArrowUp') {
        if (paused || defeatOpen || arrived || fatalError) return;
        event.preventDefault();
        if (event.repeat) return;
        const engine = engineRef.current;
        if (!engine) return;
        if (engine.getPhase() === 'ready') beginFlight();
        else if (engine.getPhase() === 'playing') engine.flap();
        return;
      }

      if (event.code === 'Escape') {
        if (paused) {
          event.preventDefault();
          resumeGame();
        } else if (!defeatOpen && !arrived && !fatalError) {
          event.preventDefault();
          pauseGame();
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, defeatOpen, arrived, tutorialOpen, fatalError]);

  const phase: EnginePhase = hud.phase;
  const liveScore = hud.distance + hud.stars * 35;
  const readyVisible = phase === 'ready' && !paused && !defeatOpen && !arrived && !fatalError;
  const playingHint = phase === 'playing' && !paused;

  return (
    <section
      className="screen screen--game"
      aria-label={`Flying over ${level.city}. Tap, click, Space or Arrow Up to flap.`}
    >
      <div className="game-stage" ref={stageRef} onPointerDown={handleStagePointer}>
        <canvas
          ref={canvasRef}
          className="game-canvas"
          aria-label={`${level.city} flight. Tap or press Space to flap and avoid the painted towers.`}
        />
        <div className="game-shade game-shade--top" aria-hidden="true" />
        <div className="game-shade game-shade--bottom" aria-hidden="true" />

        <div className="game-hud" data-ui="true">
          <div className="game-hud__top">
            <IconButton
              icon="pause"
              label="Pause the flight"
              variant="cream"
              size="sm"
              onClick={pauseGame}
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
                <span className="journey-score">{liveScore} pts</span>
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

        {readyVisible && !tutorialOpen ? (
          <div className="ready-hint" aria-hidden="true">
            <span className="ready-hint__tap">
              <Icon name="tap" size={24} strokeWidth={1.8} />
            </span>
            <strong>Tap to take off</strong>
            <span>Keep Uraan between the painted towers</span>
            <span className="ready-hint__keys">
              <kbd>Space</kbd>
              <kbd>↑</kbd>
            </span>
          </div>
        ) : null}

        {readyVisible && tutorialOpen ? (
          <aside className="tutorial-card" aria-label="How to play">
            <span className="tutorial-card__eyebrow">Your first flight</span>
            <h2>Ride the painted wind</h2>
            <ul className="tutorial-card__list">
              <li>
                <span className="tutorial-card__icon tutorial-card__icon--gold">
                  <Icon name="tap" size={18} strokeWidth={1.9} />
                </span>
                <span>
                  <strong>Tap anywhere to flap.</strong> Space and the up arrow work too.
                </span>
              </li>
              <li>
                <span className="tutorial-card__icon tutorial-card__icon--rose">
                  <Icon name="heart" size={17} strokeWidth={2} />
                </span>
                <span>
                  <strong>You have three hearts.</strong> A bump costs one heart, then you fly on.
                </span>
              </li>
              <li>
                <span className="tutorial-card__icon tutorial-card__icon--teal">
                  <Icon name="star" size={18} strokeWidth={1.9} />
                </span>
                <span>
                  <strong>Gather golden stars.</strong> Eight earns two, fourteen earns three.
                </span>
              </li>
            </ul>
            <PaintedButton size="md" fullWidth trailingIcon="arrow-right" onClick={beginFlight}>
              Let&apos;s fly
            </PaintedButton>
            <p className="tutorial-card__note">The gaps are long and gentle. No need to rush.</p>
          </aside>
        ) : null}

        {playingHint ? (
          <div className="game-hint" aria-hidden="true">
            <span className="game-hint__touch">
              <Icon name="tap" size={15} strokeWidth={2} />
              Tap to flap
            </span>
            <span className="game-hint__keys">
              <kbd>Space</kbd> or <kbd>↑</kbd> to flap
            </span>
          </div>
        ) : null}

        {paused ? (
          <div className="game-overlay" data-ui="true">
            <div className="game-panel">
              <span className="game-panel__kicker">A pause in the journey</span>
              <h2>Take a breath</h2>
              <p className="game-panel__sub">
                {level.city} · {Math.round(hud.progress * 100)}% of the route
              </p>
              <div className="pause-meter" aria-hidden="true">
                <span style={{ width: `${Math.max(2, hud.progress * 100)}%` }} />
              </div>
              <div className="game-panel__mini-stats">
                <span>
                  <Icon name="star" size={14} strokeWidth={2} /> {hud.stars} stars
                </span>
                <span>
                  <Icon name="heart" size={14} strokeWidth={2} /> {hud.hearts} hearts
                </span>
              </div>
              <div className="game-panel__actions">
                <PaintedButton size="md" fullWidth icon="play" onClick={resumeGame}>
                  Keep flying
                </PaintedButton>
                <div className="game-panel__row">
                  <PaintedButton variant="secondary" size="sm" icon="restart" onClick={restartGame}>
                    Restart
                  </PaintedButton>
                  <PaintedButton variant="secondary" size="sm" icon="map" onClick={leaveGame}>
                    Flight map
                  </PaintedButton>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {defeatOpen ? (
          <div className="game-overlay" data-ui="true">
            <div className="game-panel game-panel--defeat">
              <span className="game-panel__kicker">A small setback</span>
              <h2>The wind won this round</h2>
              <p className="game-panel__sub">
                Uraan flew {Math.min(hud.distance, level.lengthMeters)} m before running out of hearts.
                The route is short — one more try will do it.
              </p>
              <div className="run-summary">
                <div>
                  <span>Distance</span>
                  <strong>{Math.min(hud.distance, level.lengthMeters)} m</strong>
                </div>
                <div>
                  <span>Stars</span>
                  <strong>{hud.stars}</strong>
                </div>
                <div>
                  <span>Hearts</span>
                  <strong>0 / 3</strong>
                </div>
              </div>
              <div className="game-panel__actions">
                <PaintedButton size="md" fullWidth icon="restart" onClick={restartGame}>
                  Try once more
                </PaintedButton>
                <PaintedButton variant="secondary" size="sm" fullWidth icon="map" onClick={leaveGame}>
                  Return to the flight map
                </PaintedButton>
              </div>
            </div>
          </div>
        ) : null}

        {arrived ? (
          <div className="arrival" aria-live="polite">
            <div className="arrival__card">
              <span className="arrival__kicker">Destination reached</span>
              <h2>{level.city}</h2>
              <p>{level.tagline}</p>
              <StarRating value={finalResult?.rating ?? 1} size={23} animate />
              <span className="arrival__note">Collecting your postcard…</span>
            </div>
          </div>
        ) : null}

        {fatalError ? (
          <div className="game-overlay" data-ui="true">
            <div className="game-panel">
              <span className="game-panel__kicker">A bumpy runway</span>
              <h2>This browser could not start the canvas</h2>
              <p className="game-panel__sub">
                Please try a current version of Chrome, Safari, Edge or Firefox with hardware
                acceleration enabled.
              </p>
              <PaintedButton size="md" fullWidth icon="arrow-left" onClick={leaveGame}>
                Back to the flight map
              </PaintedButton>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

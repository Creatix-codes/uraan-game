import { useEffect, useRef, useState } from 'react';
import { audio } from './audio/audioManager';
import { GameShell } from './components/GameShell';
import { PostcardGallery } from './components/PostcardGallery';
import { getLevel, TOTAL_LEVELS } from './data/levels';
import {
  getContinueLevelId,
  loadProgress,
  markTutorialSeen,
  recordVictory,
  resetJourney,
  saveProgress,
} from './data/progress';
import type { LevelResult, ProgressState, ScreenName } from './types';
import type { RunResult } from './game/engine';
import { HomeScreen } from './screens/HomeScreen';
import { MapScreen } from './screens/MapScreen';
import { GameScreen } from './screens/GameScreen';
import { VictoryScreen } from './screens/VictoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';

interface VictoryState {
  result: RunResult;
  isNewBest: boolean;
  newlyUnlocked: boolean;
}

export default function App() {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());
  const [screen, setScreen] = useState<ScreenName>('home');
  const [activeLevelId, setActiveLevelId] = useState(1);
  const [settingsReturn, setSettingsReturn] = useState<ScreenName>('home');
  const [postcardsOpen, setPostcardsOpen] = useState(false);
  const [victory, setVictory] = useState<VictoryState | null>(null);

  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    audio.configure(progress.settings);
  }, [progress.settings]);

  useEffect(() => {
    const handleFirstGesture = () => {
      audio.unlock();
      audio.configure(progressRef.current.settings);
      window.removeEventListener('pointerdown', handleFirstGesture, true);
      window.removeEventListener('keydown', handleFirstGesture, true);
    };
    window.addEventListener('pointerdown', handleFirstGesture, true);
    window.addEventListener('keydown', handleFirstGesture, true);

    const handleButtonClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('button')) audio.click();
    };
    document.addEventListener('click', handleButtonClick);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture, true);
      window.removeEventListener('keydown', handleFirstGesture, true);
      document.removeEventListener('click', handleButtonClick);
    };
  }, []);

  const startLevel = (levelId: number) => {
    setActiveLevelId(Math.min(TOTAL_LEVELS, Math.max(1, levelId)));
    setScreen('game');
    setPostcardsOpen(false);
  };

  const openSettings = () => {
    setSettingsReturn(screen === 'settings' ? 'home' : screen === 'game' ? 'map' : screen);
    setScreen('settings');
  };

  const handleSettingsBack = () => {
    if (settingsReturn === 'victory' && victory) setScreen('victory');
    else if (settingsReturn === 'map') setScreen('map');
    else setScreen('home');
  };

  const handleVictory = (result: RunResult) => {
    const current = progressRef.current;
    const payload: LevelResult = {
      ...result,
      completed: true,
      isNewBest: false,
    };
    const { progress: updated, isNewBest } = recordVictory(current, payload);
    const newlyUnlocked =
      Math.min(TOTAL_LEVELS, result.levelId + 1) > current.unlocked;

    setProgress(updated);
    progressRef.current = updated;
    setVictory({ result, isNewBest, newlyUnlocked });
    setScreen('victory');
  };

  const handleVictoryContinue = () => {
    if (!victory) {
      setScreen('map');
      return;
    }
    const nextId = victory.result.levelId + 1;
    if (nextId <= TOTAL_LEVELS) startLevel(nextId);
    else setScreen('map');
  };

  const handleReset = () => {
    setProgress((current) => resetJourney(current.settings));
    setVictory(null);
    setActiveLevelId(1);
    setScreen('home');
  };

  const updateSettings = (patch: Partial<ProgressState['settings']>) => {
    setProgress((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }));
  };

  const renderScreen = () => {
    if (screen === 'game') {
      return (
        <GameScreen
          level={getLevel(activeLevelId)}
          tutorialSeen={progress.tutorialSeen}
          onVictory={handleVictory}
          onExit={() => setScreen('map')}
          onTutorialSeen={() => setProgress((current) => markTutorialSeen(current))}
          onAttempt={() =>
            setProgress((current) => ({
              ...current,
              totalFlights: current.totalFlights + 1,
            }))
          }
        />
      );
    }

    if (screen === 'map') {
      return (
        <MapScreen
          progress={progress}
          onBack={() => setScreen('home')}
          onPlay={startLevel}
          onSettings={openSettings}
          onPostcards={() => setPostcardsOpen(true)}
        />
      );
    }

    if (screen === 'victory' && victory) {
      return (
        <VictoryScreen
          level={getLevel(victory.result.levelId)}
          result={victory.result}
          isNewBest={victory.isNewBest}
          newlyUnlocked={victory.newlyUnlocked}
          onContinue={handleVictoryContinue}
          onReplay={() => startLevel(victory.result.levelId)}
          onMap={() => setScreen('map')}
        />
      );
    }

    if (screen === 'settings') {
      return (
        <SettingsScreen
          progress={progress}
          onBack={handleSettingsBack}
          onToggleMusic={(enabled) => updateSettings({ music: enabled })}
          onToggleSfx={(enabled) => updateSettings({ sfx: enabled })}
          onReset={handleReset}
          onMap={() => setScreen('map')}
        />
      );
    }

    return (
      <HomeScreen
        progress={progress}
        onStart={() => startLevel(getContinueLevelId(progress))}
        onMap={() => setScreen('map')}
        onSettings={openSettings}
        onPostcards={() => setPostcardsOpen(true)}
      />
    );
  };

  return (
    <GameShell>
      <div className="screen-layer" key={`${screen}-${activeLevelId}`}>
        {renderScreen()}
      </div>
      <PostcardGallery
        open={postcardsOpen}
        progress={progress}
        onClose={() => setPostcardsOpen(false)}
      />
    </GameShell>
  );
}

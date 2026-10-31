import { useState } from 'react';
import { Icon } from '../components/Icon';
import { IconButton, PaintedButton } from '../components/Buttons';
import { Modal } from '../components/Modal';
import { Rosette } from '../components/Ornaments';
import { SettingsToggle } from '../components/SettingsToggle';
import { getCompletedCount, getTotalStars } from '../data/progress';
import { TOTAL_LEVELS } from '../data/levels';
import type { ProgressState } from '../types';

interface SettingsScreenProps {
  progress: ProgressState;
  onBack: () => void;
  onToggleMusic: (enabled: boolean) => void;
  onToggleSfx: (enabled: boolean) => void;
  onReset: () => void;
  onMap: () => void;
}

export function SettingsScreen({
  progress,
  onBack,
  onToggleMusic,
  onToggleSfx,
  onReset,
  onMap,
}: SettingsScreenProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const completed = getCompletedCount(progress);
  const stars = getTotalStars(progress);

  return (
    <section className="screen screen--settings" aria-label="Settings">
      <header className="screen-head">
        <IconButton icon="arrow-left" label="Go back" variant="cream" size="sm" onClick={onBack} />
        <div className="screen-head__title">
          <span>Make the flight yours</span>
          <h1>Settings</h1>
        </div>
        <span className="settings-head-mark" aria-hidden="true">
          <Icon name="settings" size={18} strokeWidth={1.8} />
        </span>
      </header>

      <div className="settings-scroll">
        <div className="settings-hero">
          <span className="settings-hero__rosette" aria-hidden="true">
            <Rosette />
          </span>
          <div className="settings-hero__copy">
            <span className="settings-hero__eyebrow">Set the mood</span>
            <h2>A little music for the road</h2>
            <p>
              An original courtyard melody and hand-made sound effects. Everything starts only
              after you tap, and only if you would like it to.
            </p>
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section__heading">
            <span>Sound</span>
            <small>Saved on this device</small>
          </div>
          <div className="settings-card">
            <SettingsToggle
              icon="music"
              title="Background music"
              description="A gentle pentatonic melody with a soft drone and hand drum."
              checked={progress.settings.music}
              onChange={onToggleMusic}
              accent="green"
            />
            <span className="settings-card__divider" aria-hidden="true" />
            <SettingsToggle
              icon={progress.settings.sfx ? 'sound-on' : 'sound-off'}
              title="Sound effects"
              description="Wingbeats, golden star chimes and friendly little bumps."
              checked={progress.settings.sfx}
              onChange={onToggleSfx}
              accent="gold"
            />
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section__heading">
            <span>The journey</span>
            <small>
              {completed}/{TOTAL_LEVELS} places
            </small>
          </div>
          <div className="settings-journey">
            <div className="settings-journey__stat">
              <span className="settings-journey__icon" aria-hidden="true">
                <Icon name="star" size={19} strokeWidth={1.8} />
              </span>
              <span>
                <strong>{stars} of {TOTAL_LEVELS * 3}</strong>
                <small>Stars collected</small>
              </span>
            </div>
            <span className="settings-journey__divider" aria-hidden="true" />
            <div className="settings-journey__stat">
              <span className="settings-journey__icon settings-journey__icon--teal" aria-hidden="true">
                <Icon name="postcard" size={19} strokeWidth={1.8} />
              </span>
              <span>
                <strong>{completed} of {TOTAL_LEVELS}</strong>
                <small>Postcards earned</small>
              </span>
            </div>
          </div>
          <div className="settings-actions">
            <PaintedButton variant="secondary" fullWidth icon="map" onClick={onMap}>
              Return to the flight map
            </PaintedButton>
            <PaintedButton
              variant="danger"
              fullWidth
              icon="restart"
              onClick={() => setConfirmOpen(true)}
            >
              Restart the journey
            </PaintedButton>
          </div>
        </div>

        <div className="settings-controls">
          <span className="settings-controls__title">
            <Icon name="tap" size={17} strokeWidth={1.9} />
            Flight controls
          </span>
          <div className="settings-controls__grid">
            <span className="settings-controls__item">
              <kbd>Space</kbd>
              <small>Flap</small>
            </span>
            <span className="settings-controls__item">
              <kbd>↑</kbd>
              <small>Flap</small>
            </span>
            <span className="settings-controls__item">
              <kbd>Esc</kbd>
              <small>Pause</small>
            </span>
            <span className="settings-controls__item">
              <Icon name="tap" size={16} strokeWidth={2} />
              <small>Tap anywhere</small>
            </span>
          </div>
        </div>

        <p className="settings-privacy">
          <Icon name="lock" size={13} strokeWidth={1.8} />
          Your journey is saved privately in this browser. No account, no cloud, no tracking.
        </p>
        <p className="settings-version">Uraan-e-Pakistan · Truck-art edition · v1.0</p>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Restart the journey?"
        eyebrow="This cannot be undone"
        className="confirm-modal"
      >
        <p className="confirm-copy">
          {completed === 0
            ? 'Your stars and best scores will be cleared, and the route beyond Lahore will be locked again.'
            : completed === 1
              ? 'Your stars, best scores and your one collected postcard will be cleared.'
              : `Your stars, best scores and all ${completed} collected postcards will be cleared.`}{' '}
          You will begin again in Lahore. Your sound settings will stay just as they are.
        </p>
        <div className="confirm-actions">
          <PaintedButton
            variant="danger"
            fullWidth
            icon="restart"
            onClick={() => {
              setConfirmOpen(false);
              onReset();
            }}
          >
            Yes, restart from Lahore
          </PaintedButton>
          <PaintedButton variant="secondary" fullWidth onClick={() => setConfirmOpen(false)}>
            Keep my journey
          </PaintedButton>
        </div>
      </Modal>
    </section>
  );
}

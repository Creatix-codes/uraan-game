import { Icon } from '../components/Icon';
import { IconButton, PaintedButton } from '../components/Buttons';
import { HomeScenery } from '../components/HomeScenery';
import { ParrotMascot } from '../components/ParrotMascot';
import { Rosette, StarMedal } from '../components/Ornaments';
import {
  getCompletedCount,
  getContinueLevelId,
  getTotalStars,
} from '../data/progress';
import { getLevel, TOTAL_LEVELS } from '../data/levels';
import type { ProgressState } from '../types';

interface HomeScreenProps {
  progress: ProgressState;
  onStart: () => void;
  onMap: () => void;
  onSettings: () => void;
  onPostcards: () => void;
}

export function HomeScreen({
  progress,
  onStart,
  onMap,
  onSettings,
  onPostcards,
}: HomeScreenProps) {
  const completed = getCompletedCount(progress);
  const stars = getTotalStars(progress);
  const allDone = completed >= TOTAL_LEVELS;
  const continueLevel = getLevel(getContinueLevelId(progress));
  const nextLabel = allDone
    ? 'All eight postcards are in your album'
    : completed === 0
      ? `First stop · ${continueLevel.city}`
      : `Next stop · ${continueLevel.city}, ${continueLevel.region}`;

  return (
    <section className="screen screen--home" aria-label="Uraan-e-Pakistan home">
      <HomeScenery />

      <header className="home-top">
        <div className="home-brand">
          <span className="home-brand__mark" aria-hidden="true">
            <Rosette />
          </span>
          <span className="home-brand__copy">
            <strong>Truck-art edition</strong>
            <small>Made for the love of Pakistan</small>
          </span>
        </div>
        <div className="home-top__actions">
          <IconButton
            icon="postcard"
            label={`Postcard album, ${completed} of ${TOTAL_LEVELS} collected`}
            variant="cream"
            size="sm"
            onClick={onPostcards}
          />
          <IconButton
            icon="settings"
            label="Open settings"
            variant="cream"
            size="sm"
            onClick={onSettings}
          />
        </div>
      </header>

      <main className="home-main">
        <div className="home-lockup">
          <div className="home-kicker">
            <span className="home-kicker__rule" aria-hidden="true" />
            <span>A flying postcard adventure</span>
            <span className="home-kicker__rule" aria-hidden="true" />
          </div>
          <h1 className="wordmark" aria-label="Uraan-e-Pakistan">
            <span className="wordmark__row" aria-hidden="true">
              <span className="wordmark__uraan">Uraan</span>
              <span className="wordmark__e">-e-</span>
            </span>
            <span className="wordmark__row wordmark__row--pakistan" aria-hidden="true">
              Pakistan
            </span>
          </h1>
          <p className="home-urdu" lang="ur">
            اڑانِ پاکستان
          </p>
          <p className="home-tagline">
            Ride the painted wind from the Badshahi Mosque to Nanga Parbat.
          </p>
        </div>

        <div className="home-parrot">
          <ParrotMascot />
          <div className="home-parrot__banner">
            <span className="home-parrot__banner-icon" aria-hidden="true">
              <Icon name="wind" size={14} strokeWidth={2} />
            </span>
            <span>Uraan the parrot is ready</span>
          </div>
        </div>

        <div className="home-cta">
          <PaintedButton
            size="lg"
            fullWidth
            icon={allDone ? 'map' : 'play'}
            trailingIcon={allDone ? undefined : 'arrow-right'}
            onClick={allDone ? onMap : onStart}
          >
            {allDone ? 'Choose a route' : completed === 0 ? 'Start the journey' : 'Continue the journey'}
          </PaintedButton>
          <p className="home-next">{nextLabel}</p>
          <div className="home-links">
            <button type="button" className="home-link" onClick={onMap}>
              <Icon name="map" size={17} strokeWidth={1.9} />
              <span>Flight map</span>
            </button>
            <span className="home-links__dot" aria-hidden="true" />
            <button type="button" className="home-link" onClick={onPostcards}>
              <Icon name="postcard" size={17} strokeWidth={1.9} />
              <span>Album</span>
              <span className="home-link__badge">
                {completed}/{TOTAL_LEVELS}
              </span>
            </button>
          </div>
        </div>

        <div className="home-stats" aria-label="Your journey so far">
          <div className="home-stat">
            <span className="home-stat__icon" aria-hidden="true">
              <Icon name="flag" size={17} strokeWidth={1.9} />
            </span>
            <span className="home-stat__value">
              {completed}
              <small>/{TOTAL_LEVELS}</small>
            </span>
            <span className="home-stat__label">Places</span>
          </div>
          <div className="home-stat__divider" aria-hidden="true" />
          <div className="home-stat">
            <span className="home-stat__icon" aria-hidden="true">
              <StarMedal filled size={18} />
            </span>
            <span className="home-stat__value">
              {stars}
              <small>/24</small>
            </span>
            <span className="home-stat__label">Stars</span>
          </div>
          <div className="home-stat__divider" aria-hidden="true" />
          <div className="home-stat">
            <span className="home-stat__icon" aria-hidden="true">
              <Icon name="wind" size={18} strokeWidth={1.9} />
            </span>
            <span className="home-stat__value">{progress.totalFlights}</span>
            <span className="home-stat__label">Flights</span>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <span>Eight destinations</span>
        <span className="home-footer__dot" aria-hidden="true" />
        <span>One unforgettable flight</span>
      </footer>
    </section>
  );
}

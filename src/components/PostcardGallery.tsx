import { LEVELS } from '../data/levels';
import { getCompletedCount, getStarsForLevel } from '../data/progress';
import type { ProgressState } from '../types';
import { Icon } from './Icon';
import { LevelIllustration } from './LevelIllustration';
import { Modal } from './Modal';
import { StarRating } from './Ornaments';
import { PaintedButton } from './Buttons';

interface PostcardGalleryProps {
  open: boolean;
  progress: ProgressState;
  onClose: () => void;
}

export function PostcardGallery({ open, progress, onClose }: PostcardGalleryProps) {
  const collected = getCompletedCount(progress);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Postcard album"
      eyebrow={`${collected} of ${LEVELS.length} collected`}
      className="album-modal"
    >
      <p className="album-intro">
        Every finished flight earns a hand-painted postcard. Complete all eight routes to fill the album.
      </p>
      <div className="album-grid">
        {LEVELS.map((level) => {
          const saved = progress.levels[String(level.id)];
          const unlocked = saved?.completed ?? false;
          return (
            <article
              key={level.id}
              className={`album-card ${unlocked ? 'is-collected' : 'is-locked'}`}
            >
              <div className="album-card__art">
                <LevelIllustration level={level} />
                {unlocked ? (
                  <span className="album-card__stamp" aria-hidden="true">
                    <span>PAKISTAN</span>
                    <Icon name="star" size={15} strokeWidth={1.5} />
                    <span>POST</span>
                  </span>
                ) : (
                  <div className="album-card__lock">
                    <Icon name="lock" size={18} strokeWidth={2} />
                    <span>Not collected</span>
                  </div>
                )}
              </div>
              <div className="album-card__copy">
                <div className="album-card__topline">
                  <span>No. {String(level.id).padStart(2, '0')}</span>
                  <span>{level.region}</span>
                </div>
                <h3>{unlocked ? level.city : 'Undiscovered route'}</h3>
                {unlocked ? (
                  <StarRating value={getStarsForLevel(progress, level.id)} size={13} label={`${getStarsForLevel(progress, level.id)} of 3 stars`} />
                ) : (
                  <p>Fly this level to reveal its postcard.</p>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <div className="album-footer">
        <PaintedButton variant="secondary" fullWidth icon="close" onClick={onClose}>
          Back to the journey
        </PaintedButton>
      </div>
    </Modal>
  );
}

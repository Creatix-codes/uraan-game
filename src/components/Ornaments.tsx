import { useId } from 'react';

interface StarMedalProps {
  filled?: boolean;
  size?: number;
  className?: string;
}

export function StarMedal({ filled = true, size = 28, className = '' }: StarMedalProps) {
  return (
    <svg
      className={`star-medal ${filled ? 'is-filled' : 'is-empty'} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
    >
      <path
        className="star-medal__shape"
        d="M20 2.5 24 9l7.8-.6-2.5 7.4 5.2 5.8-7.2 3-1.4 7.7-6.6-4.1-6.6 4.1-1.4-7.7-7.2-3 5.2-5.8L7.8 8.4 15.6 9Z"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle className="star-medal__center" cx="20" cy="19.5" r="4.3" strokeWidth="1.4" />
      <circle className="star-medal__dot" cx="20" cy="19.5" r="1.5" />
    </svg>
  );
}

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  animate?: boolean;
  label?: string;
  className?: string;
}

export function StarRating({
  value,
  max = 3,
  size = 28,
  animate = false,
  label,
  className = '',
}: StarRatingProps) {
  return (
    <div
      className={`star-rating ${animate ? 'is-animated' : ''} ${className}`}
      role="img"
      aria-label={label ?? `${value} of ${max} stars`}
    >
      {Array.from({ length: max }, (_, index) => (
        <span
          className={`star-rating__item ${index < value ? 'is-filled' : ''}`}
          key={index}
          style={{ '--star-delay': `${index * 0.14}s` } as React.CSSProperties}
        >
          <StarMedal filled={index < value} size={size} />
        </span>
      ))}
    </div>
  );
}

interface HeartTokenProps {
  filled: boolean;
  index?: number;
  size?: number;
  className?: string;
}

export function HeartToken({ filled, index = 0, size = 24, className = '' }: HeartTokenProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <svg
      className={`heart-token ${filled ? 'is-filled' : 'is-empty'} ${className}`}
      width={size}
      height={size * 0.94}
      viewBox="0 0 34 32"
      aria-hidden="true"
      style={{ '--heart-index': index } as React.CSSProperties}
    >
      <defs>
        <linearGradient id={`heart-fill-${uid}`} x1="5" y1="3" x2="29" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ff9a7e" />
          <stop offset="0.55" stopColor="#e55466" />
          <stop offset="1" stopColor="#b72e4c" />
        </linearGradient>
      </defs>
      <path
        d="M17 29S3.5 21.4 3.5 11.7C3.5 6.4 7.6 3 12.1 3c2.4 0 4 1.2 4.9 2.7C17.9 4.2 19.5 3 21.9 3c4.5 0 8.6 3.4 8.6 8.7C30.5 21.4 17 29 17 29Z"
        fill={filled ? `url(#heart-fill-${uid})` : 'rgba(27,64,55,0.18)'}
        stroke={filled ? '#602a2e' : 'rgba(250,232,193,0.45)'}
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      {filled ? (
        <>
          <path
            d="M11 10.2c1.4-1.2 3.2-1 4.2.4"
            fill="none"
            stroke="#ffd9b4"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.8"
          />
          <circle cx="23" cy="12" r="1.3" fill="#f9c34a" />
          <circle cx="18" cy="18" r="1" fill="#f9c34a" opacity="0.8" />
        </>
      ) : null}
    </svg>
  );
}

export function HeartRow({ hearts, max = 3, size = 25 }: { hearts: number; max?: number; size?: number }) {
  return (
    <div className="heart-row" role="img" aria-label={`${hearts} of ${max} hearts left`}>
      {Array.from({ length: max }, (_, index) => (
        <HeartToken key={index} filled={index < hearts} index={index} size={size} />
      ))}
    </div>
  );
}

export function PaintedDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`painted-divider ${className}`} aria-hidden="true">
      <span className="painted-divider__line" />
      <svg viewBox="0 0 40 40" width="22" height="22" focusable="false">
        <path
          d="M20 2 24 9l7.8-.6-2.5 7.4 5.2 5.8-7.2 3-1.4 7.7-6.6-4.1-6.6 4.1-1.4-7.7-7.2-3 5.2-5.8L7.8 8.4 15.6 9Z"
          fill="currentColor"
          opacity="0.9"
        />
        <circle cx="20" cy="19.5" r="3.2" fill="var(--deep-teal, #14352e)" />
      </svg>
      <span className="painted-divider__line" />
    </div>
  );
}

export function Rosette({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`rosette ${className}`}
      viewBox="0 0 80 80"
      width="80"
      height="80"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="40" cy="40" r="34" opacity="0.45" strokeDasharray="3 6" />
        <circle cx="40" cy="40" r="27" opacity="0.4" />
      </g>
      <g fill="currentColor" opacity="0.55">
        {Array.from({ length: 12 }, (_, index) => (
          <ellipse
            key={index}
            cx="40"
            cy="18"
            rx="3.4"
            ry="8"
            transform={`rotate(${index * 30} 40 40)`}
          />
        ))}
      </g>
      <circle cx="40" cy="40" r="7" fill="currentColor" opacity="0.8" />
      <circle cx="40" cy="40" r="2.6" fill="#fff4d0" />
    </svg>
  );
}

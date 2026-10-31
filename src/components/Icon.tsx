import type { SVGProps } from 'react';

export type IconName =
  | 'settings'
  | 'sound-on'
  | 'sound-off'
  | 'music'
  | 'pause'
  | 'play'
  | 'arrow-left'
  | 'arrow-right'
  | 'restart'
  | 'map'
  | 'postcard'
  | 'close'
  | 'lock'
  | 'check'
  | 'home'
  | 'star'
  | 'heart'
  | 'sparkle'
  | 'tap'
  | 'wind'
  | 'trophy'
  | 'compass'
  | 'flag';

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, strokeWidth = 1.9, ...props }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
    ...props,
  };

  switch (name) {
    case 'settings':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3.1" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.86a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 8.97 4.5H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.5 9v.03a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
        </svg>
      );
    case 'sound-on':
      return (
        <svg {...common}>
          <path d="M11 5 6.5 9H3v6h3.5L11 19Z" />
          <path d="M15.2 8.8a4.5 4.5 0 0 1 0 6.4M18.3 5.7a9 9 0 0 1 0 12.6" />
        </svg>
      );
    case 'sound-off':
      return (
        <svg {...common}>
          <path d="M11 5 6.5 9H3v6h3.5L11 19Z" />
          <path d="m15.5 9.5 5 5m0-5-5 5" />
        </svg>
      );
    case 'music':
      return (
        <svg {...common}>
          <path d="M9 18V5.5L20 3v12.5" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="17" cy="15.5" r="3" />
        </svg>
      );
    case 'pause':
      return (
        <svg {...common}>
          <rect x="6.5" y="4" width="4" height="16" rx="1.7" fill="currentColor" stroke="none" />
          <rect x="13.5" y="4" width="4" height="16" rx="1.7" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'play':
      return (
        <svg {...common}>
          <path d="M8 4.8v14.4L19.5 12Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...common}>
          <path d="M20 12H4m6-6-6 6 6 6" />
        </svg>
      );
    case 'arrow-right':
      return (
        <svg {...common}>
          <path d="M4 12h16m-6-6 6 6-6 6" />
        </svg>
      );
    case 'restart':
      return (
        <svg {...common}>
          <path d="M4.5 11A7.5 7.5 0 1 1 6.7 16.3" />
          <path d="M4.5 5v6h6" />
        </svg>
      );
    case 'map':
      return (
        <svg {...common}>
          <path d="m3 6 5.5-2.5L14 6l6.5-2.5v14L14 20l-5.5-2.5L3 20Z" />
          <path d="M8.5 3.5v14M14 6v14" />
        </svg>
      );
    case 'postcard':
      return (
        <svg {...common}>
          <rect x="2.5" y="5" width="19" height="14" rx="1.8" />
          <path d="M6 9h6M6 12h4.5" />
          <rect x="15" y="8" width="3.5" height="4" rx="0.5" />
        </svg>
      );
    case 'close':
      return (
        <svg {...common}>
          <path d="M5 5l14 14M19 5 5 19" />
        </svg>
      );
    case 'lock':
      return (
        <svg {...common}>
          <rect x="4.5" y="10" width="15" height="10.5" rx="2" />
          <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
          <circle cx="12" cy="15.3" r="1.1" fill="currentColor" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <path d="m4.5 12.5 5 5L19.5 6.5" />
        </svg>
      );
    case 'home':
      return (
        <svg {...common}>
          <path d="m3 10.5 9-7.5 9 7.5" />
          <path d="M5.5 9v11h5v-6h3v6h5V9" />
        </svg>
      );
    case 'star':
      return (
        <svg {...common}>
          <path d="m12 2.7 2.9 6.2 6.8.8-5.1 4.6 1.5 6.7L12 17.6 5.9 21l1.5-6.7-5.1-4.6 6.8-.8Z" />
        </svg>
      );
    case 'heart':
      return (
        <svg {...common}>
          <path d="M20.8 5.8a5.4 5.4 0 0 0-7.6 0L12 7l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 22l8.8-8.6a5.4 5.4 0 0 0 0-7.6Z" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common}>
          <path d="M12 2.5c.5 4.8 2.7 7 7.5 7.5-4.8.5-7 2.7-7.5 7.5-.5-4.8-2.7-7-7.5-7.5 4.8-.5 7-2.7 7.5-7.5Z" />
          <path d="M19 16c.2 1.7 1 2.5 2.7 2.7-1.7.2-2.5 1-2.7 2.7-.2-1.7-1-2.5-2.7-2.7 1.7-.2 2.5-1 2.7-2.7Z" />
        </svg>
      );
    case 'tap':
      return (
        <svg {...common}>
          <path d="M9.5 11V6.5a2 2 0 0 1 4 0V11" />
          <path d="M13.5 10V7.8a1.8 1.8 0 0 1 3.6 0V12" />
          <path d="M17.1 10.5a1.7 1.7 0 0 1 3.4.2v4a6.8 6.8 0 0 1-6.8 6.8h-.7a6.2 6.2 0 0 1-4.8-2.3L4.5 14a1.9 1.9 0 0 1 2.9-2.5l2.1 2" />
          <path d="M7 3.5a6 6 0 0 0-4.5 5.8" />
        </svg>
      );
    case 'wind':
      return (
        <svg {...common}>
          <path d="M3 8h10.5a2.5 2.5 0 1 0-2.3-3.5" />
          <path d="M3 12h15a2.5 2.5 0 1 1-2.3 3.5" />
          <path d="M3 16h6" />
        </svg>
      );
    case 'trophy':
      return (
        <svg {...common}>
          <path d="M8 3h8v6a4 4 0 0 1-8 0Z" />
          <path d="M8 5H4v2a4 4 0 0 0 4 4M16 5h4v2a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6" />
        </svg>
      );
    case 'compass':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.7 8.3-2.2 5.2-5.2 2.2 2.2-5.2Z" />
        </svg>
      );
    case 'flag':
      return (
        <svg {...common}>
          <path d="M5 21V4M5 4h11l-1.8 4L16 12H5" />
        </svg>
      );
    default:
      return null;
  }
}

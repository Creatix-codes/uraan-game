import type { ReactNode } from 'react';

interface GameShellProps {
  children: ReactNode;
}

/**
 * The portrait "truck" frame that holds every screen. On desktop it floats on
 * a painted backdrop; on phones the frame dissolves and the game fills the
 * viewport edge to edge.
 */
export function GameShell({ children }: GameShellProps) {
  return (
    <div className="app-shell">
      <BackdropArt />
      <div className="device-stage">
        <div className="device">
          <div className="device__frame">
            <div className="device__screen">
              <div className="game-viewport">{children}</div>
            </div>
          </div>
          <span className="device__stud device__stud--tl" aria-hidden="true" />
          <span className="device__stud device__stud--tr" aria-hidden="true" />
          <span className="device__stud device__stud--bl" aria-hidden="true" />
          <span className="device__stud device__stud--br" aria-hidden="true" />
        </div>
        <p className="desktop-note">
          <span className="desktop-note__rule" aria-hidden="true" />
          Eight postcards from Pakistan
          <span className="desktop-note__rule" aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}

function BackdropArt() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__glow" />
      <div className="backdrop__pattern" />
      <svg className="backdrop__arch" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="backdrop-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f6d58e" stopOpacity="0.5" />
            <stop offset="0.5" stopColor="#d8a24a" stopOpacity="0.14" />
            <stop offset="1" stopColor="#f6d58e" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M405 900V365c0-130 87-235 195-235s195 105 195 235v535"
          fill="none"
          stroke="url(#backdrop-gold)"
          strokeWidth="2"
        />
        <path
          d="M432 900V373c0-119 75-214 168-214s168 95 168 214v527"
          fill="none"
          stroke="url(#backdrop-gold)"
          strokeWidth="1"
          strokeDasharray="3 12"
        />
        <g fill="none" stroke="#f6d58e" opacity="0.18">
          <circle cx="600" cy="424" r="250" strokeDasharray="2 14" />
          <circle cx="600" cy="424" r="274" />
        </g>
      </svg>

      <svg className="backdrop__flower backdrop__flower--left" viewBox="0 0 220 220" focusable="false">
        <g fill="none" stroke="#eec277" strokeWidth="1.4" opacity="0.55">
          <circle cx="110" cy="110" r="88" strokeDasharray="3 9" />
          <circle cx="110" cy="110" r="64" />
          {Array.from({ length: 16 }, (_, index) => (
            <ellipse
              key={index}
              cx="110"
              cy="56"
              rx="8"
              ry="26"
              transform={`rotate(${index * 22.5} 110 110)`}
              fill="#d7a24b"
              fillOpacity="0.16"
            />
          ))}
          {Array.from({ length: 8 }, (_, index) => (
            <circle
              key={index}
              cx={110 + Math.cos((index * Math.PI) / 4) * 74}
              cy={110 + Math.sin((index * Math.PI) / 4) * 74}
              r="3"
              fill="#eec277"
              stroke="none"
            />
          ))}
          <circle cx="110" cy="110" r="17" fill="#d7a24b" fillOpacity="0.3" />
          <circle cx="110" cy="110" r="6" fill="#eec277" stroke="none" opacity="0.7" />
        </g>
      </svg>
      <svg className="backdrop__flower backdrop__flower--right" viewBox="0 0 220 220" focusable="false">
        <g fill="none" stroke="#eec277" strokeWidth="1.4" opacity="0.45">
          <circle cx="110" cy="110" r="82" strokeDasharray="2 8" />
          <circle cx="110" cy="110" r="52" />
          {Array.from({ length: 12 }, (_, index) => (
            <path
              key={index}
              d="M110 51c13 0 23 11 23 24 0 12-9 22-23 35-14-13-23-23-23-35 0-13 10-24 23-24Z"
              transform={`rotate(${index * 30} 110 110)`}
              fill="#e8ba68"
              fillOpacity="0.1"
            />
          ))}
          <circle cx="110" cy="110" r="9" fill="#eec277" stroke="none" opacity="0.55" />
        </g>
      </svg>

      <div className="backdrop__rail backdrop__rail--left">
        <span>URAAN-E-PAKISTAN</span>
        <span className="backdrop__rail-dot" />
        <span>اڑانِ پاکستان</span>
      </div>
      <div className="backdrop__rail backdrop__rail--right">
        <span>FLY · COLLECT · EXPLORE</span>
        <span className="backdrop__rail-dot" />
        <span>اڑانِ پاکستان</span>
      </div>
    </div>
  );
}

import { useId } from 'react';

interface ParrotMascotProps {
  className?: string;
  variant?: 'hero' | 'small';
}

export function ParrotMascot({ className = '', variant = 'hero' }: ParrotMascotProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const bodyId = `parrot-body-${uid}`;
  const headId = `parrot-head-${uid}`;
  const bellyId = `parrot-belly-${uid}`;
  const wingId = `parrot-wing-${uid}`;
  const tailId = `parrot-tail-${uid}`;

  return (
    <div className={`parrot-mascot parrot-mascot--${variant} ${className}`}>
      <div className="parrot-halo" aria-hidden="true" />
      <svg
        className="parrot-svg"
        viewBox="0 0 300 300"
        role="img"
        aria-label="A cheerful green parrot with painted wings"
      >
        <defs>
          <linearGradient id={bodyId} x1="80" y1="110" x2="205" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#86de68" />
            <stop offset="0.48" stopColor="#3fbd61" />
            <stop offset="1" stopColor="#1a8852" />
          </linearGradient>
          <radialGradient id={headId} cx="0" cy="0" r="1" gradientTransform="translate(162 82) rotate(52) scale(88)">
            <stop offset="0" stopColor="#96e676" />
            <stop offset="0.65" stopColor="#48c463" />
            <stop offset="1" stopColor="#249752" />
          </radialGradient>
          <linearGradient id={bellyId} x1="122" y1="148" x2="170" y2="221" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f4ea83" />
            <stop offset="1" stopColor="#cfd550" />
          </linearGradient>
          <linearGradient id={wingId} x1="70" y1="140" x2="150" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#79d768" />
            <stop offset="0.55" stopColor="#35a95c" />
            <stop offset="1" stopColor="#197c4d" />
          </linearGradient>
          <linearGradient id={tailId} x1="80" y1="170" x2="40" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2ea35a" />
            <stop offset="0.55" stopColor="#3fbd61" />
            <stop offset="1" stopColor="#d8df55" />
          </linearGradient>
        </defs>

        <g className="parrot-float">
          {/* Tail */}
          <g className="parrot-tail">
            <path
              d="M112 180C88 202 62 224 38 245c28-1 56-16 85-38Z"
              fill={`url(#${tailId})`}
              stroke="#17372e"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M102 191c-18 23-34 43-42 62 25-11 46-30 60-53Z"
              fill="#1b8b53"
              stroke="#17372e"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path
              d="M123 195c-7 23-10 43-8 62 13-21 23-41 28-60Z"
              fill="#f0df61"
              stroke="#17372e"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path d="M76 217c9-3 19-9 27-16" fill="none" stroke="#f7c94c" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="67" cy="236" rx="4.5" ry="2.7" fill="#e45672" transform="rotate(-28 67 236)" />
          </g>

          {/* Far wing peeking behind the body */}
          <path
            d="M105 142c-23 1-38 16-41 38 10 17 31 21 48 6 9-8 14-20 13-31-6-8-12-12-20-13Z"
            fill="#1b6f4b"
            stroke="#17372e"
            strokeWidth="4.5"
            strokeLinejoin="round"
          />

          {/* Body */}
          <path
            d="M87 163c-2-35 25-61 61-62 33-1 56 23 57 55 1 34-26 65-60 65-34 0-56-25-58-58Z"
            fill={`url(#${bodyId})`}
            stroke="#17372e"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <ellipse
            cx="148"
            cy="184"
            rx="37"
            ry="37"
            fill={`url(#${bellyId})`}
            stroke="rgba(28,77,49,0.4)"
            strokeWidth="2"
          />
          <g fill="#e45672" opacity="0.9">
            <circle cx="130" cy="194" r="3" />
            <circle cx="145" cy="188" r="3" />
            <circle cx="160" cy="197" r="3" />
          </g>
          <path
            d="M126 210c11 5 27 6 39 1"
            fill="none"
            stroke="#f7c94c"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Head */}
          <circle
            cx="180"
            cy="112"
            r="46"
            fill={`url(#${headId})`}
            stroke="#17372e"
            strokeWidth="5"
          />

          {/* Crest */}
          <g className="parrot-crest">
            <path
              d="M170 74c-4-15 2-27 12-35 3 15 0 26-5 38Z"
              fill="#e45672"
              stroke="#17372e"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M183 70c1-15 9-24 21-28-1 15-7 25-14 35Z"
              fill="#f7c94c"
              stroke="#17372e"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M194 75c6-13 15-18 28-18-6 14-14 21-22 28Z"
              fill="#45ba61"
              stroke="#17372e"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="178" cy="79" r="3.3" fill="#fff2bd" />
          </g>

          {/* Eye */}
          <g className="parrot-eye">
            <ellipse cx="198" cy="104" rx="12.5" ry="14" fill="#fff9e7" stroke="#17372e" strokeWidth="3" />
            <circle cx="201.5" cy="105" r="7.2" fill="#22352f" />
            <circle cx="204" cy="101.5" r="2.8" fill="#ffffff" />
            <circle cx="198.5" cy="109" r="1.2" fill="#ffffff" opacity="0.7" />
            <path
              d="M185 97c4-8 14-12 23-9"
              fill="none"
              stroke="#f7c94c"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* Cheek and beak */}
          <ellipse cx="192" cy="128" rx="13" ry="8.5" fill="#f19c68" opacity="0.55" transform="rotate(-10 192 128)" />
          <path
            d="M212 103c18-1 35 6 34 16-1 9-19 15-33 6Z"
            fill="#f8a83e"
            stroke="#17372e"
            strokeWidth="4.2"
            strokeLinejoin="round"
          />
          <path
            d="M216 118c10 3 20 2 25-1-3 8-13 13-23 9Z"
            fill="#e5802f"
            stroke="#17372e"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          <ellipse cx="229" cy="110" rx="7" ry="3" fill="#fff0b3" opacity="0.65" transform="rotate(-8 229 110)" />
          <path
            d="M184 136c6 3 13 2 17-2M186 139c4 2 8 2 12 0"
            fill="none"
            stroke="#f7c94c"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Near wing */}
          <g className="parrot-wing">
            <path
              d="M114 139c-26 5-47 29-48 54-1 20 18 32 38 25 27-9 47-33 50-59-9-12-24-21-40-20Z"
              fill={`url(#${wingId})`}
              stroke="#17372e"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            <path
              d="M115 162c-11 5-22 15-27 28M132 162c-13 7-25 21-29 36M146 166c-10 9-18 22-21 35"
              fill="none"
              stroke="#146a44"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            <g transform="translate(111 176)">
              <g fill="#e45672">
                <ellipse cx="0" cy="-9" rx="3.4" ry="6" />
                <ellipse cx="8.5" cy="-2.8" rx="3.4" ry="6" transform="rotate(72 8.5 -2.8)" />
                <ellipse cx="5.2" cy="7.2" rx="3.4" ry="6" transform="rotate(144 5.2 7.2)" />
                <ellipse cx="-5.2" cy="7.2" rx="3.4" ry="6" transform="rotate(216 -5.2 7.2)" />
                <ellipse cx="-8.5" cy="-2.8" rx="3.4" ry="6" transform="rotate(288 -8.5 -2.8)" />
              </g>
              <circle cx="0" cy="0" r="4" fill="#f7c94c" stroke="#17372e" strokeWidth="1.6" />
            </g>
            <path
              d="M79 181c11-4 23-1 30 8"
              fill="none"
              stroke="#f7c94c"
              strokeWidth="2.6"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>

          {/* Feet */}
          <g stroke="#17372e" strokeWidth="3.4" strokeLinecap="round" fill="none">
            <path d="M137 223v13l-9 9M137 236l9 9M171 218v13l-8 8M171 231l8 8" stroke="#e98a3b" />
          </g>

          {/* Painted accents */}
          <g fill="#f7c94c">
            <circle cx="100" cy="121" r="2.6" />
            <circle cx="220" cy="140" r="2.2" />
            <path d="M96 132c4-3 8-3 11 0 3-3 7-3 11 0-4 5-8 6-11 3-3 3-7 2-11-3Z" opacity="0.8" />
          </g>
        </g>
      </svg>

      <span className="parrot-sparkle parrot-sparkle--one" aria-hidden="true" />
      <span className="parrot-sparkle parrot-sparkle--two" aria-hidden="true" />
      <span className="parrot-sparkle parrot-sparkle--three" aria-hidden="true" />
    </div>
  );
}

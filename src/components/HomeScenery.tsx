/**
 * The painted nightscape behind the home screen. The arch, stars, mosque and
 * hills are all original vector shapes, tuned to sit quietly behind content.
 */
export function HomeScenery() {
  return (
    <div className="home-scenery" aria-hidden="true">
      <svg
        viewBox="0 0 420 780"
        preserveAspectRatio="xMidYMid slice"
        className="home-scenery__svg"
        focusable="false"
      >
        <defs>
          <linearGradient id="home-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#071f1e" />
            <stop offset="0.46" stopColor="#0b3632" />
            <stop offset="0.72" stopColor="#155446" />
            <stop offset="1" stopColor="#0a2c28" />
          </linearGradient>
          <radialGradient id="home-glow" cx="0.5" cy="0.38" r="0.58">
            <stop offset="0" stopColor="#f5c45d" stopOpacity="0.24" />
            <stop offset="0.55" stopColor="#dca94a" stopOpacity="0.07" />
            <stop offset="1" stopColor="#dca94a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="home-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9a65e" stopOpacity="0" />
            <stop offset="1" stopColor="#e9a65e" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="home-mosque" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b2b29" />
            <stop offset="1" stopColor="#071d1c" />
          </linearGradient>
          <linearGradient id="home-hill-a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a4e42" />
            <stop offset="1" stopColor="#0a2827" />
          </linearGradient>
          <linearGradient id="home-hill-b" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0c302d" />
            <stop offset="1" stopColor="#061c1c" />
          </linearGradient>
        </defs>

        <rect width="420" height="780" fill="url(#home-sky)" />
        <rect width="420" height="780" fill="url(#home-glow)" />

        {/* Fine gold pin-lines, like the edge of a painted truck panel. */}
        <g fill="none" stroke="#f5d488" strokeWidth="1" opacity="0.22">
          <rect x="14" y="14" width="392" height="752" rx="28" />
          <rect x="21" y="21" width="378" height="738" rx="23" strokeDasharray="2 8" />
          <path d="M32 170c38-58 83-92 144-108M388 170c-38-58-83-92-144-108" />
        </g>

        {/* Painted arch, a subtle stage around the wordmark. */}
        <path
          d="M60 348V230c0-84 66-144 150-144s150 60 150 144v118"
          fill="none"
          stroke="#f6ce76"
          strokeWidth="2"
          opacity="0.34"
          strokeLinecap="round"
        />
        <path
          d="M72 348V235c0-74 61-131 138-131s138 57 138 131v113"
          fill="none"
          stroke="#f6ce76"
          strokeWidth="1"
          opacity="0.18"
          strokeDasharray="3 9"
          strokeLinecap="round"
        />
        <g fill="#f4c75e" opacity="0.72">
          <path d="M210 62l3.2 8.2 8.8.7-6.7 5.8 2 8.6-7.3-4.9-7.3 4.9 2-8.6-6.7-5.8 8.8-.7Z" />
          <circle cx="50" cy="270" r="2.2" opacity="0.6" />
          <circle cx="371" cy="252" r="2" opacity="0.5" />
          <circle cx="84" cy="130" r="1.5" opacity="0.45" />
          <circle cx="336" cy="127" r="1.7" opacity="0.55" />
        </g>

        {/* Rosettes in the corners */}
        <g opacity="0.5" fill="none" stroke="#f6ce76" strokeWidth="1.1">
          <g transform="translate(47 605)">
            <circle r="22" strokeDasharray="2 5" />
            <circle r="13" />
            {Array.from({ length: 8 }, (_, index) => (
              <ellipse key={index} cx="0" cy="-18" rx="2.2" ry="6" transform={`rotate(${index * 45})`} fill="#f6ce76" stroke="none" opacity="0.6" />
            ))}
            <circle r="3" fill="#f6ce76" stroke="none" />
          </g>
          <g transform="translate(372 496) scale(0.76)">
            <circle r="22" strokeDasharray="2 5" />
            <circle r="13" />
            {Array.from({ length: 8 }, (_, index) => (
              <ellipse key={index} cx="0" cy="-18" rx="2.2" ry="6" transform={`rotate(${index * 45})`} fill="#f6ce76" stroke="none" opacity="0.6" />
            ))}
            <circle r="3" fill="#f6ce76" stroke="none" />
          </g>
        </g>

        {/* Distant birds */}
        <g fill="none" stroke="#071f1e" strokeWidth="1.6" strokeLinecap="round" opacity="0.75">
          <path d="M315 196c4-4 8-4 11 0 3-4 7-4 11 0" />
          <path d="M339 180c3-3 6-3 8 0 2-3 5-3 8 0" />
          <path d="M292 173c2-2 5-2 7 0 2-2 5-2 7 0" />
        </g>

        {/* Mountain layers meeting the painted skyline. */}
        <rect y="560" width="420" height="220" fill="url(#home-haze)" opacity="0.5" />
        <path
          d="M-20 612 48 531l40 37 33-59 43 58 33-28 41 45 40-36 43 45 31-24 50 52 48 33v88H-20Z"
          fill="url(#home-hill-a)"
        />
        <path d="m121 509 16 24 14 21-18-8-11 10-12-15-9 8Z" fill="#d8d4b2" opacity="0.22" />
        <path d="m216 536 13 18 14 17-16-5-9 8-11-12-8 6Z" fill="#d8d4b2" opacity="0.18" />

        {/* Badshahi Mosque silhouette with small lit domes. */}
        <g fill="url(#home-mosque)">
          <path d="M116 640V575h190v65Z" />
          <path d="M133 575v-32h156v32Z" />
          <path d="M145 543c8-34 29-54 62-68 33 14 55 34 62 68Z" />
          <path d="M157 543c8-22 24-36 50-47 26 11 43 25 50 47Z" fill="#f0bd5f" opacity="0.2" />
          <path d="M113 586V520h12v120h-12Zm188 0V520h12v120h-12Z" />
          <path d="M111 520c4-11 10-11 16 0Zm188 0c4-11 10-11 16 0Z" />
          <path d="M122 590h8v15h-8Zm172 0h8v15h-8Z" fill="#f0bd5f" opacity="0.22" />
          <path d="M199 640v-36c0-11 6-19 16-19s16 8 16 19v36Z" fill="#2e5b47" opacity="0.75" />
        </g>
        <g fill="none" stroke="#f2c775" strokeWidth="1.2" opacity="0.24">
          <path d="M116 640h190M133 543h156M113 520h12M299 520h12" />
        </g>

        {/* Foreground hills */}
        <path
          d="M-20 666c55-21 102-20 147-5 47 16 90 13 133-1 49-16 99-16 180 5v115H-20Z"
          fill="url(#home-hill-b)"
        />
        <g fill="#f2c775" opacity="0.28">
          <circle cx="67" cy="682" r="1.8" />
          <circle cx="332" cy="675" r="1.6" />
          <circle cx="244" cy="700" r="1.4" />
          <circle cx="123" cy="707" r="1.2" />
        </g>
        <g fill="none" stroke="#2c6153" strokeWidth="2" strokeLinecap="round" opacity="0.7">
          <path d="M28 715c8-10 17-11 25-2M347 728c10-12 20-12 30-3M63 745c7-8 14-8 20-1" />
        </g>

        {/* A tiny lit caravan road at the bottom edge. */}
        <path
          d="M-10 758c72-16 138-17 209-7 74 10 147 9 231-5"
          fill="none"
          stroke="#e3a84f"
          strokeWidth="1.4"
          opacity="0.25"
          strokeDasharray="1 10"
        />
      </svg>
      <div className="home-scenery__grain" />
    </div>
  );
}

import { useId } from 'react';
import type { LevelConfig } from '../types';

interface LevelIllustrationProps {
  level: LevelConfig;
  className?: string;
}

/**
 * A hand-built miniature travel poster for each destination. Everything is
 * vector art so the same illustration can be used on the map, in the postcard
 * album and on the victory postcard without a sprite sheet or image assets.
 */
export function LevelIllustration({ level, className = '' }: LevelIllustrationProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const skyId = `illo-sky-${uid}`;
  const hazeId = `illo-haze-${uid}`;
  const shineId = `illo-shine-${uid}`;
  const p = level.palette;

  return (
    <div className={`level-illo level-illo--${level.slug} ${className}`.trim()}>
      <svg
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`Illustrated postcard of ${level.landmark} in ${level.city}`}
      >
        <defs>
          <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.skyTop} />
            <stop offset="0.65" stopColor={p.skyBottom} />
            <stop offset="1" stopColor={p.haze} />
          </linearGradient>
          <linearGradient id={hazeId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.haze} stopOpacity="0.9" />
            <stop offset="1" stopColor={p.groundTop} stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.72" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="320" height="200" fill={`url(#${skyId})`} />
        <circle cx="252" cy="48" r="44" fill={p.glow} opacity="0.28" />
        <circle cx="252" cy="48" r="24" fill={p.sun} opacity="0.92" />

        <g fill={p.cloud} opacity="0.82">
          <path d="M-10 48c10-14 25-14 35-3 8-10 25-9 31 1 9-4 17 1 20 9H-10Z" />
          <path d="M178 30c8-11 21-11 28-2 6-8 20-7 25 2 7-3 13 0 16 7h-69Z" opacity="0.65" />
          <path d="M56 74c7-9 18-9 24-1 5-6 16-5 20 2 5-2 10 0 12 5H56Z" opacity="0.5" />
        </g>

        {level.slug === 'lahore' ? <LahoreScene level={level} /> : null}
        {level.slug === 'karachi' ? <KarachiScene level={level} /> : null}
        {level.slug === 'mohenjo-daro' ? <MohenjoScene level={level} /> : null}
        {level.slug === 'islamabad' ? <IslamabadScene level={level} /> : null}
        {level.slug === 'swat' ? <SwatScene level={level} /> : null}
        {level.slug === 'hunza' ? <HunzaScene level={level} /> : null}
        {level.slug === 'skardu' ? <SkarduScene level={level} /> : null}
        {level.slug === 'fairy-meadows' ? <FairyMeadowsScene level={level} /> : null}
        {level.slug === 'peshawar' ? <PeshawarScene level={level} /> : null}
        {level.slug === 'gwadar' ? <GwadarScene level={level} /> : null}

        {/* Painted postcard frame and light wash keep all eight posters cohesive. */}
        <rect
          x="5"
          y="5"
          width="310"
          height="190"
          rx="3"
          fill="none"
          stroke={p.ink}
          strokeWidth="3"
          opacity="0.25"
        />
        <path d="M10 190h300" stroke="#fff4d3" strokeWidth="2" opacity="0.4" />
        <path
          d="M14 160c46-25 78-18 115-5 28 10 57 14 84 5 34-11 62-17 93-2v33H14Z"
          fill={`url(#${hazeId})`}
          opacity="0.28"
        />
        <g fill="#fff8de" opacity="0.55">
          <circle cx="24" cy="24" r="1.6" />
          <circle cx="292" cy="168" r="1.6" />
          <circle cx="270" cy="20" r="1.2" />
        </g>
      </svg>
    </div>
  );
}

interface SceneProps {
  level: LevelConfig;
}

function LahoreScene({ level }: SceneProps) {
  const p = level.palette;
  return (
    <g>
      {/* Fort wall */}
      <g>
        <path d="M0 152h138v48H0Z" fill="#a84639" />
        <path d="M0 152h138v8H0Z" fill="#d57856" />
        <g fill="#80322f">
          <path d="M4 139h14v18H4Zm28 0h14v18H32Zm28 0h14v18H60Zm28 0h14v18H88Zm28 0h14v18h-14Z" />
        </g>
        <path d="M36 166c0-12 9-21 22-21s23 8 23 21v10H36Z" fill="#5d292b" />
        <path d="M45 175v-8a13 13 0 0 1 26 0v8Z" fill="#291f27" />
        <path d="M101 163h22v18h-22Z" fill="#71302f" />
        <path d="M112 163v18" stroke="#3e2429" strokeWidth="2" />
      </g>

      {/* Badshahi Mosque */}
      <g stroke="#512626" strokeWidth="2.2" strokeLinejoin="round">
        <path d="M91 154h142v24H91Z" fill="#c65f46" />
        <path d="M91 154h142v7H91Z" fill="#e08d63" />
        <rect x="105" y="115" width="114" height="40" rx="2" fill="#c15442" />
        <path d="M103 115c10-7 24-11 35-11h48c12 0 25 4 34 11Z" fill="#e9a471" />
        <path d="M120 155v-16c0-16 11-27 28-27s28 11 28 27v16Z" fill="#673036" stroke="none" />
        <path d="M130 155v-16c0-13 8-22 18-22s18 9 18 22v16Z" fill="#32232b" stroke="none" />
        <path
          d="M126 109c1-21 13-36 33-45 21 10 34 25 35 45Z"
          fill="#f1dfb6"
        />
        <path d="M154 80c2-11 7-17 15-21" fill="none" stroke="#7d5744" strokeWidth="2" strokeLinecap="round" />
        <circle cx="169" cy="58" r="2.5" fill={p.accent} stroke="none" />
        <path d="M130 104c10-5 20-8 29-8s20 3 30 8Z" fill="#cfa876" stroke="none" />
        <path d="M115 108c1-14 9-24 22-29 13 6 21 16 22 29Z" fill="#ead7ab" />
        <path d="M207 108c1-14 9-24 22-29 13 6 21 16 22 29Z" fill="#ead7ab" />
        <path d="M103 115V55h9v60Z" fill="#d27856" />
        <path d="M133 115V55h9v60Z" fill="#d27856" />
        <path d="M102 55c3-8 8-8 11 0Z" fill="#f1dfb6" />
        <path d="M132 55c3-8 8-8 11 0Z" fill="#f1dfb6" />
        <path d="M237 115V55h9v60Z" fill="#d27856" />
        <path d="M207 115V74h8v41Z" fill="#d27856" />
        <path d="M236 55c3-8 8-8 11 0Z" fill="#f1dfb6" />
        <path d="M206 74c3-7 7-7 10 0Z" fill="#f1dfb6" />
        <g fill="#e19a64" stroke="none">
          <circle cx="154" cy="65" r="1.6" />
          <circle cx="173" cy="65" r="1.6" />
          <circle cx="188" cy="77" r="1.6" />
        </g>
      </g>

      {/* Trees & foreground */}
      <g fill="#6d3533">
        <path d="M245 167c-1-13 8-22 18-26-3 11 5 16 3 26Z" />
        <path d="M269 170c2-12 10-19 21-22-4 10 1 15-1 22Z" />
      </g>
      <path d="M0 178c45-9 92-9 145-3 56 6 118 7 175-1v26H0Z" fill={p.groundTop} />
      <path d="M0 189c54-5 100-3 154 1 60 5 115 4 166-2v12H0Z" fill={p.groundBottom} />
      <g fill={p.accent}>
        <circle cx="44" cy="184" r="1.7" />
        <circle cx="236" cy="182" r="1.4" />
        <path d="M285 181c4-4 9-4 12 0-3 4-8 4-12 0Z" opacity="0.8" />
      </g>
    </g>
  );
}

function KarachiScene({ level }: SceneProps) {
  const p = level.palette;
  return (
    <g>
      {/* Sea */}
      <path d="M0 145h320v55H0Z" fill="#2f8e97" />
      <path d="M0 152c26-8 50 8 77 0s49 5 76 0 48 7 76 0 53 2 91-2v12c-32 5-61-3-91 1s-50-5-76 0-51-7-77-1-52-6-76 1Z" fill="#72c1c2" opacity="0.55" />
      <g fill="none" stroke="#d5f1e5" strokeWidth="2" strokeLinecap="round" opacity="0.65">
        <path d="M268 159c15-5 31-4 44 1" />
        <path d="M20 172c14-4 28-3 39 2" />
        <path d="M210 177c17-4 34-3 47 3" />
      </g>

      {/* Boats */}
      <g transform="translate(254 141)">
        <path d="M0 18h48l-8 9H9Z" fill="#7a4135" stroke="#273e3c" strokeWidth="2" />
        <path d="M24 18V0l22 15Z" fill="#fff6dc" stroke="#273e3c" strokeWidth="2" strokeLinejoin="round" />
        <path d="M22 16V5L6 16Z" fill="#efd7a8" stroke="#273e3c" strokeWidth="2" strokeLinejoin="round" />
      </g>
      <g transform="translate(34 150) scale(0.7)">
        <path d="M0 18h48l-8 9H9Z" fill="#7a4135" stroke="#273e3c" strokeWidth="2" />
        <path d="M24 18V1l19 13Z" fill="#ffe7b2" stroke="#273e3c" strokeWidth="2" strokeLinejoin="round" />
      </g>

      {/* Mazar-e-Quaid */}
      <g stroke="#344c4a" strokeLinejoin="round" strokeWidth="2.2">
        <path d="M49 152h126v16H49Z" fill="#e8dfc6" />
        <path d="M75 90h80v63H75Z" fill="#f7f0dd" />
        <path d="M70 90h90l-10-12H80Z" fill="#f7f0dd" />
        <path d="M86 78c0-20 13-33 29-40 17 7 30 20 30 40Z" fill="#fbf6e8" />
        <path d="M90 78c0-17 11-28 25-35 15 7 26 18 26 35Z" fill="#e8f2ec" stroke="none" />
        <path d="M102 152v-23c0-8 5-14 13-14s14 6 14 14v23Z" fill="#407f7f" />
        <path d="M109 152v-22c0-4 2-7 6-7s6 3 6 7v22Z" fill="#234f51" stroke="none" />
        <path d="M62 57h11v104H62Z" fill="#f8f1e0" />
        <path d="M157 57h11v104h-11Z" fill="#f8f1e0" />
        <path d="M60 57c4-9 9-9 14 0Z" fill="#f0e4c8" />
        <path d="M155 57c4-9 9-9 14 0Z" fill="#f0e4c8" />
        <path d="M58 69h18M156 69h18" stroke={p.accent} strokeWidth="3" />
        <path d="M95 100h7v18h-7Zm34 0h7v18h-7Z" fill="#8cb7af" stroke="none" />
        <path d="M102 64h28M148 64h6" stroke={p.accent} strokeWidth="2" />
      </g>
      <g stroke="#6e3b32" strokeWidth="2">
        <path d="M39 161V97" />
        <path d="M39 102c-12-3-18-10-19-19 11 1 17 6 19 14 2-8 8-13 19-14-1 9-7 16-19 19Z" fill="#3f8a65" />
        <path d="M39 116c-10-2-16-8-16-16 9 0 14 4 16 11 2-7 7-11 16-11 0 8-6 14-16 16Z" fill="#4c9a70" />
      </g>
      <path d="M0 181c58-5 111-4 166 0 52 4 102 3 154-2v21H0Z" fill="#e0bd82" />
      <path d="M0 190h320v10H0Z" fill="#b4875f" />
    </g>
  );
}

function MohenjoScene({ level }: SceneProps) {
  const p = level.palette;
  return (
    <g>
      {/* Distant ruins */}
      <g fill="#b9845b" opacity="0.75">
        <path d="M14 145h72v26H14Z" />
        <path d="M28 130h27v15H28Z" />
        <path d="M237 139h69v30h-69Z" />
        <path d="M252 123h31v16h-31Z" />
      </g>

      {/* Great Bath */}
      <g stroke="#5a3a2d" strokeWidth="2" strokeLinejoin="round">
        <path d="M103 157h114l11 26H92Z" fill="#c08a5f" />
        <path d="M113 149h94v30h-94Z" fill="#8c5b41" />
        <g fill="#b5744e">
          <path d="M106 159h10v8h-10Zm18 0h10v8h-10Zm18 0h10v8h-10Zm18 0h10v8h-10Zm18 0h10v8h-10Zm18 0h10v8h-10Z" />
        </g>
        <path d="M122 158h76v16h-76Z" fill="#4f9ea0" stroke="none" />
        <path d="M126 161c17-3 30 3 46 0s18 2 24 0" fill="none" stroke="#9ed1c3" strokeWidth="1.7" strokeLinecap="round" />
      </g>

      {/* Brick houses */}
      <g stroke="#59372c" strokeWidth="2.1" strokeLinejoin="round">
        <path d="M21 153h63v37H21Z" fill="#ba7f55" />
        <path d="M31 139h42v14H31Z" fill="#c99063" />
        <path d="M31 143h42M31 148h42" stroke="#895b42" strokeWidth="1.2" />
        <path d="M48 169v-10c0-5 3-8 7-8s7 3 7 8v10Z" fill="#4e332c" />
        <path d="M115 168h8v22h-8Zm-62 0h8v22h-8Z" fill="#734b38" stroke="none" />
        <path d="M224 152h61v38h-61Z" fill="#af744d" />
        <path d="M236 136h39v16h-39Z" fill="#c48b61" />
        <path d="M236 141h39M236 147h39" stroke="#8b5b41" strokeWidth="1.2" />
        <path d="M245 167h11v23h-11Z" fill="#493129" stroke="none" />
        <path d="M185 154h30v36h-30Z" fill="#b67b52" />
        <path d="M188 158h24M188 164h24M188 170h24M188 176h24" stroke="#8c5b40" strokeWidth="1" />
      </g>

      {/* Date palms */}
      <g>
        <path d="M291 181c-2-22 2-41 7-56" fill="none" stroke="#62422f" strokeWidth="4" strokeLinecap="round" />
        <g fill="#587a45">
          <path d="M298 126c-12-8-20-18-21-28 13 6 21 13 25 24Z" />
          <path d="M298 126c-2-13 2-24 10-32 3 14 0 25-7 34Z" />
          <path d="M298 126c10-9 21-12 32-9-8 9-18 13-30 13Z" />
          <path d="M298 126c11 1 20 6 26 15-12 1-21-3-28-11Z" />
          <path d="M298 126c-9 3-16 10-20 19 11-1 18-7 23-15Z" />
        </g>
        <path d="M303 133c4 4 5 8 3 11" fill="none" stroke="#8b5a38" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g transform="translate(15 162) scale(0.72)">
        <path d="M15 50C12 27 16 9 23 0" fill="none" stroke="#62422f" strokeWidth="4" strokeLinecap="round" />
        <g fill="#6f8d54">
          <path d="M23 0c-13-6-20-14-22-23 12 4 20 11 25 20Z" />
          <path d="M23 0c0-12 5-20 14-25 1 12-3 21-11 27Z" />
          <path d="M23 0c11-5 22-4 30 2-9 6-19 6-28 3Z" />
        </g>
      </g>
      <path d="M0 176c44-8 76-7 115 0 43 8 76 6 112 0 34-5 64-6 93-1v25H0Z" fill={p.groundTop} />
      <path d="M0 189c54-4 98-2 147 2 58 5 113 3 173-3v12H0Z" fill={p.groundBottom} />
      <g fill="none" stroke="#e3b786" strokeWidth="1.8" opacity="0.7">
        <path d="M20 198h35M168 197h27M243 199h31" />
      </g>
    </g>
  );
}

function IslamabadScene({ level }: SceneProps) {
  const p = level.palette;
  return (
    <g>
      {/* Margalla hills */}
      <path d="M0 145 43 99l35 28 35-37 37 40 31-25 34 35 40-39 65 58v41H0Z" fill="#7fa987" />
      <path d="M0 157 51 118l39 24 36-18 40 33 44-23 44 30 45-25 21 17v44H0Z" fill="#4f876b" />
      <path d="M0 171c45-12 84-12 129-1 46 11 86 10 124 2 25-5 47-6 67-2v30H0Z" fill="#326b52" />

      {/* Faisal Mosque */}
      <g stroke="#355c4f" strokeWidth="2.2" strokeLinejoin="round">
        <path d="M92 147h142v19H92Z" fill="#e8eadd" />
        <path d="M105 111h116v37H105Z" fill="#f4f4e7" />
        <path d="M109 111c17-3 31-14 43-33h21c12 19 26 30 43 33Z" fill="#fbfaf0" />
        <path d="M117 111c12-5 23-15 32-30h27c9 15 20 25 32 30Z" fill="#d9e3d7" stroke="none" />
        <path d="M151 58v-10M174 58v-10" stroke={p.accent} strokeWidth="3" />
        <path d="M145 147v-19l15-18 15 18v19Z" fill="#3f6f5d" />
        <path d="M152 147v-14c0-5 3-8 8-8s8 3 8 8v14Z" fill="#294f43" stroke="none" />
        <path d="M95 67h8v84h-8Zm220-14h8v98h-8Z" fill="#edf0e1" />
        <path d="M93 67c3-7 7-7 10 0Zm219-14c3-7 7-7 10 0Z" fill="#f4f4e7" />
        <path d="M98 87h9M218 73h9" stroke={p.accent} strokeWidth="2.6" />
        <path d="M106 123h16v24h-16Zm86 0h17v24h-17Z" fill="#b8ccb5" stroke="none" />
      </g>

      {/* Pines and foreground */}
      <g fill="#204f3e">
        <path d="M40 166l-14 28h28Zm15 6-16 31h32Zm200-8-16 31h32Zm20 2-13 27h27Z" />
        <path d="M20 174l-10 22h20Zm275-10-12 25h24Z" />
      </g>
      <path d="M0 181c48-9 92-8 139-2 46 6 90 8 133 2 18-2 34-3 48-1v20H0Z" fill={p.groundTop} />
      <path d="M0 192h320v8H0Z" fill={p.groundBottom} />
      <g fill="#f6d47b" opacity="0.85">
        <circle cx="65" cy="190" r="1.7" />
        <circle cx="109" cy="185" r="1.3" />
        <circle cx="262" cy="187" r="1.4" />
      </g>
    </g>
  );
}

function SwatScene({ level }: SceneProps) {
  const p = level.palette;
  return (
    <g>
      {/* Snow peaks */}
      <path d="M0 135 38 60l32 41 31-59 43 72 31-43 43 61 31-37 71 61v42H0Z" fill={p.far} />
      <path d="m38 60 16 22 16 19-16-8-9 10-10-12-9 6Z" fill="#f7fbf7" opacity="0.9" />
      <path d="m101 42 20 34 23 38-17-13-12 10-13-17-13 11Z" fill="#ffffff" opacity="0.9" />
      <path d="m216 70 17 22 22 25-18-7-11 8-12-14-10 7Z" fill="#f8fbf8" opacity="0.8" />

      {/* Pine valley */}
      <path d="M0 148c35-16 66-21 96-16 31 5 48 18 77 20 32 3 57-12 85-18 22-5 42-3 62 2v64H0Z" fill={p.mid} />
      <path d="M0 163c39-13 71-15 103-5 32 10 60 11 89 3 43-11 86-11 128 2v37H0Z" fill={p.groundTop} />

      {/* River */}
      <path
        d="M122 200c16-18 27-29 39-41 14-14 22-22 26-34 5-13 1-20 7-29"
        fill="none"
        stroke="#5bb3b7"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <path
        d="M123 200c16-18 27-29 39-41 14-14 22-22 26-34 5-13 1-20 7-29"
        fill="none"
        stroke="#9bdbd2"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Wooden bridge */}
      <g stroke="#543c2c" strokeWidth="2.2" strokeLinecap="round">
        <path d="M134 165 205 143" stroke="#7c5136" strokeWidth="8" />
        <path d="M138 156 201 136" stroke="#9b6b43" strokeWidth="4" />
        <path d="M143 155v13M160 150v14M178 145v14M195 140v14" />
        <path d="M136 147l17-5M183 134l20-5" stroke={p.accent} strokeWidth="3" />
      </g>

      {/* Pines */}
      <g fill="#235d48">
        <path d="M25 173l-18 30h36Zm42 6-19 30h38Zm-25-13-12 21h24Z" />
        <path d="M270 162l-21 34h42Zm32 14-14 24h28Z" />
      </g>
      <g fill="none" stroke="#d9edbc" strokeWidth="2" strokeLinecap="round">
        <path d="M70 187c10-6 20-5 28 1M236 191c8-5 17-4 23 1" />
      </g>
      <circle cx="258" cy="178" r="1.8" fill={p.accent} />
      <circle cx="281" cy="190" r="1.4" fill={p.accent} />
    </g>
  );
}

function HunzaScene({ level }: SceneProps) {
  const p = level.palette;
  return (
    <g>
      {/* Passu cones */}
      <path d="M0 168 32 91l18 18 25-66 24 62 15-22 28 45 21-38 29 50 21-26 42 78 65 26v26H0Z" fill="#6f8192" />
      <path d="m75 43 12 31 12 31-16-12-9 12-10-17-10 11Z" fill="#f2f5ed" opacity="0.85" />
      <path d="m123 83 12 22 9 15-12-7-8 8-9-12-7 6Z" fill="#f4f4e9" opacity="0.8" />
      <path d="m212 88 13 20 16 26-16-8-9 9-12-15-9 7Z" fill="#eef3ea" opacity="0.75" />
      <path d="m180 72 13 17 15 23-13-6-8 7-11-12-7 5Z" fill="#eef3ea" opacity="0.7" />

      {/* Valley and river */}
      <path d="M0 166c39-12 68-12 101-2 32 10 57 12 84 4 27-9 51-10 77-4 24 6 42 5 58 1v35H0Z" fill="#6c5849" />
      <path d="M0 177c52-9 88-5 128 1 40 6 73 6 110-1 34-7 60-6 82 0v23H0Z" fill={p.groundTop} />
      <path d="M119 200c18-14 31-19 44-31 10-9 15-19 20-29" fill="none" stroke="#5daeb0" strokeWidth="12" strokeLinecap="round" />
      <path d="M120 200c18-14 31-19 44-31 10-9 15-19 20-29" fill="none" stroke="#a8dcd0" strokeWidth="4" strokeLinecap="round" />

      {/* Baltit fort */}
      <g stroke="#4d3d36" strokeWidth="2" strokeLinejoin="round">
        <path d="M37 154h74v27H37Z" fill="#a47952" />
        <path d="M46 128h56v27H46Z" fill="#b78a5f" />
        <path d="M52 129V113h13v16Zm24 0v-18h12v18Zm27 0v-13h10v13Z" fill="#8f6547" />
        <path d="M46 143h56" stroke="#7b533b" strokeWidth="1.6" />
        <path d="M61 165v-8c0-4 3-7 7-7s7 3 7 7v8Zm38 0v-8c0-4 3-7 7-7s7 3 7 7v8Z" fill="#4b3b32" />
        <path d="M84 128v-10M87 118l9 2" stroke="#5b332c" strokeWidth="2" />
        <path d="M96 117l14-3v8l-14 3Z" fill={p.accent} stroke="none" />
      </g>

      {/* Apricot orchards */}
      <g stroke="#4a3a2d" strokeWidth="2.5" strokeLinecap="round">
        <path d="M258 182v-27M286 187v-31M231 188v-23" />
      </g>
      <g fill="#e6a85e" opacity="0.95">
        <circle cx="258" cy="148" r="14" />
        <circle cx="244" cy="156" r="10" />
        <circle cx="271" cy="157" r="11" />
        <circle cx="286" cy="149" r="15" />
        <circle cx="302" cy="158" r="10" />
        <circle cx="231" cy="158" r="11" />
      </g>
      <g fill="#8eaa66">
        <circle cx="252" cy="144" r="1.6" />
        <circle cx="266" cy="151" r="1.4" />
        <circle cx="282" cy="143" r="1.5" />
        <circle cx="297" cy="155" r="1.4" />
      </g>
      <g fill={p.accentSoft} opacity="0.8">
        <circle cx="153" cy="187" r="1.5" />
        <circle cx="172" cy="193" r="1.2" />
        <circle cx="116" cy="190" r="1.3" />
      </g>
    </g>
  );
}

function SkarduScene({ level }: SceneProps) {
  const p = level.palette;
  return (
    <g>
      {/* Karakoram wall */}
      <path d="M0 143 30 79l25 34 26-59 27 56 20-26 34 46 29-40 25 36 22-26 46 52 56 40v46H0Z" fill="#8494ad" />
      <path d="m81 54 13 25 12 31-17-9-10 10-11-16-8 9Z" fill="#f5f7ef" opacity="0.92" />
      <path d="m166 78 15 26 14 30-17-11-11 11-12-16-8 8Z" fill="#f2f4eb" opacity="0.86" />
      <path d="m248 68 15 24 17 22-17-5-9 10-12-13-8 8Z" fill="#eff3e9" opacity="0.9" />

      {/* Shore and lake */}
      <path d="M0 155c37-8 64-10 98-5 30 4 56 8 94 5 45-4 89-9 128-2v29H0Z" fill="#d3b88c" />
      <path d="M0 171h320v29H0Z" fill="#3f9ba4" />
      <path d="M0 174c40-4 73 4 112 2 45-3 86-6 127-2 29 3 55 0 81-4v17c-37 5-68 7-106 4-52-4-88-1-134 2-31 2-58-1-80-5Z" fill="#65c0c0" opacity="0.7" />
      <g stroke="#c9eeee" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" fill="none">
        <path d="M26 181c18-3 34-2 49 1M91 189c23-3 44-2 62 1M204 178c21-2 40 0 57 3" />
      </g>

      {/* Huts & poplars */}
      <g stroke="#4b3a36" strokeWidth="2" strokeLinejoin="round">
        <path d="M48 158h37v20H48Zm51 4h27v16H99Z" fill="#e7d1a4" />
        <path d="M44 158l23-16 22 16Z" fill="#b84c42" />
        <path d="M95 162l16-11 16 11Z" fill="#b84c42" />
        <path d="M60 178v-9c0-4 3-6 6-6s7 2 7 6v9Zm48 0v-6c0-3 2-5 5-5s5 2 5 5v6Z" fill="#503b33" />
        <path d="M55 166h8v5h-8Zm45 2h9v5h-9Z" fill="#89b7b3" stroke="none" />
      </g>
      <g>
        <path d="M234 178v-39M258 180v-47M280 179v-35" stroke="#7b5b42" strokeWidth="3" strokeLinecap="round" />
        <g fill="#7fa565" opacity="0.9">
          <ellipse cx="234" cy="137" rx="8" ry="19" />
          <ellipse cx="258" cy="130" rx="9" ry="23" />
          <ellipse cx="280" cy="141" rx="7" ry="17" />
        </g>
      </g>

      {/* Little boat */}
      <g transform="translate(135 184)">
        <path d="M0 5h35l-6 8H7Z" fill="#8d5238" stroke="#354845" strokeWidth="1.8" />
        <path d="M17 5V-8L30 3Z" fill="#fff0c9" stroke="#354845" strokeWidth="1.6" />
        <path d="M15 4v-9L5 3Z" fill="#f3dfb6" stroke="#354845" strokeWidth="1.4" />
      </g>
      <g fill={p.accentSoft} opacity="0.8">
        <circle cx="300" cy="190" r="1.5" />
        <circle cx="30" cy="193" r="1.2" />
      </g>
    </g>
  );
}

function FairyMeadowsScene({ level }: SceneProps) {
  const p = level.palette;
  return (
    <g>
      {/* Nanga Parbat */}
      <path d="M0 147 42 89l25 22 36-70 22 40 17-22 33 58 20-18 41 45 22-22 62 58v30H0Z" fill="#95acbe" />
      <path d="m103 41 19 56 15 34-22-24-13 14-15-28-10 9Z" fill="#f6f8f0" />
      <path d="m168 77 13 24 14 28-17-12-11 10-12-15-8 7Z" fill="#f4f6ed" opacity="0.85" />
      <path d="m229 96 15 20 20 27-18-8-11 10-13-13-10 8Z" fill="#f1f4ea" opacity="0.8" />
      <path d="M46 113c9-5 19-5 28-1M194 114c8-4 16-3 23 0" fill="none" stroke="#dce8df" strokeWidth="2" opacity="0.7" />

      {/* Cloud band */}
      <g fill="#fffdf4" opacity="0.72">
        <path d="M7 123c11-12 25-11 34 0 8-8 23-8 31 1 8-4 15 0 19 8H7Z" />
        <path d="M214 121c9-10 21-10 29-1 7-7 19-6 25 2 7-3 13 0 16 6h-70Z" opacity="0.6" />
      </g>

      {/* Meadow layers */}
      <path d="M0 153c39-11 74-11 107-3 31 8 62 9 91 1 36-9 71-9 104 1 8 2 14 4 18 5v43H0Z" fill="#5c8a5e" />
      <path d="M0 171c34-9 64-7 95 0 32 7 62 7 94 0 39-9 79-8 115 2 7 2 12 4 16 6v21H0Z" fill={p.groundTop} />
      <path d="M0 188c48-6 90-3 132 1 54 5 102 4 154-2 12-2 23-3 34-3v16H0Z" fill={p.groundBottom} />

      {/* Cabin */}
      <g stroke="#46372f" strokeWidth="2" strokeLinejoin="round">
        <path d="M46 158h57v27H46Z" fill="#a8794e" />
        <path d="M40 158l35-25 34 25Z" fill="#6d4936" />
        <path d="M58 185v-13h13v13Z" fill="#4b352f" />
        <path d="M86 166h10v9H86Z" fill="#ffe0a2" />
        <path d="M60 146h5v-13h4v13" fill="none" stroke="#5d4433" />
        <path d="M63 133c-3-4 1-7 3-9 1 4 4 5 2 9" fill="#b7b4ad" stroke="none" />
      </g>

      {/* Tent */}
      <g stroke="#4d4032" strokeWidth="2" strokeLinejoin="round">
        <path d="M226 181l22-28 23 28Z" fill="#d8a85d" />
        <path d="M244 181l6-21 8 21Z" fill="#7a4e3b" />
        <path d="M236 181l12-17" fill="none" stroke="#f4ddb1" />
      </g>

      {/* Wildflowers */}
      <g fill="#fff3c2">
        <circle cx="20" cy="179" r="2" />
        <circle cx="37" cy="189" r="1.6" />
        <circle cx="118" cy="185" r="1.8" />
        <circle cx="154" cy="179" r="1.6" />
        <circle cx="189" cy="191" r="2" />
        <circle cx="270" cy="188" r="1.7" />
        <circle cx="300" cy="177" r="1.6" />
      </g>
      <g fill="#e58a8a">
        <circle cx="29" cy="186" r="1.5" />
        <circle cx="143" cy="191" r="1.4" />
        <circle cx="214" cy="186" r="1.6" />
        <circle cx="286" cy="193" r="1.4" />
      </g>
      <g fill="none" stroke="#e9e2b3" strokeWidth="1.5" strokeLinecap="round">
        <path d="M20 179v8M37 189v6M118 185v7M154 179v9M189 191v5M270 188v7" />
      </g>
      <g fill="#f5f2df" opacity="0.8">
        <path d="M172 156c6-8 13-11 21-10-5 8-11 12-18 13Z" />
        <circle cx="185" cy="147" r="1.3" fill={p.accent} />
      </g>
    </g>
  );
}

function PeshawarScene({ level }: SceneProps) {
  const p = level.palette;
  return (
    <g>
      {/* Dusty Gandhara ridge */}
      <path d="M0 126c40-32 72-36 108-20 42 16 78 10 112-6v76H0Z" fill="#c98d5f" />
      <path d="M0 132c30-20 62-22 92-12 36 10 68 7 98-8v60H0Z" fill="#a86b45" />

      {/* Frontier watchtower */}
      <g>
        <rect x="88" y="58" width="92" height="94" fill="#c07a45" />
        <rect x="88" y="58" width="92" height="12" fill="#e0a468" />
        <path d="M82 58h104v14H82Z" fill="#7c4a2c" />
        <path d="M94 44h80v16H94Z" fill="#e0a468" />
        <path d="M102 30h64v16H102Z" fill="#7c4a2c" />
        <rect x="130" y="20" width="6" height="18" fill={p.accent} />
        <path d="M133 20l12-5v12z" fill={p.accentSoft} />
        <rect x="100" y="74" width="60" height="6" fill="#7c4a2c" opacity="0.6" />
        <rect x="108" y="90" width="44" height="6" fill="#7c4a2c" opacity="0.6" />
      </g>

      {/* Date palm */}
      <g stroke={p.ink} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M252 148c8-22 12-38 12-56" />
        <path d="M252 92c-14-6-22-16-24-30" />
        <path d="M252 92c14-6 22-16 24-30" />
        <path d="M252 92c0-16-4-30-12-42" />
        <path d="M252 92c-2-16 2-30 12-42" />
      </g>

      {/* Ground */}
      <path d="M0 164c50-8 100-8 160-2v34H0Z" fill={p.groundTop} />
      <path d="M0 178c60-5 110-5 170-2v14H0Z" fill={p.groundBottom} />
      <g fill={p.accent}>
        <circle cx="60" cy="172" r="1.6" />
        <circle cx="250" cy="170" r="1.4" />
      </g>
    </g>
  );
}

function GwadarScene({ level }: SceneProps) {
  const p = level.palette;
  return (
    <g>
      {/* Arabian sea */}
      <path d="M0 132h320v68H0Z" fill="#2f8e97" />
      <path d="M0 144c26-8 50 8 77 0s49 5 76 0 48 7 76 0 53 2 91-2v14c-32 5-61-3-91 1s-50-5-76 0-51-7-77-1-52-6-76 1Z" fill="#72c1c2" opacity="0.55" />

      {/* Coastal lighthouse */}
      <g>
        <rect x="238" y="66" width="16" height="100" fill="#f0ead9" />
        <path d="M234 64h24v8H234Z" fill="#2a7f83" />
        <rect x="242" y="40" width="4" height="26" fill="#2a7f83" />
        <path d="M246 40l10-5v12z" fill={p.accent} />
        <circle cx="250" cy="38" r="3" fill="#fff3c4" />
      </g>

      {/* Beach */}
      <path d="M0 176c50-8 100-8 160-2v34H0Z" fill={p.groundTop} />
      <path d="M0 190c60-5 110-5 170-2v14H0Z" fill={p.groundBottom} />
      <g fill="#ffffff" opacity="0.5">
        <ellipse cx="90" cy="188" rx="12" ry="4" />
        <ellipse cx="200" cy="192" rx="9" ry="3.4" />
      </g>
    </g>
  );
}

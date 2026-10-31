import { useId } from 'react';

/**
 * The illustrated flight map: a hand-drawn Pakistan silhouette on a painted
 * board, with rivers, mountains, dunes, a dotted air route and a compass rose.
 * Destination pins live in `MapScreen` so they can be real, accessible buttons.
 */
export function MapArt() {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '');
  const landId = `map-land-${uid}`;
  const boardId = `map-board-${uid}`;
  const seaId = `map-sea-${uid}`;
  const clipId = `map-clip-${uid}`;
  const routeId = `map-route-${uid}`;

  return (
    <svg
      className="map-art"
      viewBox="0 0 400 430"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Illustrated map of Pakistan showing the eight flight destinations"
    >
      <defs>
        <linearGradient id={boardId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fdf5dd" />
          <stop offset="0.55" stopColor="#f7e9c5" />
          <stop offset="1" stopColor="#efddb3" />
        </linearGradient>
        <linearGradient id={landId} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#7fb182" />
          <stop offset="0.45" stopColor="#609665" />
          <stop offset="1" stopColor="#3f7853" />
        </linearGradient>
        <linearGradient id={seaId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9dade" />
          <stop offset="1" stopColor="#72bfc6" />
        </linearGradient>
        <linearGradient id={routeId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e4794f" />
          <stop offset="0.55" stopColor="#f0b448" />
          <stop offset="1" stopColor="#d85f68" />
        </linearGradient>
        <clipPath id={clipId}>
          <path d="M238 16C226 20 216 25 207 30C197 35 190 42 183 49C175 58 169 67 161 76C154 86 148 97 141 109L131 123C125 137 120 152 114 167C108 182 101 198 93 214C83 233 71 252 60 270C49 288 36 307 27 326C20 340 17 351 22 360C31 371 47 378 64 383C89 391 116 395 141 394C161 393 180 389 198 380C217 372 233 360 248 346C264 331 274 319 287 305C299 292 309 280 319 267C331 251 341 235 346 221C351 207 352 194 345 180C339 168 333 158 323 148C331 134 334 120 329 106C326 96 320 86 313 78C307 70 300 61 293 54C283 44 272 34 258 26C250 21 244 18 238 16Z" />
        </clipPath>
      </defs>

      <rect width="400" height="430" rx="18" fill={`url(#${boardId})`} />

      {/* Woven board pattern */}
      <g opacity="0.2">
        {Array.from({ length: 13 }, (_, row) =>
          Array.from({ length: 12 }, (_unused, column) => (
            <circle
              key={`${row}-${column}`}
              cx={21 + column * 32 + (row % 2) * 16}
              cy={21 + row * 32}
              r="1"
              fill="#9d8555"
            />
          )),
        )}
      </g>
      <rect
        x="7"
        y="7"
        width="386"
        height="416"
        rx="14"
        fill="none"
        stroke="#5b7f5e"
        strokeWidth="2"
        opacity="0.35"
      />
      <rect
        x="13"
        y="13"
        width="374"
        height="404"
        rx="11"
        fill="none"
        stroke="#c99a4d"
        strokeWidth="1"
        strokeDasharray="4 7"
        opacity="0.55"
      />

      {/* Sea wash behind the coast */}
      <path
        d="M16 330C43 365 86 391 139 401C186 410 222 401 253 380L271 419H19Z"
        fill={`url(#${seaId})`}
        opacity="0.5"
      />
      <g fill="none" stroke="#3c8f96" strokeWidth="1.4" opacity="0.45">
        <path d="M47 386c9-4 18-3 25 2M54 395c7-3 14-2 20 2M188 404c8-4 17-3 24 2" />
      </g>
      <text
        x="60"
        y="415"
        fill="#2f767d"
        fontSize="9"
        fontWeight="600"
        letterSpacing="1.7"
        opacity="0.65"
        style={{ fontFamily: 'Nunito, sans-serif' }}
      >
        ARABIAN SEA
      </text>

      {/* Land shadow and silhouette */}
      <path
        d="M238 16C226 20 216 25 207 30C197 35 190 42 183 49C175 58 169 67 161 76C154 86 148 97 141 109L131 123C125 137 120 152 114 167C108 182 101 198 93 214C83 233 71 252 60 270C49 288 36 307 27 326C20 340 17 351 22 360C31 371 47 378 64 383C89 391 116 395 141 394C161 393 180 389 198 380C217 372 233 360 248 346C264 331 274 319 287 305C299 292 309 280 319 267C331 251 341 235 346 221C351 207 352 194 345 180C339 168 333 158 323 148C331 134 334 120 329 106C326 96 320 86 313 78C307 70 300 61 293 54C283 44 272 34 258 26C250 21 244 18 238 16Z"
        transform="translate(5 8)"
        fill="#204d3d"
        opacity="0.16"
      />
      <path
        d="M238 16C226 20 216 25 207 30C197 35 190 42 183 49C175 58 169 67 161 76C154 86 148 97 141 109L131 123C125 137 120 152 114 167C108 182 101 198 93 214C83 233 71 252 60 270C49 288 36 307 27 326C20 340 17 351 22 360C31 371 47 378 64 383C89 391 116 395 141 394C161 393 180 389 198 380C217 372 233 360 248 346C264 331 274 319 287 305C299 292 309 280 319 267C331 251 341 235 346 221C351 207 352 194 345 180C339 168 333 158 323 148C331 134 334 120 329 106C326 96 320 86 313 78C307 70 300 61 293 54C283 44 272 34 258 26C250 21 244 18 238 16Z"
        fill={`url(#${landId})`}
        stroke="#2c5b45"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M238 16C226 20 216 25 207 30C197 35 190 42 183 49C175 58 169 67 161 76C154 86 148 97 141 109L131 123C125 137 120 152 114 167C108 182 101 198 93 214C83 233 71 252 60 270C49 288 36 307 27 326C20 340 17 351 22 360C31 371 47 378 64 383C89 391 116 395 141 394C161 393 180 389 198 380C217 372 233 360 248 346C264 331 274 319 287 305C299 292 309 280 319 267C331 251 341 235 346 221C351 207 352 194 345 180C339 168 333 158 323 148C331 134 334 120 329 106C326 96 320 86 313 78C307 70 300 61 293 54C283 44 272 34 258 26C250 21 244 18 238 16Z"
        fill="none"
        stroke="#e9d596"
        strokeWidth="1"
        strokeDasharray="2 5"
        opacity="0.6"
      />

      <g clipPath={`url(#${clipId})`}>
        {/* Soft region washes */}
        <path
          d="M197 35c27 19 48 41 61 73 12 30 9 60-5 88-15 31-37 49-68 63-27 12-46 35-54 68-8 32 4 60 22 77H60c11-27 11-50 3-68-9-20-24-31-44-44 23-29 41-57 59-86 20-32 38-63 62-90 21-24 41-47 57-82Z"
          fill="#487f59"
          opacity="0.42"
        />
        <path
          d="M260 49c24 23 42 50 45 83 2 23-8 38-17 52-11 16-19 32-16 51 2 17 12 29 27 40-14 7-26 7-36-1-13-10-18-28-16-48 2-23 14-38 16-57 2-22-7-40-14-60-5-15-8-31-4-46 2-7 8-11 15-14Z"
          fill="#9cb578"
          opacity="0.34"
        />
        <path
          d="M40 345c33 8 72 9 106 2 42-9 71-28 102-44-11 25-28 45-51 58-34 19-76 24-116 12-16-5-30-14-41-28Z"
          fill="#e5c78b"
          opacity="0.5"
        />

        {/* Province-ish hand-drawn boundaries */}
        <g fill="none" stroke="#f0dfb0" strokeWidth="1.2" strokeDasharray="4 5" opacity="0.5">
          <path d="M128 151c32 24 53 44 71 71 18 27 29 55 34 87" />
          <path d="M236 76c-2 45 4 82 23 116 17 31 27 60 22 91" />
          <path d="M86 282c34 4 63 10 89 21 27 11 51 26 77 40" />
        </g>

        {/* Indus river */}
        <path
          d="M267 82c-5 30-17 51-31 70-17 23-31 44-32 68-1 27 14 45 18 68 4 25-5 47-17 68-10 17-17 33-19 51"
          fill="none"
          stroke="#7ac1c3"
          strokeWidth="3.1"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M267 82c-5 30-17 51-31 70-17 23-31 44-32 68-1 27 14 45 18 68 4 25-5 47-17 68-10 17-17 33-19 51"
          fill="none"
          stroke="#d9f0df"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M121 152c17 25 22 49 17 72-5 21-16 38-25 60"
          fill="none"
          stroke="#7ac1c3"
          strokeWidth="1.7"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Mountains in the north */}
        <g fill="none" stroke="#f1e1b2" strokeWidth="1.6" strokeLinejoin="round" opacity="0.72">
          <path d="m177 70 11-19 11 19-7-4-4 5-4-5Z" />
          <path d="m205 54 9-16 10 16-6-3-4 4-4-4Z" />
          <path d="m231 43 8-14 9 14-6-3-3 4-4-4Z" />
          <path d="m151 94 8-14 9 14-5-3-4 4-3-4Z" />
        </g>
        {/* Dunes in the south-east */}
        <g fill="none" stroke="#e8cd92" strokeWidth="1.4" strokeLinecap="round" opacity="0.6">
          <path d="M183 326c10-5 21-5 31 0M204 339c9-4 18-4 26 0M289 320c8-4 16-4 23 0" />
        </g>
        {/* Pine ticks along the western hills */}
        <g stroke="#b4cb93" strokeWidth="1.3" strokeLinecap="round" opacity="0.55">
          <path d="m120 215 4-8 4 8M112 232l4-8 4 8M102 249l4-8 4 8M94 267l4-8 4 8" />
        </g>
      </g>

      {/* Painted air route between the eight pins */}
      <path
        d="M312 258C260 296 192 344 160 383C147 349 168 334 184 314C207 282 225 244 244 211C236 194 220 181 220 163C236 135 245 108 256 82C278 83 300 97 312 116C286 94 241 58 220 43"
        fill="none"
        stroke="#fdf5dc"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <path
        d="M312 258C260 296 192 344 160 383C147 349 168 334 184 314C207 282 225 244 244 211C236 194 220 181 220 163C236 135 245 108 256 82C278 83 300 97 312 116C286 94 241 58 220 43"
        fill="none"
        stroke={`url(#${routeId})`}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 9"
      />

      {/* A little paper plane marks the start of the journey */}
      <g transform="translate(317 250) rotate(20)" stroke="#9f4338" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M0 0 22-6 9 7 6 3Z" fill="#f4c65d" />
        <path d="M6 3 9 7" fill="none" />
      </g>

      {/* Border ornaments */}
      <g fill="none" stroke="#51805f" strokeWidth="1.4" opacity="0.5">
        <path d="M25 25c10 0 17 7 17 17M375 25c-10 0-17 7-17 17M25 405c10 0 17-7 17-17M375 405c-10 0-17-7-17-17" />
      </g>
      <g fill="#c48e3f" opacity="0.5">
        <circle cx="25" cy="25" r="2.2" />
        <circle cx="375" cy="25" r="2.2" />
        <circle cx="25" cy="405" r="2.2" />
        <circle cx="375" cy="405" r="2.2" />
      </g>

      {/* Compass rose */}
      <g transform="translate(351 372)" opacity="0.75">
        <circle r="25" fill="#fbf1d6" stroke="#548263" strokeWidth="1.4" opacity="0.9" />
        <circle r="18" fill="none" stroke="#b28b4f" strokeWidth="0.8" strokeDasharray="2 4" />
        <path d="M0-17 5-4 17 0 5 4 0 17-5 4-17 0-5-4Z" fill="#c68e3d" />
        <path d="M0-17 0 17M-17 0 17 0" stroke="#8a5c35" strokeWidth="0.6" opacity="0.6" />
        <text
          y="-29"
          textAnchor="middle"
          fill="#3e6b51"
          fontSize="9"
          fontWeight="700"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          N
        </text>
      </g>
      <g transform="translate(38 375)" opacity="0.55">
        <circle r="18" fill="#f7ebcd" stroke="#548263" strokeWidth="1" />
        <path d="M-8 4h16M-5 8h10" stroke="#548263" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M-8 0c5-8 11-8 16 0" fill="none" stroke="#c68e3d" strokeWidth="1.3" />
        <text
          y="-23"
          textAnchor="middle"
          fill="#477459"
          fontSize="7"
          fontWeight="700"
          letterSpacing="1.4"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          K2
        </text>
      </g>
    </svg>
  );
}

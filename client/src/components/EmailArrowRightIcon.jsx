import { useId } from 'react'

export function EmailArrowRightIcon({ size = 24, className = '', ...props }) {
  const maskId = useId().replace(/:/g, '_') + '_mail_mask'

  return (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      <defs>
        <mask id={maskId}>
          <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            {/* Envelope Outline */}
            <path
              strokeDasharray="66"
              d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1Z"
            >
              <animate
                attributeName="stroke-dashoffset"
                dur="2.4s"
                repeatCount="indefinite"
                values="66; 0; 0; 0; 66"
                keyTimes="0; 0.25; 0.75; 0.85; 1"
              />
            </path>

            {/* Envelope Flap */}
            <path
              strokeDasharray="24"
              d="M3 6.5l9 5.5l9 -5.5"
            >
              <animate
                attributeName="stroke-dashoffset"
                dur="2.4s"
                repeatCount="indefinite"
                values="24; 24; 0; 0; 24"
                keyTimes="0; 0.2; 0.45; 0.85; 1"
              />
            </path>
          </g>

          {/* Cutout Mask for Sending Arrow */}
          <path
            d="M19 13c3.31 0 6 2.69 6 6c0 3.31 -2.69 6 -6 6c-3.31 0 -6 -2.69 -6 -6c0 -3.31 2.69 -6 6 -6Z"
            fill="#000"
          >
            <animate
              attributeName="opacity"
              dur="2.4s"
              repeatCount="indefinite"
              values="0; 0; 1; 1; 0"
              keyTimes="0; 0.35; 0.45; 0.85; 1"
            />
          </path>
        </mask>
      </defs>

      {/* Main Mail Surface with Mask */}
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 5h16c0.55 0 1 0.45 1 1v12c0 0.55 -0.45 1 -1 1h-16c-0.55 0 -1 -0.45 -1 -1v-12c0 -0.55 0.45 -1 1 -1ZM3 6.5l9 5.5l9 -5.5"
        mask={`url(#${maskId})`}
      />

      {/* Animated Arrow */}
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        {/* Arrow Shaft */}
        <path
          strokeDasharray="8"
          d="M16 19h5"
        >
          <animate
            attributeName="stroke-dashoffset"
            dur="2.4s"
            repeatCount="indefinite"
            values="8; 8; 0; 0; 8"
            keyTimes="0; 0.42; 0.6; 0.85; 1"
          />
          <animate
            attributeName="opacity"
            dur="2.4s"
            repeatCount="indefinite"
            values="0; 0; 1; 1; 0"
            keyTimes="0; 0.4; 0.5; 0.85; 1"
          />
        </path>

        {/* Arrow Head */}
        <path
          strokeDasharray="6"
          d="M21 19l-2 2M21 19l-2 -2"
        >
          <animate
            attributeName="stroke-dashoffset"
            dur="2.4s"
            repeatCount="indefinite"
            values="6; 6; 0; 0; 6"
            keyTimes="0; 0.5; 0.68; 0.85; 1"
          />
          <animate
            attributeName="opacity"
            dur="2.4s"
            repeatCount="indefinite"
            values="0; 0; 1; 1; 0"
            keyTimes="0; 0.48; 0.58; 0.85; 1"
          />
        </path>
      </g>
    </svg>
  )
}

export default EmailArrowRightIcon

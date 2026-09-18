export function PhoneCallIcon({ size = 24, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        {/* Phone Receiver with subtle vibration ring loop */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            dur="2.2s"
            repeatCount="indefinite"
            values="0 8 16; -10 8 16; 10 8 16; -8 8 16; 8 8 16; -4 8 16; 0 8 16; 0 8 16"
            keyTimes="0; 0.06; 0.12; 0.18; 0.24; 0.30; 0.36; 1"
          />
          <path
            strokeDasharray="62"
            d="M8 3c0.5 0 2.5 4.5 2.5 5c0 1 -1.5 2 -2 3c-0.5 1 0.5 2 1.5 3c0.39 0.39 2 2 3 1.5c1 -0.5 2 -2 3 -2c0.5 0 5 2 5 2.5c0 2 -1.5 3.5 -3 4c-1.5 0.5 -2.5 0.5 -4.5 0c-2 -0.5 -3.5 -1 -6 -3.5c-2.5 -2.5 -3 -4 -3.5 -6c-0.5 -2 -0.5 -3 0 -4.5c0.5 -1.5 2 -3 4 -3Z"
          />
        </g>

        {/* Inner Calling Wave */}
        <path
          strokeDasharray="6"
          d="M15.76 8.28c-0.5 -0.51 -1.1 -0.93 -1.76 -1.24M15.76 8.28c0.49 0.49 0.9 1.08 1.2 1.72"
        >
          <animate
            attributeName="stroke-dashoffset"
            dur="2.2s"
            repeatCount="indefinite"
            values="6; 0; 0; 6; 6"
            keyTimes="0; 0.22; 0.6; 0.75; 1"
          />
          <animate
            attributeName="opacity"
            dur="2.2s"
            repeatCount="indefinite"
            values="0; 1; 1; 0; 0"
            keyTimes="0; 0.1; 0.6; 0.75; 1"
          />
        </path>

        {/* Outer Calling Wave */}
        <path
          strokeDasharray="8"
          d="M18.67 5.35c-1 -1 -2.26 -1.73 -3.67 -2.1M18.67 5.35c0.99 1 1.72 2.25 2.08 3.65"
        >
          <animate
            attributeName="stroke-dashoffset"
            dur="2.2s"
            repeatCount="indefinite"
            values="8; 8; 0; 0; 8; 8"
            keyTimes="0; 0.12; 0.38; 0.6; 0.75; 1"
          />
          <animate
            attributeName="opacity"
            dur="2.2s"
            repeatCount="indefinite"
            values="0; 0; 1; 1; 0; 0"
            keyTimes="0; 0.12; 0.28; 0.6; 0.75; 1"
          />
        </path>
      </g>
    </svg>
  )
}

export default PhoneCallIcon

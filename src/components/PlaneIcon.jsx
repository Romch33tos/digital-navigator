export default function PlaneIcon({ size = 28, color = "currentColor", variant = "stylized" }) {
  if (variant === "clean") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M28 5 4 14l8 3 2 8 4-5 6 3z"
          fill={color}
        />
        <path
          d="M12 17l-1 8 4-5"
          fill={color}
          opacity="0.6"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M28 5 4 14l8 3 2 8 4-5 6 3z"
        fill={color}
      />
      <path
        d="M12 17l-1 8 4-5"
        fill={color}
        opacity="0.6"
      />
      <path
        d="M5 27l4-6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 28l4-6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

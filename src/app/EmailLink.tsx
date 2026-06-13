"use client";

import { useState } from "react";

const EMAIL = "prakyat02@gmail.com";

export default function EmailLink({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <a href={`mailto:${EMAIL}`} className={className} style={style} onClick={handleClick}>
        {children}
      </a>
      {copied && (
        <span
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#111",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 500,
            padding: "6px 12px",
            borderRadius: "8px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          Copied email to clipboard
        </span>
      )}
    </span>
  );
}

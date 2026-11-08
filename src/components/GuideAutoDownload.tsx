"use client";

import { useEffect, useRef } from "react";

/**
 * Starts the PDF download as soon as the page opens (a click on a same-origin `download` link), and leaves the same
 * link on screen for browsers that block it, such as some in-app browsers.
 */
export default function GuideAutoDownload({
  file,
  saveAs,
  label,
  className = "",
}: {
  file: string;
  saveAs: string;
  label: string;
  className?: string;
}) {
  const link = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // a short pause so the page has painted and the visitor sees what is happening
    const t = window.setTimeout(() => link.current?.click(), 350);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <a ref={link} href={file} download={saveAs} className={`btn btn-primary justify-center touch-manipulation ${className}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
      </svg>
      {label}
    </a>
  );
}

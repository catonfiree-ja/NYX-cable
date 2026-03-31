'use client';

import { useState, useEffect } from 'react';

interface FloatingContactFABProps {
  phoneRaw?: string;
  lineUrl?: string;
}

export default function FloatingContactFAB({ phoneRaw = '021115588', lineUrl = 'https://line.me/R/ti/p/@ubb9405u' }: FloatingContactFABProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="floating-fab">
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fab-btn fab-line"
        aria-label="LINE สอบถาม"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 5.92 2 10.66c0 2.56 1.27 4.83 3.26 6.35-.12.43-.77 2.8-.8 3 0 0-.01.06.03.08.04.03.09.01.09.01.12-.02 3.47-2.27 3.93-2.59.78.12 1.6.18 2.49.18 5.52 0 10-3.92 10-8.66S17.52 2 12 2z" />
        </svg>
        <span>LINE</span>
      </a>
      <a
        href={`tel:${phoneRaw}`}
        className="fab-btn fab-call"
        aria-label="โทรหาเรา"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
        </svg>
        <span>Call</span>
      </a>
    </div>
  );
}


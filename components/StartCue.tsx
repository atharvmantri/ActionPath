'use client';

import React from 'react';

interface StartCueProps {
  cue: string;
  expanded?: boolean;
}

export default function StartCue({ cue, expanded = false }: StartCueProps) {
  const [isExpanded, setIsExpanded] = React.useState(expanded);

  return (
    <div
      className="start-cue"
      style={{
        marginTop: '8px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: 'var(--accent-cyan)',
          fontSize: '0.75rem',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '4px 0',
          transition: 'color 0.2s ease',
        }}
        aria-label="Toggle start cue"
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 0.2s ease',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span>Start here</span>
      </button>

      {isExpanded && (
        <div
          className="animate-slide-down"
          style={{
            background: 'rgba(6, 182, 212, 0.06)',
            border: '1px solid rgba(6, 182, 212, 0.15)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            marginTop: '4px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}
        >
          <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginRight: '6px' }}>First Action:</span>
          {cue}
        </div>
      )}
    </div>
  );
}

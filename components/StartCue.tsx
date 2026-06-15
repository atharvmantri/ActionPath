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
        <span style={{
          display: 'inline-block',
          transition: 'transform 0.2s ease',
          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>
          ▶
        </span>
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
          <span style={{ marginRight: '6px' }}>🎯</span>
          {cue}
        </div>
      )}
    </div>
  );
}

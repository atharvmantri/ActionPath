'use client';

import React from 'react';

interface LoadWarningProps {
  warning: string;
  collisionDays?: string[];
  suggestion?: string | null;
}

export default function LoadWarning({ warning, collisionDays = [], suggestion }: LoadWarningProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div
      className="animate-slide-down"
      style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '16px',
        position: 'relative',
      }}
    >
      <button
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '1rem',
          padding: '4px',
          lineHeight: 1,
        }}
        aria-label="Dismiss warning"
      >
        ✕
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>⚠️</span>
        <div>
          <h4 style={{
            color: 'var(--accent-amber)',
            fontSize: '0.875rem',
            fontWeight: 700,
            marginBottom: '4px',
          }}>
            Cognitive Load Warning
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>
            {warning}
          </p>
          {collisionDays.length > 0 && (
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              marginTop: '6px',
            }}>
              Collision days: {collisionDays.join(', ')}
            </p>
          )}
          {suggestion && (
            <p style={{
              color: 'var(--accent-cyan)',
              fontSize: '0.8rem',
              marginTop: '8px',
              fontStyle: 'italic',
            }}>
              💡 {suggestion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

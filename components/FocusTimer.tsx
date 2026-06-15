'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface FocusTimerProps {
  taskName: string;
  onComplete: () => void;
  onCancel: () => void;
}

export default function FocusTimer({ taskName, onComplete, onCancel }: FocusTimerProps) {
  const [seconds, setSeconds] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - seconds) / (25 * 60)) * 100;

  const handleComplete = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            handleComplete();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, seconds, handleComplete]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 90,
      animation: 'slideUp 0.3s ease',
    }}>
      <div
        className="glass-card-static"
        style={{
          padding: '20px 24px',
          minWidth: '280px',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-glow-blue)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--accent-cyan)',
          }}>
            🎯 Focus Mode
          </span>
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            ✕
          </button>
        </div>

        {/* Task name */}
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          marginBottom: '16px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {taskName}
        </p>

        {/* Timer display */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.05em',
          }}>
            {formatTime(seconds)}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          height: '4px',
          background: 'var(--bg-glass)',
          borderRadius: '2px',
          marginBottom: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))',
            borderRadius: '2px',
            transition: 'width 1s linear',
          }} />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn-secondary"
            style={{ padding: '8px 20px', fontSize: '0.8rem' }}
          >
            {isRunning ? '⏸ Pause' : '▶ Resume'}
          </button>
          <button
            onClick={handleComplete}
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.8rem' }}
          >
            <span>✓ Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}

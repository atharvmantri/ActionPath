'use client';

import React from 'react';
import type { StreakData } from '@/lib/storage';

interface StreakTrackerProps {
  streak: StreakData;
}

export default function StreakTracker({ streak }: StreakTrackerProps) {
  const milestones = [3, 7, 14, 30];
  const nextMilestone = milestones.find((m) => m > streak.current) || streak.current + 7;

  return (
    <div
      className="glass-card-static"
      style={{ padding: '16px 20px' }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontSize: '1.8rem',
            ...(streak.current >= 3 ? { animation: 'bounce-in 0.5s ease' } : {}),
          }}>
            {streak.current >= 7 ? '🔥' : streak.current >= 3 ? '⚡' : streak.current >= 1 ? '✨' : '💤'}
          </span>
          <div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}>
              {streak.current}
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              day streak
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            Best: {streak.best} days
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>
            Next milestone: {nextMilestone}
          </div>
        </div>
      </div>

      {/* Progress to next milestone */}
      <div style={{
        marginTop: '10px',
        height: '4px',
        background: 'var(--bg-glass)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min((streak.current / nextMilestone) * 100, 100)}%`,
          background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
          borderRadius: '2px',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
}

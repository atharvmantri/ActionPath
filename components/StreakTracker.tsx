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
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...(streak.current >= 3 ? { animation: 'bounce-in 0.3s ease' } : {}),
          }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={streak.current > 0 ? "rgba(255, 149, 0, 0.2)" : "none"}
              stroke={streak.current > 0 ? "var(--accent-orange)" : "var(--text-muted)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </div>
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

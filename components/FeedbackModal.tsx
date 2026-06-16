'use client';

import React, { useState } from 'react';

interface FeedbackModalProps {
  taskName: string;
  estimatedMins: number;
  onSubmit: (actualMins: number) => void;
  onClose: () => void;
}

export default function FeedbackModal({
  taskName,
  estimatedMins,
  onSubmit,
  onClose,
}: FeedbackModalProps) {
  const [actualMins, setActualMins] = useState(estimatedMins);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      animation: 'fadeIn 0.2s ease',
    }}>
      <div
        className="glass-card-static animate-scale-up"
        style={{
          padding: '24px',
          maxWidth: '420px',
          width: '90%',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-glow-blue)',
        }}
      >
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Effort Feedback Loop
        </h3>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
          You completed: <strong style={{ color: 'var(--text-primary)' }}>&ldquo;{taskName}&rdquo;</strong>
        </p>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          We estimated this would take <strong>{estimatedMins} minutes</strong>. How long did it actually take?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {/* Quick presets */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[5, 10, 15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => setActualMins(mins)}
                className={actualMins === mins ? 'btn-secondary' : 'btn-ghost'}
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 12px',
                  borderColor: actualMins === mins ? 'var(--accent-blue)' : undefined,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                }}
              >
                {mins} min
              </button>
            ))}
          </div>

          {/* Manual input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="number"
              value={actualMins}
              onChange={(e) => setActualMins(Math.max(1, parseInt(e.target.value) || 0))}
              style={{
                width: '70px',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
              min="1"
            />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>minutes</span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-ghost" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
            Skip
          </button>
          <button onClick={() => onSubmit(actualMins)} className="btn-primary" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
            <span>Save Feedback</span>
          </button>
        </div>
      </div>
    </div>
  );
}

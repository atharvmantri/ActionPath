'use client';

import React from 'react';

interface MoodCheckInProps {
  onMoodSelect: (mood: number) => void;
  selectedMood: number | null;
}

const MOODS = [
  { value: 1, emoji: '😫', label: 'Overwhelmed', taskLimit: 1 },
  { value: 2, emoji: '😔', label: 'Low energy', taskLimit: 2 },
  { value: 3, emoji: '😐', label: 'Okay', taskLimit: 3 },
  { value: 4, emoji: '🙂', label: 'Good', taskLimit: 5 },
  { value: 5, emoji: '💪', label: 'Energized', taskLimit: 999 },
];

export default function MoodCheckIn({ onMoodSelect, selectedMood }: MoodCheckInProps) {
  return (
    <div
      className="glass-card-static animate-slide-up"
      style={{ padding: '20px', marginBottom: '16px' }}
    >
      <p style={{
        fontSize: '0.85rem',
        fontWeight: 600,
        color: 'var(--text-primary)',
        marginBottom: '4px',
      }}>
        How are you feeling right now?
      </p>
      <p style={{
        fontSize: '0.7rem',
        color: 'var(--text-muted)',
        marginBottom: '14px',
      }}>
        This helps us show you the right number of tasks
      </p>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onMoodSelect(mood.value)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: `2px solid ${selectedMood === mood.value ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
              background: selectedMood === mood.value ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-glass)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: selectedMood === mood.value ? 'scale(1.05)' : 'scale(1)',
            }}
            aria-label={`Mood: ${mood.label}`}
          >
            <span style={{ fontSize: '1.5rem' }}>{mood.emoji}</span>
            <span style={{
              fontSize: '0.6rem',
              color: selectedMood === mood.value ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: 500,
            }}>
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {selectedMood && selectedMood <= 2 && (
        <p style={{
          marginTop: '12px',
          fontSize: '0.75rem',
          color: 'var(--accent-cyan)',
          textAlign: 'center',
          fontStyle: 'italic',
        }}>
          💙 We&apos;ll keep it light — only the most urgent tasks shown.
        </p>
      )}
    </div>
  );
}

export { MOODS };

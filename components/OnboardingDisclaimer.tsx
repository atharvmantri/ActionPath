'use client';

import React, { useState } from 'react';

interface OnboardingDisclaimerProps {
  onDismiss: () => void;
}

export default function OnboardingDisclaimer({ onDismiss }: OnboardingDisclaimerProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      emoji: '🎯',
      title: 'Welcome to ActionPath',
      text: 'ActionPath helps you find action items buried in school emails, LMS posts, and newsletters. Paste any school communication and get a clear, actionable checklist in seconds.',
    },
    {
      emoji: '🤖',
      title: '7 AI Agents Working For You',
      text: 'Your email passes through 7 specialized AI agents: classify, extract, score, fuse, plan, rewrite, and QA. Each one has a specific job to make sure nothing is missed.',
    },
    {
      emoji: '⚠️',
      title: 'Important: Always Verify',
      text: 'ActionPath helps you find action items, but AI can make mistakes. Always verify important deadlines directly with your teacher or school. AI recommends — you decide and act.',
    },
    {
      emoji: '🔒',
      title: 'Your Privacy Matters',
      text: 'No email content is ever stored on our servers. Everything is processed per-request and only your task completion status is saved locally in your browser.',
    },
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div
        className="glass-card-static"
        style={{
          maxWidth: '480px',
          width: '90%',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <div
          key={step}
          className="animate-fade-in"
          style={{ marginBottom: '32px' }}
        >
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>
            {steps[step].emoji}
          </span>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '12px',
          }}>
            {steps[step].title}
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            lineHeight: 1.7,
          }}>
            {steps[step].text}
          </p>
        </div>

        {/* Progress dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '24px',
        }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: i === step ? 'var(--accent-blue)' : 'var(--border-medium)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {step < steps.length - 1 ? (
            <>
              <button onClick={onDismiss} className="btn-ghost">Skip</button>
              <button onClick={() => setStep(step + 1)} className="btn-primary">
                <span>Next →</span>
              </button>
            </>
          ) : (
            <button onClick={onDismiss} className="btn-primary" style={{ padding: '12px 40px' }}>
              <span>Get Started 🚀</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

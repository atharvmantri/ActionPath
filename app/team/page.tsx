'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadTheme, saveTheme, loadAccessibility, saveAccessibility } from '@/lib/storage';

export default function TeamPage() {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  useEffect(() => {
    const access = loadAccessibility();
    setHighContrast(access.highContrast);
    setLargeText(access.largeText);
    if (access.highContrast) {
      document.documentElement.setAttribute('data-a11y-contrast', 'high');
    }
    if (access.largeText) {
      document.documentElement.setAttribute('data-a11y-size', 'large');
    }

    const savedTheme = loadTheme();
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    saveTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    saveAccessibility({ highContrast: next, largeText });
    if (next) {
      document.documentElement.setAttribute('data-a11y-contrast', 'high');
    } else {
      document.documentElement.removeAttribute('data-a11y-contrast');
    }
  };

  const toggleLargeText = () => {
    const next = !largeText;
    setLargeText(next);
    saveAccessibility({ highContrast, largeText: next });
    if (next) {
      document.documentElement.setAttribute('data-a11y-size', 'large');
    } else {
      document.documentElement.removeAttribute('data-a11y-size');
    }
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .team-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-top: 48px;
          margin-bottom: 80px;
        }
        @media (max-width: 820px) {
          .team-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
        .team-card {
          position: relative;
          padding: 40px 32px;
          border-radius: var(--radius-xl);
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          gap: 24px;
          text-align: left;
          overflow: hidden;
        }
        .team-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%);
          pointer-events: none;
        }
        .team-card:hover {
          transform: translateY(-6px);
          border-color: var(--border-medium);
          box-shadow: var(--shadow-lg);
        }
        [data-theme="dark"] .team-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(10, 132, 255, 0.05);
        }
        .team-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 2.2rem;
          color: #ffffff;
          box-shadow: var(--shadow-md);
          user-select: none;
          position: relative;
        }
        .team-avatar::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .team-btn {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .team-btn-github {
          background: var(--bg-glass);
          color: var(--text-primary);
          border: 1px solid var(--border-subtle);
        }
        .team-btn-github:hover {
          background: var(--bg-glass-hover);
          border-color: var(--border-medium);
          transform: translateY(-1px);
        }
        .team-btn-portfolio {
          background: var(--accent-blue-glow);
          color: var(--accent-blue);
          border: 1px solid var(--border-glow);
        }
        .team-btn-portfolio:hover {
          background: var(--accent-blue);
          color: #ffffff;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(10, 132, 255, 0.2);
        }
        [data-a11y-contrast="high"] .team-card {
          border: 2px solid #ffffff !important;
          box-shadow: none !important;
        }
        [data-a11y-contrast="high"] .team-avatar {
          border: 2px solid #ffffff !important;
          box-shadow: none !important;
        }
        [data-a11y-contrast="high"] .team-btn {
          border: 2px solid #ffffff !important;
          color: #ffffff !important;
          background: #000000 !important;
        }
        [data-a11y-contrast="high"] .team-btn:hover {
          background: #ffffff !important;
          color: #000000 !important;
        }
      ` }} />

      {/* Decorative Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(10, 132, 255, 0.08) 0%, rgba(134, 46, 156, 0.03) 50%, transparent 100%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '-10%',
        width: '45vw',
        height: '45vw',
        background: 'radial-gradient(circle, rgba(100, 210, 255, 0.06) 0%, rgba(52, 199, 89, 0.02) 60%, transparent 100%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(22, 22, 23, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 24px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-blue)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            <h1 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              margin: 0,
            }}>
              <span className="gradient-text">ActionPath</span>
            </h1>
          </Link>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, marginRight: '16px' }}>
              Home
            </Link>

            <button
              onClick={toggleTheme}
              className="btn-ghost"
              style={{ fontSize: '1rem', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              )}
            </button>

            {/* Accessibility Contrast */}
            <button
              onClick={toggleHighContrast}
              className="btn-ghost"
              style={{ fontSize: '0.85rem', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: highContrast ? 'var(--accent-blue)' : undefined }}
              title="Toggle High Contrast"
              aria-label="Toggle High Contrast"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10z" /></svg>
            </button>

            {/* Accessibility Large Text */}
            <button
              onClick={toggleLargeText}
              className="btn-ghost"
              style={{ fontSize: '0.85rem', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: largeText ? 'var(--accent-blue)' : undefined }}
              title="Toggle Large Text"
              aria-label="Toggle Large Text"
            >
              <span style={{ fontSize: '14px', letterSpacing: '-1px' }}>A<sup>+</sup></span>
            </button>

            <Link href="/app" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', textDecoration: 'none', marginLeft: '8px' }}>
              Launch App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px', zIndex: 1, position: 'relative' }}>

        {/* HERO SECTION */}
        <section style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-slide-up">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--accent-blue-glow)',
            border: '1px solid var(--border-glow)',
            color: 'var(--accent-blue)',
            borderRadius: '9999px',
            padding: '6px 16px',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '24px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Meet the Builders
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            marginBottom: '24px',
            color: 'var(--text-primary)',
          }}>
            The Team Behind <span style={{
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}>ActionPath</span>
          </h2>

          <p style={{
            fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            ActionPath is built with care to provide accessible planning assistance for neurodiverse students, streamlining complex syllabus schedules into bite-sized actionable steps.
          </p>
        </section>

        {/* TEAM GRID */}
        <div className="team-grid animate-slide-up" style={{ animationDelay: '0.1s' }}>

          {/* ATHARV CARD */}
          <div className="team-card">
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div className="team-avatar" style={{
                boxShadow: '0 0 20px rgba(10, 132, 255, 0.25)',
                overflow: 'hidden',
              }}>
                <img
                  src="https://www.atharv.me/assets/profile-ZmNqRCZO.jpeg"
                  alt="Atharv Mantri"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Atharv Mantri
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Co-Creator & Lead Architect
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Lead architect and engineer behind ActionPath. Specializes in building highly responsive collaborative agent architectures, client-side state engines, and designing tools that lower the cognitive friction of task management for neurodiverse minds.
            </p>

            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Focus Areas
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge badge-effort-low" style={{ background: 'rgba(10, 132, 255, 0.08)', color: 'var(--accent-blue)', fontWeight: 600 }}>Agent Orchestration</span>
                <span className="badge badge-effort-medium" style={{ background: 'rgba(255, 149, 0, 0.08)', color: 'var(--accent-orange)', fontWeight: 600 }}>Systems Engineering</span>
                <span className="badge badge-effort-high" style={{ background: 'rgba(255, 95, 0, 0.08)', color: 'var(--accent-amber)', fontWeight: 600 }}>Next.js & React</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '12px' }}>
              <a href="https://github.com/atharvmantri" target="_blank" rel="noopener noreferrer" className="team-btn team-btn-github">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </a>
              <a href="https://atharv.me" target="_blank" rel="noopener noreferrer" className="team-btn team-btn-portfolio">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                atharv.me
              </a>
            </div>
          </div>

          {/* KRISHNA CARD */}
          <div className="team-card">
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div className="team-avatar" style={{
                background: 'linear-gradient(135deg, var(--accent-orange), var(--accent-rose))',
                boxShadow: '0 0 20px rgba(255, 149, 0, 0.25)'
              }}>
                KS
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Krishna Sangahi
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-orange)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Co-Creator & Product Engineer
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              Product designer and engineer who crafted the accessible UI/UX system of ActionPath. Focuses on accessibility compliance (WCAG), interactive animations, design systems, and building seamless client integrations for external tool flows like classroom sync.
            </p>

            <div>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Focus Areas
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span className="badge badge-effort-low" style={{ background: 'rgba(52, 199, 89, 0.08)', color: 'var(--accent-emerald)', fontWeight: 600 }}>UX Architecture</span>
                <span className="badge badge-effort-medium" style={{ background: 'rgba(255, 149, 0, 0.08)', color: 'var(--accent-orange)', fontWeight: 600 }}>WCAG Compliance</span>
                <span className="badge badge-effort-high" style={{ background: 'rgba(191, 90, 242, 0.08)', color: 'var(--accent-purple)', fontWeight: 600 }}>Frontend Design</span>
                <span className="badge badge-high" style={{ fontWeight: 600, background: 'rgba(100, 210, 255, 0.08)', color: 'var(--accent-cyan)' }}>Interactive CSS</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '12px' }}>
              <a href="https://github.com/Krishna-Sangahi" target="_blank" rel="noopener noreferrer" className="team-btn team-btn-github" style={{ flex: 'none', width: '100%' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub Profile
              </a>
            </div>
          </div>

        </div>

        {/* CORE PHILOSOPHY / INFRASTRUCTURE INFO SECTION */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.03) 0%, rgba(134, 46, 156, 0.03) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 32px',
          textAlign: 'center',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '64px',
        }} className="animate-fade-in">
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', color: 'var(--text-primary)' }}>
            Our Design Philosophy
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            textAlign: 'left',
          }}>
            <div>
              <div style={{ color: 'var(--accent-purple)', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Cognitive Accessibility</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Engineered from the ground up for executive function support. Simple layouts, micro-timelines, voice features, and high contrast options lower cognitive stress.
              </p>
            </div>
            <div>
              <div style={{ color: 'var(--accent-orange)', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>Open Collaboration</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                ActionPath is 100% open-source. We welcome student developers and educators to audit, improve, and add integrations to make learning organized for everyone.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '32px 24px',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '4px 0' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
            <span>•</span>
            <Link href="/team" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Our Team</Link>
          </p>
          <p style={{ fontSize: '0.72rem' }}>
            AI-generated suggestions should be verified directly. Always cross-reference major exams and school deadlines.
          </p>
        </div>
      </footer>
    </div>
  );
}

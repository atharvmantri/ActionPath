'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadTheme, saveTheme, loadAccessibility, saveAccessibility } from '@/lib/storage';

export default function LandingPage() {
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

  const pipelineStages = [
    {
      step: '1',
      title: 'Classify',
      subtitle: 'Cognitive Load Analysis',
      desc: 'Detects school email vs. class updates, scores complexity (1-10), and routes to specialized templates.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      color: 'var(--accent-blue)',
    },
    {
      step: '2',
      title: 'Extract',
      subtitle: 'Entity Parsing',
      desc: 'Sifts through messy announcements and syllabus documents to isolate every single raw task and hidden deadline.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      color: 'var(--accent-purple)',
    },
    {
      step: '3',
      title: 'Score',
      subtitle: 'Prioritization Matrix',
      desc: 'Evaluates task weight, urgency, and estimated duration. Flag schedules with high-collision risk.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      color: 'var(--accent-orange)',
    },
    {
      step: '4',
      title: 'Fuse',
      subtitle: 'Contextual Integration',
      desc: 'Merges incoming items with your active schedule, auto-detecting duplicate course details and recurring alerts.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101" /><path d="M10.172 13.828a4 4 0 0 0 5.656 0l4-4a4 4 0 1 0-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      color: 'var(--accent-cyan)',
    },
    {
      step: '5',
      title: 'Plan',
      subtitle: 'Horizons & Budgeting',
      desc: 'Distributes tasks into Today, Tomorrow, This Week, and Later buckets, balancing your daily cognitive budget.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" />
        </svg>
      ),
      color: 'var(--accent-emerald)',
    },
    {
      step: '6',
      title: 'Rewrite',
      subtitle: 'ADHD Executive Framing',
      desc: 'Converts complex language into clear, actionable steps, adding specific start cues and micro-time goals.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
      color: 'var(--accent-rose)',
    },
    {
      step: '7',
      title: 'QA',
      subtitle: 'Sanity Checker',
      desc: 'Validates that deadlines are chronologically accurate, filters out fake details, and passes quality control.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      color: 'var(--accent-amber)',
    },
  ];

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', background: 'var(--bg-primary)' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-blue)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            <h1 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              margin: 0,
            }}>
              <span className="gradient-text">ActionPath</span>
            </h1>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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

            <Link href="/app" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', textDecoration: 'none' }}>
              Launch App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px', zIndex: 1, position: 'relative' }}>
        
        {/* HERO SECTION */}
        <section style={{ textAlign: 'center', marginBottom: '80px' }}>
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            Crisis-to-Action Translator
          </div>

          <h2 style={{
            fontSize: 'clamp(2.2rem, 6vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.04em',
            marginBottom: '24px',
            color: 'var(--text-primary)',
          }}>
            Turn School Chaos <br />
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}>
              into Executive Order
            </span>
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}>
            ActionPath uses seven specialized collaborative AI agents to translate complex, stressful school emails and LMS updates into clear, structured daily checklists. Designed specifically for ADHD students.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/app" className="btn-primary" style={{
              padding: '14px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 8px 30px rgba(10, 132, 255, 0.3)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              Start Planning Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>

            <a href="#how-it-works" className="btn-secondary" style={{
              padding: '14px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
              How it works
            </a>
          </div>
        </section>

        {/* INTERACTIVE DEMO SHOWCASE MOCKUP */}
        <section style={{ marginBottom: '100px' }} className="animate-slide-up">
          <div className="glass-card-static" style={{
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '24px',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}>
              {/* Left Panel: Input Simulation */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px', fontFamily: 'monospace' }}>incoming_communication.txt</span>
                </div>
                <div style={{
                  background: 'var(--bg-glass)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem',
                  lineHeight: 1.5,
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Subject: Urgent Announcement: AP Biology Field Trip Forms</strong><br /><br />
                  Reminder that permission slips for the Wetland Preserve field trip next week must be handed in to Ms. Rivera in Room 204 by Wednesday. Also, we will be collecting the $15 supply fee for the frog dissection lab unit starting Thursday. This must be paid online. Please read Chapter 14 of the Campbell textbook before the lab classes start.
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  paddingTop: '12px',
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cognitive load: Very High</span>
                  <div style={{
                    background: 'var(--accent-blue-glow)',
                    color: 'var(--accent-blue)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    Translating...
                  </div>
                </div>
              </div>

              {/* Right Panel: Output Checklist Simulation */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-blue)' }}>Action Checklist</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>3 tasks extracted</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Task Card 1 */}
                  <div className="glass-card-static" style={{ padding: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start', borderLeft: '3px solid var(--accent-blue)' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid var(--accent-blue)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--accent-blue)', fontWeight: 700 }}>Biology</span>
                        <span className="badge" style={{ background: 'rgba(255, 149, 0, 0.1)', color: 'var(--accent-orange)', fontSize: '0.6rem', padding: '0px 4px' }}>Wednesday</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                        Get permission slip signed for Wetland Preserve field trip and drop it in Room 204.
                      </p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        💡 Ms. Rivera needs the physical slip. Start by printing it tonight.
                      </p>
                    </div>
                  </div>

                  {/* Task Card 2 */}
                  <div className="glass-card-static" style={{ padding: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start', borderLeft: '3px solid var(--accent-purple)' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid var(--border-subtle)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--accent-purple)', fontWeight: 700 }}>Biology</span>
                        <span className="badge" style={{ background: 'rgba(52, 199, 89, 0.1)', color: 'var(--accent-emerald)', fontSize: '0.6rem', padding: '0px 4px' }}>Thursday</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                        Pay $15 dissection lab supply fee on the student web portal.
                      </p>
                    </div>
                  </div>

                  {/* Task Card 3 */}
                  <div className="glass-card-static" style={{ padding: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start', borderLeft: '3px solid var(--accent-cyan)' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid var(--border-subtle)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>Biology</span>
                        <span className="badge" style={{ background: 'rgba(255, 149, 0, 0.1)', color: 'var(--accent-orange)', fontSize: '0.6rem', padding: '0px 4px' }}>Study Horizon</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px' }}>
                        Read Chapter 14 of the Campbell textbook before the dissection lab.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7-STAGE PIPELINE ARCHITECTURE CARD GRID */}
        <section id="how-it-works" style={{ marginBottom: '100px', scrollMarginTop: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Powered by 7 Collaborative AI Agents
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '8px auto 0' }}>
              Unlike simple models, ActionPath orchestrates a chain of specialized agents, each checking and optimizing the output.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}>
            {pipelineStages.map((stage) => (
              <div
                key={stage.title}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  position: 'relative',
                  background: 'var(--bg-secondary)',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  opacity: 0.04,
                  lineHeight: 1,
                  fontFamily: 'monospace',
                }}>
                  0{stage.step}
                </div>

                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${stage.color}15`,
                  color: stage.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px',
                }}>
                  {stage.icon}
                </div>

                <div>
                  <h4 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}>
                    {stage.title}
                  </h4>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: stage.color,
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                  }}>
                    {stage.subtitle}
                  </span>
                </div>

                <p style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}>
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CORE FEATURES LIST */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Built to Support Executive Function
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Features engineered for ADHD and cognitive support.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            {/* Feature 1 */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--accent-blue)', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Voice Input Processor</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Bypass typing anxiety. Dictate syllabus items, homework lists, or general reminders and let our voice parser break them down.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--accent-purple)', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Classroom OAuth Sync</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Directly connect to Google Classroom coursework streams. Pull due dates, descriptions, and updates in one unified dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--accent-orange)', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Auto-Forwarding Inbox</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Configure your inbound address. Forward school emails to see them immediately turn into structured calendar items.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Parent & Counselor Share</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Share custom read-only URLs to counselors or parents. Keep support systems updated on your plans without any data logs.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA CALLOUT */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.05) 0%, rgba(134, 46, 156, 0.05) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 24px',
          textAlign: 'center',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '64px',
        }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>Ready to conquer your assignments?</h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 28px', lineHeight: 1.5 }}>
            No accounts. No server-side tracking. Your data stays entirely in your browser storage. 100% free and open-source.
          </p>
          <Link href="/app" className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem', fontWeight: 600, borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
            Open Planner
          </Link>
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
          <p>
            <strong>ActionPath</strong> — Designed with privacy by design. All computations are handled locally.
          </p>
          <p style={{ fontSize: '0.72rem' }}>
            AI-generated suggestions should be verified directly. Always cross-reference major exams and school deadlines.
          </p>
        </div>
      </footer>
    </div>
  );
}

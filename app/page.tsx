'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadTheme, saveTheme, loadAccessibility, saveAccessibility } from '@/lib/storage';

// Premium SVG Icons (Replacing Emojis)
const MailIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);

const CalendarIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></svg>
);

const BrainIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /><path d="M12 5v14" /></svg>
);

const WarningIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
);

const XCircleIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
);

const CheckCircleIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
);

const GraduationCapIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" /></svg>
);

const RocketIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5" /><path d="M12 2C6.5 2 2 6.5 2 12c0 2.5 2 4 4.5 4.5.5-1.5 1.5-3 3.5-3.5 1.5-.5 3-.5 4.5 0 2 .5 3.5 1.5 3.5 3.5 2.5-.5 4.5-2 4.5-4.5C22 6.5 17.5 2 12 2Z" /><path d="M9 15c-1.5-1.5-2.5-3-2.5-3" /><path d="M15 9c1.5 1.5 3 2.5 3 2.5" /></svg>
);

const AlertTriangleIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
);

const ShieldCheckIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 11 2 2 4-4" /></svg>
);

const UserCheckIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></svg>
);

const PuzzleIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /><path d="M15 3v18" /><path d="M3 9h18" /><path d="M3 15h18" /></svg>
);

const ZapIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);

const SearchIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

const ClockIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);

const CpuIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><rect width="16" height="16" x="4" y="4" rx="2" /><path d="M9 9h6v6H9z" /><path d="M9 1v3" /><path d="M15 1v3" /><path d="M9 20v3" /><path d="M15 20v3" /><path d="M20 9h3" /><path d="M20 15h3" /><path d="M1 9h3" /><path d="M1 15h3" /></svg>
);

const ClipboardListIcon = ({ size = 18, className = '' }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M9 9h6" /><path d="M9 13h6" /><path d="M9 17h6" /></svg>
);

interface Stage {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

const HorizontalArrow = ({ isActive, color }: { isActive: boolean; color: string }) => (
  <div
    className={`pipeline-arrow-horizontal ${isActive ? 'active' : ''}`}
    style={isActive ? { color } : undefined}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  </div>
);

const VerticalArrow = ({ isActive, color }: { isActive: boolean; color: string }) => (
  <div
    className={`pipeline-arrow-vertical ${isActive ? 'active' : ''}`}
    style={isActive ? { color } : undefined}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </svg>
  </div>
);

const ReturnArrow = ({ isActive }: { isActive: boolean }) => (
  <div
    className={`pipeline-arrow-return ${isActive ? 'active' : ''}`}
    style={isActive ? { color: 'var(--accent-emerald)' } : undefined}
  >
    <svg width="100" height="80" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
      <path
        d="M 10 20 C 90 20, 90 60, -30 60"
        strokeDasharray={isActive ? 'none' : '4 4'}
        style={{
          transition: 'stroke-dasharray 0.3s ease',
        }}
      />
      <polygon
        points="-20 54, -32 60, -20 66"
        fill="currentColor"
      />
    </svg>
  </div>
);

function PipelineCard({
  stage,
  index,
  activeAgentIndex,
}: {
  stage: Stage;
  index: number;
  activeAgentIndex: number;
}) {
  const isActive = activeAgentIndex === index;
  const isQA = index === 6;

  return (
    <div
      className={`pipeline-card stagger-card ${isQA ? 'qa-stage-special' : ''} ${isActive ? 'active-stage' : ''}`}
      style={{
        borderColor: isActive ? stage.color : isQA ? 'var(--accent-amber)' : 'var(--border-subtle)',
        boxShadow: isActive
          ? `0 0 25px ${stage.color}40`
          : isQA
            ? '0 0 20px rgba(255, 159, 10, 0.15)'
            : 'var(--shadow-sm)',
        transform: isActive
          ? 'translateY(-6px) scale(1.025)'
          : isQA
            ? 'translateY(0) scale(1.01)'
            : undefined,
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {isQA && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '24px',
          border: '1px solid var(--accent-amber)',
          background: 'rgba(255, 159, 10, 0.08)',
          color: 'var(--accent-amber)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          padding: '2px 8px',
          borderRadius: '9999px',
          boxShadow: '0 2px 8px rgba(255, 159, 10, 0.05)',
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}>
          Final Verification Stage
        </div>
      )}

      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        fontSize: '0.7rem',
        fontWeight: 600,
        fontFamily: 'monospace',
        color: 'var(--text-muted)',
        letterSpacing: '0.05em',
      }}>
        [0{stage.step} / 07]
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
        transition: 'all 0.3s ease',
        transform: isActive ? 'scale(1.1)' : undefined,
        boxShadow: isActive ? `0 0 10px ${stage.color}33` : undefined,
      }}>
        {stage.icon}
      </div>

      <div>
        <h4 style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          margin: 0,
        }}>
          {stage.title}
        </h4>
        <span style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color: stage.color,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          display: 'block',
          marginTop: '2px',
        }}>
          {stage.subtitle}
        </span>
      </div>

      <p style={{
        fontSize: '0.82rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        margin: '8px 0 0',
      }}>
        {stage.desc}
      </p>
    </div>
  );
}

export default function LandingPage() {
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [activeAgentIndex, setActiveAgentIndex] = useState(0);
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgentIndex((prev) => (prev + 1) % 7);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

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
            <Link href="/team" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, marginRight: '16px' }}>
              Our Team
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

            <Link href="/app" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', textDecoration: 'none' }}>
              Launch App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 24px', zIndex: 1, position: 'relative' }}>

        {/* ================================================================
            SECTION 1: HERO
            ================================================================ */}
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
            ActionPath helps ADHD students transform overwhelming school communications into clear deadlines, prioritized tasks, and actionable next steps.
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
              Try ActionPath
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </Link>

            <a href="#the-problem" className="btn-secondary" style={{
              padding: '14px 32px',
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}>
              See the Problem
            </a>
          </div>
        </section>

        {/* ================================================================
            SECTION 2: WHY STUDENTS MISS DEADLINES (Before/After)
            ================================================================ */}
        <section id="the-problem" style={{ scrollMarginTop: '80px' }}>
          <div className="section-heading">
            <h3>Why Students Miss Deadlines</h3>
            <p>The gap between receiving information and taking action is where students with ADHD struggle most.</p>
          </div>

          <div className="before-after-section" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {/* BEFORE */}
            <div className="before-after-card before-card">
              <span className="before-after-label before-label">Before ActionPath</span>
              <div className="before-after-item">
                <span className="item-icon" style={{ color: 'var(--accent-rose)' }}><MailIcon /></span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Dense communication</span>
              </div>
              <div className="before-after-item">
                <span className="item-icon" style={{ color: 'var(--accent-rose)' }}><CalendarIcon /></span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Hidden deadlines</span>
              </div>
              <div className="before-after-item">
                <span className="item-icon" style={{ color: 'var(--accent-rose)' }}><BrainIcon /></span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Task paralysis</span>
              </div>
            </div>

            {/* AFTER */}
            <div className="before-after-card after-card">
              <span className="before-after-label after-label">After ActionPath</span>
              <div className="before-after-item">
                <span className="item-icon" style={{ color: 'var(--accent-emerald)' }}><CheckCircleIcon /></span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Clear checklist</span>
              </div>
              <div className="before-after-item">
                <span className="item-icon" style={{ color: 'var(--accent-emerald)' }}><CheckCircleIcon /></span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Visible deadlines</span>
              </div>
              <div className="before-after-item">
                <span className="item-icon" style={{ color: 'var(--accent-emerald)' }}><CheckCircleIcon /></span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Confident action</span>
              </div>
            </div>

            {/* PIPELINE METRIC */}
            <div className="before-after-card" style={{
              background: 'var(--bg-secondary)',
              borderLeft: '4px solid var(--accent-blue)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '32px',
            }}>
              <span className="before-after-label" style={{ background: 'var(--accent-blue-glow)', color: 'var(--accent-blue)' }}>Pipeline Output</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, minWidth: '24px' }}>1</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>School Email Input</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '6px', color: 'var(--text-muted)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-blue)', lineHeight: 1, minWidth: '24px' }}>3</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tasks Extracted</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '6px', color: 'var(--text-muted)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-purple)', lineHeight: 1, minWidth: '24px' }}>2</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Deadlines Identified</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '6px', color: 'var(--text-muted)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', lineHeight: 1, minWidth: '24px' }}>1</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Action Plan Generated</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 3: MEET MAYA
            ================================================================ */}
        <section className="maya-section">

          <div className="maya-card" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="maya-avatar" style={{ margin: '0', flexShrink: 0 }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Meet Maya</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 600, margin: 0 }}>16-year-old sophomore with ADHD</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              <p>
                Maya is a 16-year-old sophomore with ADHD.
              </p>
              <p>
                Every week she receives dozens of emails, LMS updates, permission slips, fee notices, and assignment reminders.
              </p>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                The information is there. The action items are not obvious.
              </p>
              <p style={{
                paddingLeft: '16px',
                borderLeft: '3px solid var(--accent-blue)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '1.1rem',
                marginTop: '8px'
              }}>
                ActionPath was built to bridge that gap.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 4: LIVE DEMO
            ================================================================ */}
        <section style={{ marginBottom: '100px' }} className="animate-slide-up">
          <div className="section-heading">
            <h3>Live Demo</h3>
            <p>See how ActionPath transforms a real school email into an actionable checklist.</p>
          </div>

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
                        Tip: Ms. Rivera needs the physical slip. Start by printing it tonight.
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

        {/* ================================================================
            SECTION 5: HOW ACTIONPATH WORKS (5-Step Walkthrough)
            ================================================================ */}
        <section className="walkthrough-section">
          <div className="section-heading">
            <h3>How ActionPath Works</h3>
            <p>From inbox to action plan in seconds.</p>
          </div>

          <div className="walkthrough-steps">
            {[
              { num: '1', title: 'Paste Email', desc: 'Copy any school email, LMS update, or announcement.' },
              { num: '2', title: '7 AI Agents Analyze', desc: 'Specialized agents classify, extract, score, plan, and verify.' },
              { num: '3', title: 'Tasks Extracted', desc: 'Every hidden deadline and action item is surfaced.' },
              { num: '4', title: 'Weekly Plan Generated', desc: 'Tasks distributed across your week, balanced for capacity.' },
              { num: '5', title: 'Student Takes Action', desc: 'Clear start cues make beginning effortless.' },
            ].map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="walkthrough-step">
                  <div className="walkthrough-step-number">{step.num}</div>
                  <div className="walkthrough-step-content">
                    <h4>{step.title}</h4>
                    <p>{step.desc}</p>
                  </div>
                </div>
                {idx < 4 && <div className="walkthrough-connector" />}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ================================================================
            SECTION 6: ARCHITECTURE VISUALIZATION
            ================================================================ */}
        <section className="architecture-section">
          <div className="section-heading">
            <h3>System Architecture</h3>
            <p>A simplified view of how ActionPath transforms information into action.</p>
          </div>

          <div className="architecture-flow">
            {[
              { title: 'School Email', sub: 'Raw, unstructured input', highlight: false },
              { title: '7 AI Agents', sub: 'Multi-agent pipeline', highlight: true },
              { title: 'Structured JSON', sub: 'Machine-readable output', highlight: false },
              { title: 'Action Checklist', sub: 'Human-readable tasks', highlight: false },
              { title: 'Student Action', sub: 'Confidence to begin', highlight: false },
            ].map((node, idx) => (
              <React.Fragment key={node.title}>
                <div className={`architecture-node ${node.highlight ? 'node-highlight' : ''}`}>
                  <h4>{node.title}</h4>
                  <p>{node.sub}</p>
                </div>
                {idx < 4 && <div className="architecture-connector" />}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ================================================================
            SECTION 7: WHY AI?
            ================================================================ */}
        <section className="why-ai-section">
          <div className="section-heading">
            <h3>Why AI?</h3>
            <p>Traditional tools can find keywords. ActionPath understands context, urgency, and executive-function barriers.</p>
          </div>

          <div className="why-ai-grid">
            {/* Left: Capabilities */}
            <div className="why-ai-left">
              <p className="why-ai-understands-label" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>ActionPath understands:</p>

              {[
                { icon: <SearchIcon />, label: 'Context - what class, what subject, what type of task' },
                { icon: <ClockIcon />, label: 'Urgency - which deadline matters most right now' },
                { icon: <AlertTriangleIcon />, label: 'Consequences - what happens if this is missed' },
                { icon: <CalendarIcon />, label: 'Scheduling conflicts - overlapping due dates' },
                { icon: <BrainIcon />, label: 'Executive-function barriers - why starting feels hard' },
              ].map((cap) => (
                <div className="why-ai-capability" key={cap.label}>
                  <span className="cap-icon" style={{ color: 'var(--accent-blue)', display: 'inline-flex', alignItems: 'center' }}>{cap.icon}</span>
                  <span>{cap.label}</span>
                </div>
              ))}
            </div>

            {/* Right: Flow Diagram */}
            <div className="why-ai-flow">
              <div className="why-ai-flow-node">
                <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '8px', color: 'var(--accent-blue)' }}><MailIcon size={20} /></span>
                Email
              </div>
              <div className="why-ai-flow-arrow" />
              <div className="why-ai-flow-node highlight">
                <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '8px', color: 'var(--accent-purple)' }}><CpuIcon size={20} /></span>
                AI Reasoning
              </div>
              <div className="why-ai-flow-arrow" />
              <div className="why-ai-flow-node">
                <span style={{ display: 'inline-flex', alignItems: 'center', marginRight: '8px', color: 'var(--accent-emerald)' }}><ClipboardListIcon size={20} /></span>
                Action Plan
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 8: 7-STAGE PIPELINE ARCHITECTURE CARD GRID
            ================================================================ */}
        <section id="how-it-works" ref={sectionRef} style={{ marginBottom: '100px', scrollMarginTop: '80px' }}>
          <div className="section-heading">
            <h3>Powered by 7 Collaborative AI Agents</h3>
            <p>Unlike simple models, ActionPath orchestrates a chain of specialized agents, each checking and optimizing the output.</p>
          </div>

          <div className={`pipeline-showcase ${isSectionVisible ? 'animate-in' : ''}`}>
            {/* Desktop 4+3 Layout */}
            <div className="pipeline-desktop-layout">
              {/* Row 1: Classify, Extract, Score, Fuse */}
              <div className="pipeline-row">
                {pipelineStages.slice(0, 4).map((stage, idx) => (
                  <React.Fragment key={stage.title}>
                    <div className="pipeline-card-wrapper">
                      <PipelineCard stage={stage} index={idx} activeAgentIndex={activeAgentIndex} />
                      {idx < 3 && <HorizontalArrow isActive={activeAgentIndex === idx} color={stage.color} />}
                      {idx === 3 && <ReturnArrow isActive={activeAgentIndex === 3 || activeAgentIndex === 4} />}
                    </div>
                  </React.Fragment>
                ))}
              </div>

              {/* Row 2: Plan, Rewrite, QA (Centered) */}
              <div className="pipeline-row" style={{ marginTop: '16px' }}>
                {pipelineStages.slice(4, 7).map((stage, idx) => {
                  const globalIdx = idx + 4;
                  return (
                    <React.Fragment key={stage.title}>
                      <div className="pipeline-card-wrapper">
                        <PipelineCard stage={stage} index={globalIdx} activeAgentIndex={activeAgentIndex} />
                        {idx < 2 && <HorizontalArrow isActive={activeAgentIndex === globalIdx} color={stage.color} />}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Mobile Layout (Vertical Pipeline) */}
            <div className="pipeline-mobile-layout">
              {pipelineStages.map((stage, idx) => (
                <React.Fragment key={stage.title}>
                  <PipelineCard stage={stage} index={idx} activeAgentIndex={activeAgentIndex} />
                  {idx < 6 && <VerticalArrow isActive={activeAgentIndex === idx} color={stage.color} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 9: BUILT WITH RESPONSIBLE AI
            ================================================================ */}
        <section className="responsible-ai-section" style={{ marginBottom: '80px' }}>
          <div className="section-heading">
            <h3>Built with Responsible AI</h3>
            <p>Trust and transparency are foundational to ActionPath&rsquo;s design.</p>
          </div>

          <div className="responsible-ai-cards">
            {/* Risk Card */}
            <div className="rai-card risk" style={{
              background: 'rgba(255, 69, 58, 0.04)',
              borderColor: 'rgba(255, 69, 58, 0.25)',
              boxShadow: '0 4px 20px rgba(255, 69, 58, 0.05)',
            }}>
              <div className="rai-card-icon" style={{ color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangleIcon size={32} /></div>
              <h4 style={{ color: 'var(--accent-rose)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Risk</h4>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Incorrect deadline extraction
              </p>
            </div>

            {/* Mitigation Card */}
            <div className="rai-card mitigation" style={{
              background: 'rgba(10, 132, 255, 0.04)',
              borderColor: 'rgba(10, 132, 255, 0.25)',
              boxShadow: '0 4px 20px rgba(10, 132, 255, 0.05)',
            }}>
              <div className="rai-card-icon" style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShieldCheckIcon size={32} /></div>
              <h4 style={{ color: 'var(--accent-blue)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Mitigation</h4>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <li style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>Source verification</li>
                <li style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>Confidence scores</li>
                <li style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>QA review</li>
              </ul>
            </div>

            {/* Human Control Card */}
            <div className="rai-card control" style={{
              background: 'rgba(48, 209, 88, 0.04)',
              borderColor: 'rgba(48, 209, 88, 0.25)',
              boxShadow: '0 4px 20px rgba(48, 209, 88, 0.05)',
            }}>
              <div className="rai-card-icon" style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><UserCheckIcon size={32} /></div>
              <h4 style={{ color: 'var(--accent-emerald)', fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>Human Control</h4>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '8px' }}>
                Student approves every action
              </p>
              <p className="rai-emphasis" style={{ margin: 0, fontWeight: 700, color: 'var(--accent-emerald)', fontSize: '0.82rem' }}>Student remains in control.</p>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 10: TRUST & TRANSPARENCY
            ================================================================ */}
        <section style={{ marginBottom: '100px' }}>
          <div className="section-heading">
            <h3>Trust & Transparency</h3>
            <p>Every decision made by the AI is transparent, verifiable, and traceable back to the source.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            {/* Trust 1: Original Source */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-blue)' }}>
              <div style={{ color: 'var(--accent-emerald)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleIcon size={20} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Original Source</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                See exactly where each task came from.
              </p>
            </div>

            {/* Trust 2: Confidence Score */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-purple)' }}>
              <div style={{ color: 'var(--accent-emerald)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleIcon size={20} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Confidence Score</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Know which items may need review.
              </p>
            </div>

            {/* Trust 3: Verification Status */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-cyan)' }}>
              <div style={{ color: 'var(--accent-emerald)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleIcon size={20} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Verification Status</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Every task passes through QA checks.
              </p>
            </div>

            {/* Trust 4: Traceable Reasoning */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)', borderLeft: '3px solid var(--accent-orange)' }}>
              <div style={{ color: 'var(--accent-emerald)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleIcon size={20} />
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>Traceable Reasoning</h4>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Understand why a task was prioritized.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 11: CORE FEATURES (Real Differentiators)
            ================================================================ */}
        <section style={{ marginBottom: '100px' }}>
          <div className="section-heading">
            <h3>Built to Support Executive Function</h3>
            <p>Real features that exist today - not roadmap items.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
          }}>
            {/* Feature 1: Source Traceability */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--accent-blue)', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Source Traceability</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                See the exact sentence each task was extracted from. Full transparency into how the AI interpreted the source material.
              </p>
            </div>

            {/* Feature 2: Confidence Scoring */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--accent-purple)', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Confidence Scoring</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Every extracted task comes with a confidence score. Know which tasks are certain and which need manual review.
              </p>
            </div>

            {/* Feature 3: Deadline Collision Detection */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--accent-orange)', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>Deadline Collision Detection</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Catch overloaded weeks before they happen. ActionPath flags when too many deadlines cluster on the same day.
              </p>
            </div>

            {/* Feature 4: ADHD Start Cues */}
            <div className="glass-card-static" style={{ padding: '24px', background: 'var(--bg-secondary)' }}>
              <div style={{ color: 'var(--accent-emerald)', marginBottom: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>ADHD Start Cues</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Get the first physical action to begin each task. Not &ldquo;write essay&rdquo; but &ldquo;open laptop, create new doc, type title.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 12: IMPACT
            ================================================================ */}
        <section className="impact-section">
          <div className="section-heading">
            <h3>Impact</h3>
            <p>What ActionPath changes for students who struggle with executive function.</p>
          </div>

          <div className="impact-grid">
            {[
              { icon: <PuzzleIcon size={24} />, label: 'Less overwhelm' },
              { icon: <CalendarIcon size={24} />, label: 'Fewer missed deadlines' },
              { icon: <BrainIcon size={24} />, label: 'Earlier intervention' },
              { icon: <RocketIcon size={24} />, label: 'Greater independence' },
              { icon: <ZapIcon size={24} />, label: 'More confidence' },
            ].map((item) => (
              <div className="impact-item" key={item.label}>
                <div className="impact-icon" style={{ color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
                <p>{item.label}</p>
              </div>
            ))}
          </div>

          <div className="impact-scale-statement">
            <p>&ldquo;Designed for students who struggle to turn information into action.&rdquo;</p>
          </div>
        </section>

        {/* ================================================================
            SECTION 13: BOTTOM CTA
            ================================================================ */}
        <section style={{
          background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.05) 0%, rgba(134, 46, 156, 0.05) 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '48px 24px',
          textAlign: 'center',
          border: '1px solid var(--border-glow)',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '64px',
        }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>Stop missing what matters.</h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 28px', lineHeight: 1.5 }}>
            Turn school communications into action plans in seconds.
          </p>
          <Link href="/app" className="btn-primary" style={{ padding: '14px 36px', fontSize: '1rem', fontWeight: 600, borderRadius: 'var(--radius-md)', textDecoration: 'none' }}>
            Try ActionPath
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
            <strong>ActionPath</strong> - Designed with privacy by design. All computations are handled locally.
          </p>
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

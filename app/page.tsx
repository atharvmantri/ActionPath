'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { PipelineResponse, ActionTask } from '@/lib/schema';
import { mergePipelineToTasks, formatMinutes } from '@/lib/utils';
import {
  loadCompletedTasks,
  toggleTaskCompletion,
  loadStreak,
  updateStreak,
  hasSeenOnboarding,
  markOnboardingSeen,
  saveMoodEntry,
  getTodayMood,
  loadTheme,
  saveTheme,
} from '@/lib/storage';
import { downloadICS } from '@/lib/ics';

import InputArea from '@/components/InputArea';
import PipelineProgress from '@/components/PipelineProgress';
import TaskCard from '@/components/TaskCard';
import WeekView from '@/components/WeekView';
import LoadWarning from '@/components/LoadWarning';
import OnboardingDisclaimer from '@/components/OnboardingDisclaimer';
import MoodCheckIn from '@/components/MoodCheckIn';
import StreakTracker from '@/components/StreakTracker';
import FocusTimer from '@/components/FocusTimer';

type ViewMode = 'input' | 'checklist' | 'week';

export default function Home() {
  // ---- State ----
  const [viewMode, setViewMode] = useState<ViewMode>('input');
  const [pipelineResult, setPipelineResult] = useState<PipelineResponse | null>(null);
  const [tasks, setTasks] = useState<ActionTask[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showPlainLanguage, setShowPlainLanguage] = useState(true);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [streak, setStreak] = useState(loadStreak());
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mood, setMood] = useState<number | null>(null);
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');
  const [focusTask, setFocusTask] = useState<ActionTask | null>(null);

  // ---- Effects ----
  useEffect(() => {
    setCompletedIds(loadCompletedTasks());
    setStreak(loadStreak());
    setMood(getTodayMood());
    const savedTheme = loadTheme();
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    if (!hasSeenOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);

  // ---- Theme toggle ----
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    saveTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  // ---- Pipeline submission ----
  const handleSubmit = useCallback(async (text: string) => {
    setError(null);
    setCurrentStage(1);
    setViewMode('input');

    // Simulate stage progress with timers while waiting for actual result
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= 7) {
          clearInterval(stageInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    try {
      const res = await fetch('/api/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      clearInterval(stageInterval);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Pipeline failed');
      }

      const data: PipelineResponse = await res.json();
      setPipelineResult(data);

      const merged = mergePipelineToTasks(data, completedIds);
      setTasks(merged);
      setCurrentStage(8); // Complete

      // Short delay then show results
      setTimeout(() => setViewMode('checklist'), 800);
    } catch (err) {
      clearInterval(stageInterval);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCurrentStage(0);
    }
  }, [completedIds]);

  // ---- Task actions ----
  const handleToggleComplete = (taskId: string) => {
    const updated = toggleTaskCompletion(taskId);
    setCompletedIds(updated);
    setTasks((prev) =>
      prev.map((t) => (t.task_id === taskId ? { ...t, completed: !t.completed } : t))
    );

    // Check if all today tasks are done for streak
    const todayTasks = tasks.filter((t) => t.scheduled_day === 'today');
    const allTodayDone = todayTasks.every((t) =>
      t.task_id === taskId ? !t.completed : t.completed
    );
    if (allTodayDone && todayTasks.length > 0) {
      const newStreak = updateStreak();
      setStreak(newStreak);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.task_id !== taskId));
  };

  const handleEditTask = (taskId: string, newText: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.task_id === taskId ? { ...t, rewritten: newText } : t))
    );
  };

  const handleMoodSelect = (m: number) => {
    setMood(m);
    saveMoodEntry(m);
  };

  const handleExportCalendar = () => {
    downloadICS(tasks.filter((t) => !t.completed));
  };

  // ---- Mood-filtered tasks ----
  const moodLimit = mood && mood <= 2 ? (mood === 1 ? 2 : 3) : 999;
  const visibleTasks = tasks;

  // Group tasks by schedule
  const groupedTasks = {
    today: visibleTasks.filter((t) => t.scheduled_day === 'today').slice(0, moodLimit),
    tomorrow: visibleTasks.filter((t) => t.scheduled_day === 'tomorrow'),
    this_week: visibleTasks.filter((t) => t.scheduled_day === 'this_week'),
    later: visibleTasks.filter((t) => t.scheduled_day === 'later'),
  };

  const totalMinsToday = groupedTasks.today.reduce((s, t) => s + t.est_mins, 0);

  return (
    <>
      {/* Onboarding */}
      {showOnboarding && (
        <OnboardingDisclaimer
          onDismiss={() => {
            setShowOnboarding(false);
            markOnboardingSeen();
          }}
        />
      )}

      {/* Focus Timer */}
      {focusTask && (
        <FocusTimer
          taskName={focusTask.rewritten}
          onComplete={() => {
            handleToggleComplete(focusTask.task_id);
            setFocusTask(null);
          }}
          onCancel={() => setFocusTask(null)}
        />
      )}

      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-secondary)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => { setViewMode('input'); setCurrentStage(0); }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-blue)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            <h1 style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}>
              <span className="gradient-text">ActionPath</span>
            </h1>
          </div>

          {/* Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {pipelineResult && (
              <>
                <button
                  onClick={() => setViewMode('checklist')}
                  className={viewMode === 'checklist' ? 'btn-secondary' : 'btn-ghost'}
                  style={{
                    fontSize: '0.8rem',
                    padding: '8px 16px',
                    borderColor: viewMode === 'checklist' ? 'var(--accent-blue)' : undefined,
                  }}
                >
                  Checklist
                </button>
                <button
                  onClick={() => setViewMode('week')}
                  className={viewMode === 'week' ? 'btn-secondary' : 'btn-ghost'}
                  style={{
                    fontSize: '0.8rem',
                    padding: '8px 16px',
                    borderColor: viewMode === 'week' ? 'var(--accent-blue)' : undefined,
                  }}
                >
                  Week
                </button>
              </>
            )}
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
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px',
        minHeight: 'calc(100vh - 60px)',
      }}>
        {/* ==================== INPUT VIEW ==================== */}
        {viewMode === 'input' && (
          <div className="animate-fade-in">
            {/* Hero */}
            {currentStage === 0 && (
              <div style={{ textAlign: 'center', marginBottom: '40px' }} className="animate-slide-up">
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  fontWeight: 900,
                  lineHeight: 1.2,
                  marginBottom: '12px',
                  letterSpacing: '-0.03em',
                }}>
                  <span className="gradient-text">Seven AI agents</span>
                  <br />
                  <span style={{ color: 'var(--text-primary)' }}>working for you</span>
                </h2>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  maxWidth: '520px',
                  margin: '0 auto 8px',
                  lineHeight: 1.6,
                }}>
                  Paste a school email. Get an actionable checklist in seconds.
                  <br />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Built for ADHD students who deserve clarity, not chaos.
                  </span>
                </p>
              </div>
            )}

            {/* Pipeline progress */}
            {currentStage > 0 && (
              <PipelineProgress
                currentStage={currentStage}
                error={error}
              />
            )}

            {/* Input area */}
            {currentStage === 0 && (
              <InputArea
                onSubmit={handleSubmit}
                isProcessing={currentStage > 0 && currentStage <= 7}
              />
            )}

            {/* Architecture info cards */}
            {currentStage === 0 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                marginTop: '40px',
              }}
                className="stagger-children"
              >
                {[
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    ),
                    title: 'Classify',
                    desc: 'Detect type & cognitive load'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    ),
                    title: 'Extract',
                    desc: 'Find every deadline & task'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                    ),
                    title: 'Score',
                    desc: 'Rank urgency & effort'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                        <path d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101" /><path d="M10.172 13.828a4 4 0 0 0 5.656 0l4-4a4 4 0 1 0-5.656-5.656l-1.1 1.1" />
                      </svg>
                    ),
                    title: 'Fuse',
                    desc: 'Merge with context'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" />
                      </svg>
                    ),
                    title: 'Plan',
                    desc: 'Build daily action plan'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    ),
                    title: 'Rewrite',
                    desc: 'Plain text & start cues'
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    ),
                    title: 'QA',
                    desc: 'Validate everything'
                  },
                ].map((stage) => (
                  <div
                    key={stage.title}
                    className="glass-card"
                    style={{ padding: '16px', textAlign: 'center' }}
                  >
                    <div style={{ display: 'block', marginBottom: '8px', color: 'var(--accent-blue)' }}>
                      {stage.icon}
                    </div>
                    <h4 style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '4px',
                    }}>
                      {stage.title}
                    </h4>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      {stage.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== CHECKLIST VIEW ==================== */}
        {viewMode === 'checklist' && (
          <div className="animate-fade-in">
            {/* Top bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div>
                <h2 style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                }}>
                  Your Action Plan
                </h2>
                {pipelineResult && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {pipelineResult.stage_1_classify.comm_type.replace(/_/g, ' ')} •{' '}
                    Cognitive load: {pipelineResult.stage_1_classify.cognitive_load_score}/10 •{' '}
                    {tasks.length} tasks found
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {/* Plain language toggle */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}>
                  <span>Plain</span>
                  <div
                    onClick={() => setShowPlainLanguage(!showPlainLanguage)}
                    style={{
                      width: '36px',
                      height: '20px',
                      borderRadius: '10px',
                      background: showPlainLanguage
                        ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))'
                        : 'var(--bg-glass)',
                      border: '1px solid var(--border-medium)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: 'white',
                      position: 'absolute',
                      top: '1px',
                      left: showPlainLanguage ? '17px' : '1px',
                      transition: 'left 0.2s ease',
                    }} />
                  </div>
                </label>

                <button onClick={handleExportCalendar} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  Export Calendar
                </button>

                <button
                  onClick={() => { setViewMode('input'); setCurrentStage(0); setPipelineResult(null); setTasks([]); }}
                  className="btn-ghost"
                  style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  New
                </button>
              </div>
            </div>

            {/* Mood check-in */}
            <MoodCheckIn onMoodSelect={handleMoodSelect} selectedMood={mood} />

            {/* Streak tracker */}
            <div style={{ marginBottom: '16px' }}>
              <StreakTracker streak={streak} />
            </div>

            {/* Cognitive load warning */}
            {pipelineResult?.stage_5_plan.load_warning && (
              <LoadWarning
                warning={pipelineResult.stage_5_plan.load_warning}
                collisionDays={pipelineResult.stage_3_score.collision_days}
                suggestion={pipelineResult.stage_3_score.reorder_suggestion}
              />
            )}

            {/* Task groups */}
            {(['today', 'tomorrow', 'this_week', 'later'] as const).map((group) => {
              const groupTasks = groupedTasks[group];
              if (groupTasks.length === 0) return null;

              const labels = {
                today: {
                  icon: <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block' }} />,
                  label: 'Today',
                  accent: 'var(--accent-blue)'
                },
                tomorrow: {
                  icon: <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'inline-block' }} />,
                  label: 'Tomorrow',
                  accent: 'var(--accent-purple)'
                },
                this_week: {
                  icon: <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'inline-block' }} />,
                  label: 'This Week',
                  accent: 'var(--accent-cyan)'
                },
                later: {
                  icon: <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block' }} />,
                  label: 'Later',
                  accent: 'var(--text-muted)'
                },
              };

              const { icon, label, accent } = labels[group];
              const groupMins = groupTasks.reduce((s, t) => s + t.est_mins, 0);
              const completedCount = groupTasks.filter((t) => t.completed).length;

              return (
                <div key={group} style={{ marginBottom: '28px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}>
                    <h3 style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: accent,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      {icon}
                      {label}
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: 'var(--text-muted)',
                        background: 'var(--bg-glass)',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                      }}>
                        {completedCount}/{groupTasks.length}
                      </span>
                    </h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      ~{formatMinutes(groupMins)}
                    </span>
                  </div>

                  <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {groupTasks.map((task, i) => (
                      <TaskCard
                        key={task.task_id}
                        task={task}
                        showPlainLanguage={showPlainLanguage}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDeleteTask}
                        onEdit={handleEditTask}
                        index={i}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Time budget summary */}
            {tasks.length > 0 && (
              <div
                className="glass-card-static"
                style={{
                  padding: '16px 20px',
                  marginTop: '24px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Today&apos;s total: <strong style={{ color: 'var(--accent-blue)' }}>~{formatMinutes(totalMinsToday)}</strong>
                  {' • '}
                  {tasks.filter((t) => t.completed).length}/{tasks.length} tasks complete
                </p>
              </div>
            )}

            {/* Responsible AI footer */}
            <div style={{
              marginTop: '32px',
              padding: '16px',
              textAlign: 'center',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <span>AI recommends. You decide and act. Always verify important deadlines directly.</span>
              </div>
              <p style={{ marginTop: '4px' }}>No content stored on servers. Privacy by design.</p>
            </div>
          </div>
        )}

        {/* ==================== WEEK VIEW ==================== */}
        {viewMode === 'week' && (
          <div className="animate-fade-in">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <h2 style={{
                fontSize: '1.3rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
              }}>
                Week View
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleExportCalendar} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  Export Calendar
                </button>
              </div>
            </div>

            {/* Load warning */}
            {pipelineResult?.stage_5_plan.load_warning && (
              <LoadWarning
                warning={pipelineResult.stage_5_plan.load_warning}
                collisionDays={pipelineResult.stage_3_score.collision_days}
                suggestion={pipelineResult.stage_3_score.reorder_suggestion}
              />
            )}

            <WeekView
              tasks={tasks}
              collisionDays={pipelineResult?.stage_3_score.collision_days || []}
              dailyBudgets={pipelineResult?.stage_5_plan.daily_budgets || {}}
            />

            {/* Responsible AI footer */}
            <div style={{
              marginTop: '32px',
              padding: '16px',
              textAlign: 'center',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              borderTop: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <span>AI recommends. You decide and act. Always verify important deadlines directly.</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

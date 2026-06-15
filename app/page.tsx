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
        background: 'rgba(10, 14, 26, 0.85)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => { setViewMode('input'); setCurrentStage(0); }}
          >
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <h1 style={{
              fontSize: '1.1rem',
              fontWeight: 800,
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
                  ✅ Checklist
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
                  📅 Week
                </button>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="btn-ghost"
              style={{ fontSize: '1rem', padding: '8px' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
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
                  { icon: '🔍', title: 'Classify', desc: 'Detect type & cognitive load', model: 'Flash-Lite' },
                  { icon: '📋', title: 'Extract', desc: 'Find every deadline & task', model: 'Pro' },
                  { icon: '⚖️', title: 'Score', desc: 'Rank urgency & effort', model: 'Flash' },
                  { icon: '🔗', title: 'Fuse', desc: 'Merge with your context', model: 'Flash-Lite' },
                  { icon: '📅', title: 'Plan', desc: 'Build daily action plan', model: 'Flash' },
                  { icon: '✏️', title: 'Rewrite', desc: 'Plain language + start cues', model: 'Flash' },
                  { icon: '✅', title: 'QA', desc: 'Validate everything', model: 'Flash-Lite' },
                ].map((stage) => (
                  <div
                    key={stage.title}
                    className="glass-card"
                    style={{ padding: '16px', textAlign: 'center' }}
                  >
                    <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '8px' }}>
                      {stage.icon}
                    </span>
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
                    <span style={{
                      fontSize: '0.6rem',
                      color: 'var(--accent-cyan)',
                      fontFamily: 'monospace',
                    }}>
                      {stage.model}
                    </span>
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

                <button onClick={handleExportCalendar} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                  📅 Export Calendar
                </button>

                <button
                  onClick={() => { setViewMode('input'); setCurrentStage(0); setPipelineResult(null); setTasks([]); }}
                  className="btn-ghost"
                  style={{ fontSize: '0.8rem' }}
                >
                  + New
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
                today: { icon: '🎯', label: 'Today', accent: 'var(--accent-blue)' },
                tomorrow: { icon: '📌', label: 'Tomorrow', accent: 'var(--accent-purple)' },
                this_week: { icon: '📋', label: 'This Week', accent: 'var(--accent-cyan)' },
                later: { icon: '📦', label: 'Later', accent: 'var(--text-muted)' },
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
                      gap: '6px',
                    }}>
                      <span>{icon}</span>
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
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      ⏱ ~{formatMinutes(groupMins)}
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
              <p>⚠️ AI recommends. You decide and act. Always verify important deadlines directly.</p>
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
                📅 Week View
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleExportCalendar} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px' }}>
                  📅 Export Calendar
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
              <p>⚠️ AI recommends. You decide and act. Always verify important deadlines directly.</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

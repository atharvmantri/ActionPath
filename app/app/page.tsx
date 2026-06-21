'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  saveEffortFeedback,
  loadAccessibility,
  saveAccessibility,
} from '@/lib/storage';
import { downloadICS } from '@/lib/ics';
import { serializeTasks } from '@/lib/share';

import InputArea from '@/components/InputArea';
import PipelineProgress from '@/components/PipelineProgress';
import TaskCard from '@/components/TaskCard';
import WeekView from '@/components/WeekView';
import LoadWarning from '@/components/LoadWarning';
import OnboardingDisclaimer from '@/components/OnboardingDisclaimer';
import MoodCheckIn from '@/components/MoodCheckIn';
import StreakTracker from '@/components/StreakTracker';
import FocusTimer from '@/components/FocusTimer';
import FeedbackModal from '@/components/FeedbackModal';

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
  const [feedbackTask, setFeedbackTask] = useState<ActionTask | null>(null);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);


  // ---- Effects ----
  useEffect(() => {
    // Load local state
    setCompletedIds(loadCompletedTasks());
    setStreak(loadStreak());
    setMood(getTodayMood());

    const localTasks = localStorage.getItem('actionpath_tasks');
    if (localTasks) {
      const parsed = JSON.parse(localTasks);
      setTasks(parsed);
      if (parsed.length > 0) {
        setViewMode('checklist');
      }
    }
    const localResult = localStorage.getItem('actionpath_last_result');
    if (localResult) {
      setPipelineResult(JSON.parse(localResult));
    }

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
    if (!hasSeenOnboarding()) {
      setShowOnboarding(true);
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('SW registered:', reg.scope);
      }).catch((err) => {
        console.warn('SW registration failed:', err);
      });
    }

    // Request Notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, []);

  // Save tasks & result to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('actionpath_tasks', JSON.stringify(tasks));
    } else {
      localStorage.removeItem('actionpath_tasks');
    }
  }, [tasks]);

  useEffect(() => {
    if (pipelineResult) {
      localStorage.setItem('actionpath_last_result', JSON.stringify(pipelineResult));
    } else {
      localStorage.removeItem('actionpath_last_result');
    }
  }, [pipelineResult]);

  // ---- Local Reminders ----
  useEffect(() => {
    if (tasks.length === 0) return;

    const dueToday = tasks.filter((t) => !t.completed && t.scheduled_day === 'today');
    if (dueToday.length > 0 && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      const lastAlert = sessionStorage.getItem('actionpath_last_alert');
      const todayStr = new Date().toISOString().split('T')[0];
      if (lastAlert !== todayStr) {
        new Notification('ActionPath: Daily Deadlines', {
          body: `You have ${dueToday.length} task(s) scheduled for today. First up: "${dueToday[0].rewritten}".`,
          icon: '/favicon.ico',
        });
        sessionStorage.setItem('actionpath_last_alert', todayStr);
      }
    }
  }, [tasks]);

  // ---- Theme toggle ----
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

  // ---- Pipeline submission ----
  const handleSubmit = useCallback(async (textOrTexts: string | string[]) => {
    setError(null);
    setCurrentStage(1);
    setViewMode('input');

    const isBatch = Array.isArray(textOrTexts);
    const texts = isBatch ? textOrTexts : [textOrTexts];

    // Simulate stage progress with timers while waiting for actual result
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= 7) {
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    try {
      // Process all communications in parallel
      const pipelinePromises = texts.map(async (inputText) => {
        const res = await fetch('/api/pipeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: inputText, studentContext: { completed_task_ids: completedIds } }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Pipeline failed');
        }

        return (await res.json()) as PipelineResponse;
      });

      const results = await Promise.all(pipelinePromises);
      clearInterval(stageInterval);

      if (results.length === 1) {
        // Single file processing
        const data = results[0];
        setPipelineResult(data);
        const merged = mergePipelineToTasks(data, completedIds);
        setTasks(merged);
      } else {
        // Batch processing - merge results
        const combinedResult: PipelineResponse = {
          pipeline_version: '2.0',
          processed_at: new Date().toISOString(),
          stage_1_classify: {
            comm_type: 'general_update',
            cognitive_load_score: Math.round((results.reduce((s, r) => s + r.stage_1_classify.cognitive_load_score, 0) / results.length) * 10) / 10,
            word_count: results.reduce((s, r) => s + r.stage_1_classify.word_count, 0),
            action_density: results.reduce((s, r) => s + r.stage_1_classify.action_density, 0) / results.length,
            routing_template: 'BATCH_V2',
            language_complexity: 'medium',
            model: 'gemini-3.1-flash-lite',
          },
          stage_2_extract: { items: [], model: 'gemini-3.1-flash-lite' },
          stage_3_score: { scored_items: [], collision_days: [], reorder_suggestion: null, model: 'gemini-3.1-flash-lite' },
          stage_4_fuse: { merged_items: [], deduplicated: [], recurring_detected: false, student_subject_match: {}, model: 'gemini-3.1-flash-lite' },
          stage_5_plan: { plan: { today: [], tomorrow: [], this_week: [], later: [] }, daily_budgets: {}, load_warning: null, model: 'gemini-3.1-flash-lite' },
          stage_6_rewrite: { rewritten_items: [], model: 'gemini-3.1-flash-lite' },
          stage_7_qa: { qa_passed: true, qa_issues: [], model: 'gemini-3.1-flash-lite' },
        };

        const collisionDaysSet = new Set<string>();
        const dailyBudgets: Record<string, number> = {};

        results.forEach((res, batchIdx) => {
          const suffix = `_b${batchIdx}`;

          // Stage 2 Extracted Items
          res.stage_2_extract.items.forEach((item) => {
            combinedResult.stage_2_extract.items.push({
              ...item,
              task_id: `${item.task_id}${suffix}`,
            });
          });

          // Stage 3 Scored Items
          res.stage_3_score.scored_items.forEach((score) => {
            combinedResult.stage_3_score.scored_items.push({
              ...score,
              task_id: `${score.task_id}${suffix}`,
              dependency: score.dependency ? `${score.dependency}${suffix}` : null,
            });
          });
          res.stage_3_score.collision_days.forEach((d) => collisionDaysSet.add(d));

          // Stage 4 Fusion Merged Items
          res.stage_4_fuse.merged_items.forEach((item) => {
            combinedResult.stage_4_fuse.merged_items.push({
              ...item,
              task_id: `${item.task_id}${suffix}`,
            });
          });
          if (res.stage_4_fuse.recurring_detected) {
            combinedResult.stage_4_fuse.recurring_detected = true;
          }

          // Stage 5 Planning Horizons
          const planHorizons = ['today', 'tomorrow', 'this_week', 'later'] as const;
          planHorizons.forEach((h) => {
            if (res.stage_5_plan.plan[h]) {
              res.stage_5_plan.plan[h].forEach((pTask) => {
                combinedResult.stage_5_plan.plan[h].push({
                  task_id: `${pTask.task_id}${suffix}`,
                  est_mins: pTask.est_mins,
                });
              });
            }
          });

          // Daily Budgets aggregation
          Object.entries(res.stage_5_plan.daily_budgets).forEach(([day, mins]) => {
            dailyBudgets[day] = (dailyBudgets[day] || 0) + mins;
          });

          // Stage 6 Rewriter items
          res.stage_6_rewrite.rewritten_items.forEach((rewritten) => {
            combinedResult.stage_6_rewrite.rewritten_items.push({
              ...rewritten,
              task_id: `${rewritten.task_id}${suffix}`,
            });
          });

          // Stage 7 QA Validation
          if (!res.stage_7_qa.qa_passed) {
            combinedResult.stage_7_qa.qa_passed = false;
            res.stage_7_qa.qa_issues.forEach((issue) => {
              combinedResult.stage_7_qa.qa_issues.push({
                ...issue,
                task_id: `${issue.task_id}${suffix}`,
              });
            });
          }
        });

        combinedResult.stage_3_score.collision_days = Array.from(collisionDaysSet);
        combinedResult.stage_5_plan.daily_budgets = dailyBudgets;

        // Perform batch cross-file deduplication
        const uniqueTasks: typeof combinedResult.stage_2_extract.items = [];
        const seenText = new Set<string>();
        combinedResult.stage_2_extract.items.forEach((item) => {
          const rewrite = combinedResult.stage_6_rewrite.rewritten_items.find((r) => r.task_id === item.task_id);
          const textToCompare = (rewrite?.rewritten || item.task).toLowerCase().trim();
          if (!seenText.has(textToCompare)) {
            seenText.add(textToCompare);
            uniqueTasks.push(item);
          } else {
            // Remove from plan so it doesn't render
            const planHorizons = ['today', 'tomorrow', 'this_week', 'later'] as const;
            planHorizons.forEach((h) => {
              combinedResult.stage_5_plan.plan[h] = combinedResult.stage_5_plan.plan[h].filter((p) => p.task_id !== item.task_id);
            });
            combinedResult.stage_4_fuse.deduplicated.push(`${item.task_id} duplicate skipped`);
          }
        });
        combinedResult.stage_2_extract.items = uniqueTasks;

        setPipelineResult(combinedResult);
        const merged = mergePipelineToTasks(combinedResult, completedIds);
        setTasks(merged);
      }

      setCurrentStage(8); // Complete
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

    // Trigger effort feedback loop if completing the task
    const task = tasks.find((t) => t.task_id === taskId);
    if (task && !task.completed) {
      setFeedbackTask(task);
    }
  };

  const handleFeedbackSubmit = (actualMins: number) => {
    if (feedbackTask) {
      saveEffortFeedback({
        task: feedbackTask.rewritten,
        estimated_mins: feedbackTask.est_mins,
        actual_mins: actualMins,
        submitted_at: new Date().toISOString(),
      });
      setFeedbackTask(null);
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

  const handleSharePlan = () => {
    const serialized = serializeTasks(tasks);
    const shareUrl = `${window.location.origin}/share?data=${serialized}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Shareable link copied to clipboard!');
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

      {/* Effort Feedback Loop */}
      {feedbackTask && (
        <FeedbackModal
          taskName={feedbackTask.rewritten}
          estimatedMins={feedbackTask.est_mins}
          onSubmit={handleFeedbackSubmit}
          onClose={() => setFeedbackTask(null)}
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
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', textDecoration: 'none' }}>
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

          {/* Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {(pipelineResult || tasks.length > 0) && (
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
                  <span className="gradient-text">Simplify School Chaos</span>
                  <br />
                  <span style={{ color: 'var(--text-primary)' }}>into Actionable Steps</span>
                </h2>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1rem',
                  maxWidth: '520px',
                  margin: '0 auto 8px',
                  lineHeight: 1.6,
                }}>
                  Paste a school email, LMS post, or newsletter. ActionPath extracts deadlines, ranks them, and maps your daily checklist.
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

                <button onClick={handleSharePlan} className="btn-secondary" style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  Share Plan
                </button>

                <button
                  onClick={() => { setViewMode('input'); setCurrentStage(0); setPipelineResult(null); }}
                  className="btn-ghost"
                  style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Add another email or task source"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  Add More
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all tasks from your planner?')) {
                      setTasks([]);
                      setPipelineResult(null);
                      setViewMode('input');
                      setCurrentStage(0);
                      localStorage.removeItem('actionpath_tasks');
                    }
                  }}
                  className="btn-ghost"
                  style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-rose)' }}
                  title="Clear all planner tasks"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  Clear All
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
                        onStartFocus={setFocusTask}
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

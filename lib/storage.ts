// ============================================================
// ActionPath - localStorage Helpers
// Privacy by design: only task completion state stored, never content
// ============================================================

import { StudentContext, ActionTask, EffortFeedback } from './schema';

const KEYS = {
  COMPLETED_TASKS: 'actionpath_completed_tasks',
  STUDENT_CONTEXT: 'actionpath_student_context',
  STREAK: 'actionpath_streak',
  MOOD_HISTORY: 'actionpath_mood_history',
  THEME: 'actionpath_theme',
  ONBOARDING_SEEN: 'actionpath_onboarding_seen',
  LAST_PIPELINE_RESULT: 'actionpath_last_result',
  EFFORT_FEEDBACK: 'actionpath_effort_feedback',
} as const;

// ---- Helpers ----
function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable - fail silently
  }
}

// ---- Completed Tasks ----
export function loadCompletedTasks(): string[] {
  return safeGet<string[]>(KEYS.COMPLETED_TASKS, []);
}

export function saveCompletedTasks(taskIds: string[]): void {
  safeSet(KEYS.COMPLETED_TASKS, taskIds);
}

export function toggleTaskCompletion(taskId: string): string[] {
  const completed = loadCompletedTasks();
  const idx = completed.indexOf(taskId);
  if (idx >= 0) {
    completed.splice(idx, 1);
  } else {
    completed.push(taskId);
  }
  saveCompletedTasks(completed);
  return completed;
}

// ---- Student Context ----
export function loadStudentContext(): StudentContext {
  return safeGet<StudentContext>(KEYS.STUDENT_CONTEXT, {
    completed_task_ids: [],
    known_subjects: [],
    busy_days: [],
    preferred_working_times: null,
    past_tasks: [],
  });
}

export function saveStudentContext(ctx: StudentContext): void {
  safeSet(KEYS.STUDENT_CONTEXT, ctx);
}

export function updateStudentContextFromTasks(tasks: ActionTask[]): void {
  const ctx = loadStudentContext();
  const subjects = new Set(ctx.known_subjects);
  tasks.forEach((t) => {
    if (t.subject) subjects.add(t.subject);
  });
  ctx.known_subjects = Array.from(subjects);
  saveStudentContext(ctx);
}

// ---- Streak ----
export interface StreakData {
  current: number;
  lastCompletedDate: string | null; // ISO date string
  best: number;
}

export function loadStreak(): StreakData {
  return safeGet<StreakData>(KEYS.STREAK, {
    current: 0,
    lastCompletedDate: null,
    best: 0,
  });
}

export function saveStreak(streak: StreakData): void {
  safeSet(KEYS.STREAK, streak);
}

export function updateStreak(): StreakData {
  const streak = loadStreak();
  const today = new Date().toISOString().split('T')[0];

  if (streak.lastCompletedDate === today) {
    return streak; // Already counted today
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (streak.lastCompletedDate === yesterday) {
    streak.current += 1;
  } else {
    streak.current = 1;
  }

  streak.lastCompletedDate = today;
  streak.best = Math.max(streak.best, streak.current);
  saveStreak(streak);
  return streak;
}

// ---- Mood History ----
export interface MoodEntry {
  date: string;
  mood: number; // 1–5
}

export function loadMoodHistory(): MoodEntry[] {
  return safeGet<MoodEntry[]>(KEYS.MOOD_HISTORY, []);
}

export function saveMoodEntry(mood: number): void {
  const history = loadMoodHistory();
  const today = new Date().toISOString().split('T')[0];
  const existing = history.findIndex((e) => e.date === today);
  if (existing >= 0) {
    history[existing].mood = mood;
  } else {
    history.push({ date: today, mood });
  }
  safeSet(KEYS.MOOD_HISTORY, history);
}

export function getTodayMood(): number | null {
  const history = loadMoodHistory();
  const today = new Date().toISOString().split('T')[0];
  const entry = history.find((e) => e.date === today);
  return entry?.mood ?? null;
}

// ---- Theme ----
export type Theme = 'dark' | 'light' | 'system';

export function loadTheme(): Theme {
  return safeGet<Theme>(KEYS.THEME, 'dark');
}

export function saveTheme(theme: Theme): void {
  safeSet(KEYS.THEME, theme);
}

// ---- Onboarding ----
export function hasSeenOnboarding(): boolean {
  return safeGet<boolean>(KEYS.ONBOARDING_SEEN, false);
}

export function markOnboardingSeen(): void {
  safeSet(KEYS.ONBOARDING_SEEN, true);
}

// ---- Last Pipeline Result (for navigation between views) ----
export function saveLastResult(result: unknown): void {
  safeSet(KEYS.LAST_PIPELINE_RESULT, result);
}

export function loadLastResult<T>(): T | null {
  return safeGet<T | null>(KEYS.LAST_PIPELINE_RESULT, null);
}

// ---- Effort Feedback ----
export function loadEffortFeedback(): EffortFeedback[] {
  return safeGet<EffortFeedback[]>(KEYS.EFFORT_FEEDBACK, []);
}

export function saveEffortFeedback(entry: EffortFeedback): void {
  const current = loadEffortFeedback();
  current.push(entry);
  safeSet(KEYS.EFFORT_FEEDBACK, current);

  // Sync to student context as well so it is sent in api calls
  const ctx = loadStudentContext();
  ctx.effort_feedback = current;
  saveStudentContext(ctx);
}

// ---- Accessibility ----
export function loadAccessibility(): { highContrast: boolean; largeText: boolean } {
  return safeGet<{ highContrast: boolean; largeText: boolean }>('actionpath_accessibility', {
    highContrast: false,
    largeText: false,
  });
}

export function saveAccessibility(settings: { highContrast: boolean; largeText: boolean }): void {
  safeSet('actionpath_accessibility', settings);
}

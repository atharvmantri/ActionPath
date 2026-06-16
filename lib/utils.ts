// ============================================================
// ActionPath — Utility helpers for merging pipeline data
// ============================================================

import type {
  PipelineResponse,
  ActionTask,
  QAIssue,
} from './schema';

/**
 * Merges all 7 pipeline stage outputs into a flat ActionTask array
 * used by the UI components.
 */
export function mergePipelineToTasks(
  pipeline: PipelineResponse,
  completedTaskIds: string[] = []
): ActionTask[] {
  const { stage_2_extract, stage_3_score, stage_5_plan, stage_6_rewrite, stage_7_qa } = pipeline;

  // Build lookup maps
  const scoreMap = new Map(stage_3_score.scored_items.map((s) => [s.task_id, s]));
  const rewriteMap = new Map(stage_6_rewrite.rewritten_items.map((r) => [r.task_id, r]));

  // Build plan map: task_id -> { scheduled_day, est_mins }
  const planMap = new Map<string, { scheduled_day: ActionTask['scheduled_day']; est_mins: number }>();
  const horizons: Array<[keyof typeof stage_5_plan.plan, ActionTask['scheduled_day']]> = [
    ['today', 'today'],
    ['tomorrow', 'tomorrow'],
    ['this_week', 'this_week'],
    ['later', 'later'],
  ];
  for (const [key, day] of horizons) {
    const items = stage_5_plan.plan[key];
    if (Array.isArray(items)) {
      for (const item of items) {
        planMap.set(item.task_id, { scheduled_day: day, est_mins: item.est_mins });
      }
    }
  }

  // Build QA issues map
  const qaMap = new Map<string, QAIssue[]>();
  for (const issue of stage_7_qa.qa_issues) {
    if (!qaMap.has(issue.task_id)) qaMap.set(issue.task_id, []);
    qaMap.get(issue.task_id)!.push(issue);
  }

  const itemsToMap = pipeline.stage_4_fuse?.merged_items && pipeline.stage_4_fuse.merged_items.length > 0
    ? pipeline.stage_4_fuse.merged_items
    : stage_2_extract.items;

  return itemsToMap.map((item) => {
    const score = scoreMap.get(item.task_id);
    const rewrite = rewriteMap.get(item.task_id);
    const plan = planMap.get(item.task_id);

    return {
      ...item,
      // Scoring
      urgency: score?.urgency ?? 5,
      effort: score?.effort ?? 'medium',
      consequence: score?.consequence ?? 'none',
      dependency: score?.dependency ?? null,
      composite_score: score?.composite_score ?? 5,
      // Planning
      scheduled_day: plan?.scheduled_day ?? 'later',
      est_mins: plan?.est_mins ?? 15,
      // Rewriting
      rewritten: rewrite?.rewritten ?? item.task,
      why_it_matters: rewrite?.why_it_matters ?? null,
      start_cue: rewrite?.start_cue ?? 'Start by reading the task description.',
      original: rewrite?.original ?? item.task,
      // QA
      qa_issues: qaMap.get(item.task_id) ?? [],
      // UI state
      completed: completedTaskIds.includes(item.task_id),
    };
  });
}

/**
 * Get subject color CSS variable name
 */
export function getSubjectColor(subject: string | null): string {
  if (!subject) return 'var(--subject-default)';
  const map: Record<string, string> = {
    biology: 'var(--subject-biology)',
    english: 'var(--subject-english)',
    history: 'var(--subject-history)',
    math: 'var(--subject-math)',
    algebra: 'var(--subject-math)',
    chemistry: 'var(--subject-chemistry)',
    physics: 'var(--subject-physics)',
    art: 'var(--subject-art)',
  };
  return map[subject.toLowerCase()] ?? 'var(--subject-default)';
}

/**
 * Get confidence level label
 */
export function getConfidenceLevel(confidence: number): 'high' | 'medium' | 'review' {
  if (confidence >= 0.85) return 'high';
  if (confidence >= 0.7) return 'medium';
  return 'review';
}

/**
 * Format minutes to human-readable
 */
export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

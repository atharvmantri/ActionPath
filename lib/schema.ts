// ============================================================
// ActionPath - TypeScript Types for 7-Stage Gemini Pipeline
// ============================================================

// ---- Stage 1: Intake Classifier ----
export type CommType =
  | 'deadline_notice'
  | 'general_update'
  | 'emergency'
  | 'form_request'
  | 'payment_required'
  | 'event_invitation'
  | 'policy_change';

export interface Stage1Result {
  comm_type: CommType;
  cognitive_load_score: number; // 0–10
  word_count: number;
  action_density: number;
  routing_template: string;
  language_complexity: 'low' | 'medium' | 'high';
  model: string;
}

// ---- Stage 2: Entity & Context Extraction ----
export type ItemType = 'form' | 'deadline' | 'payment' | 'meeting' | 'action';

export interface ExtractedItem {
  task_id: string;
  task: string;
  deadline: string | null;
  days_remaining: number | null;
  source_sentence: string;
  item_type: ItemType;
  people: string[];
  subject: string | null;
  url: string | null;
  confidence: number; // 0–1
  is_recurring?: boolean;
}

export interface Stage2Result {
  items: ExtractedItem[];
  model: string;
}

// ---- Stage 3: Scoring & Collision ----
export type EffortLevel = 'low' | 'medium' | 'high' | 'very_high';
export type ConsequenceType = 'grade' | 'opportunity' | 'social' | 'financial' | 'none';

export interface ScoredItem {
  task_id: string;
  urgency: number; // 1–10
  effort: EffortLevel;
  consequence: ConsequenceType;
  dependency: string | null;
  composite_score: number;
}

export interface Stage3Result {
  scored_items: ScoredItem[];
  collision_days: string[];
  reorder_suggestion: string | null;
  model: string;
}

// ---- Stage 4: Context Fusion ----
export interface Stage4Result {
  merged_items: ExtractedItem[];
  deduplicated: string[];
  recurring_detected: boolean;
  student_subject_match: Record<string, string[]>;
  model: string;
}

// ---- Stage 5: Day-by-Day Planning ----
export interface PlannedTask {
  task_id: string;
  est_mins: number;
}

export interface Stage5Result {
  plan: {
    today: PlannedTask[];
    tomorrow: PlannedTask[];
    this_week: PlannedTask[];
    later: PlannedTask[];
  };
  daily_budgets: Record<string, number>;
  load_warning: string | null;
  model: string;
}

// ---- Stage 6: Language Rewriter ----
export interface RewrittenItem {
  task_id: string;
  rewritten: string;
  why_it_matters: string | null;
  start_cue: string;
  original: string;
  model: string;
}

export interface Stage6Result {
  rewritten_items: RewrittenItem[];
  model: string;
}

// ---- Stage 7: QA Agent ----
export type QAIssueType =
  | 'low_confidence'
  | 'rewrite_too_long'
  | 'missing_start_cue'
  | 'overloaded_day'
  | 'missing_deadline';

export interface QAIssue {
  task_id: string;
  issue: QAIssueType;
  action: string;
}

export interface Stage7Result {
  qa_passed: boolean;
  qa_issues: QAIssue[];
  model: string;
}

// ---- Master Pipeline Response ----
export interface PipelineResponse {
  pipeline_version: string;
  processed_at: string;
  stage_1_classify: Stage1Result;
  stage_2_extract: Stage2Result;
  stage_3_score: Stage3Result;
  stage_4_fuse: Stage4Result;
  stage_5_plan: Stage5Result;
  stage_6_rewrite: Stage6Result;
  stage_7_qa: Stage7Result;
}

// ---- Merged Task (used in UI) ----
export interface ActionTask {
  task_id: string;
  // From extraction
  task: string;
  deadline: string | null;
  days_remaining: number | null;
  source_sentence: string;
  item_type: ItemType;
  people: string[];
  subject: string | null;
  url: string | null;
  confidence: number;
  is_recurring?: boolean;
  // From scoring
  urgency: number;
  effort: EffortLevel;
  consequence: ConsequenceType;
  dependency: string | null;
  composite_score: number;
  // From planning
  scheduled_day: 'today' | 'tomorrow' | 'this_week' | 'later';
  est_mins: number;
  // From rewriting
  rewritten: string;
  why_it_matters: string | null;
  start_cue: string;
  original: string;
  // From QA
  qa_issues: QAIssue[];
  // UI state
  completed: boolean;
}

export interface EffortFeedback {
  task: string;
  estimated_mins: number;
  actual_mins: number;
  submitted_at: string;
}

// ---- Student Context (stored in localStorage) ----
export interface StudentContext {
  completed_task_ids: string[];
  known_subjects: string[];
  busy_days: string[]; // e.g. ["Monday", "Wednesday"]
  preferred_working_times: string | null;
  past_tasks: { task_id: string; task: string; completed_at: string }[];
  effort_feedback?: EffortFeedback[];
}

// ---- Pipeline Stage Info (for progress UI) ----
export interface StageInfo {
  stage: number;
  name: string;
  model: string;
  description: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  duration_ms?: number;
}

export const PIPELINE_STAGES: Omit<StageInfo, 'status' | 'duration_ms'>[] = [
  { stage: 1, name: 'Intake Classifier', model: 'gemini-3.1-flash-lite', description: 'Classifying communication type & cognitive load' },
  { stage: 2, name: 'Entity Extraction', model: 'gemini-3.1-flash-lite', description: 'Extracting tasks, deadlines & source sentences' },
  { stage: 3, name: 'Scoring & Collision', model: 'gemini-3.1-flash-lite', description: 'Scoring urgency, effort & detecting collisions' },
  { stage: 4, name: 'Context Fusion', model: 'gemini-3.1-flash-lite', description: 'Merging with student context & deduplicating' },
  { stage: 5, name: 'Day-by-Day Planning', model: 'gemini-3.1-flash-lite', description: 'Generating daily action plan with time budgets' },
  { stage: 6, name: 'Language Rewriter', model: 'gemini-3.1-flash-lite', description: 'Rewriting in plain, ADHD-optimized language' },
  { stage: 7, name: 'QA Agent', model: 'gemini-3.1-flash-lite', description: 'Validating pipeline output quality' },
];

// ============================================================
// ActionPath — 7-Stage Gemini AI Pipeline
// Every stage makes a real Gemini API call. No heuristics.
// ============================================================

import { GoogleGenAI } from '@google/genai';
import type {
  Stage1Result,
  Stage2Result,
  Stage3Result,
  Stage4Result,
  Stage5Result,
  Stage6Result,
  Stage7Result,
  StudentContext,
} from './schema';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// ---- Helper to call Gemini with JSON output ----
async function callGemini(
  model: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiModel = model;

  const response = await ai.models.generateContent({
    model: apiModel,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });
  return response.text ?? '{}';
}

// ============================================================
// STAGE 1 — INTAKE CLASSIFIER (gemini-3.1-flash-lite)
// ============================================================
export async function stage1Classify(rawText: string): Promise<Stage1Result> {
  const systemPrompt = `You are an AI intake classifier for school communications. Your job is to analyze the raw text of a school communication and classify it.

You MUST return a JSON object with these exact fields:
- "comm_type": one of "deadline_notice", "general_update", "emergency", "form_request", "payment_required", "event_invitation", "policy_change"
- "cognitive_load_score": a number from 0 to 10 based on word count, sentence complexity, action density, and urgency language. Higher = more overwhelming for an ADHD student.
- "word_count": integer count of words in the input
- "action_density": ratio of action items to total sentences (0.0 to 1.0)
- "routing_template": one of "DEADLINE_V2", "GENERAL_V2", "EMERGENCY_V2", "FORM_V2", "PAYMENT_V2", "EVENT_V2", "POLICY_V2" — matching the comm_type
- "language_complexity": "low", "medium", or "high" based on vocabulary and sentence structure

Analyze carefully. The classification accuracy affects all downstream processing.`;

  const result = await callGemini(
    'gemini-3.1-flash-lite',
    systemPrompt,
    `Classify this school communication:\n\n${rawText}`
  );

  const parsed = JSON.parse(result);
  return { ...parsed, model: 'gemini-3.1-flash-lite' };
}

// ============================================================
// STAGE 2 — ENTITY & CONTEXT EXTRACTION (gemini-3.1-flash-lite)
// ============================================================
export async function stage2Extract(
  rawText: string,
  stage1: Stage1Result
): Promise<Stage2Result> {
  const today = new Date().toISOString().split('T')[0];

  const systemPrompt = `You are a precision extraction agent for school communications. Your job is to extract EVERY task, deadline, action item, form requirement, payment, and meeting from the text.

Context: This is a "${stage1.comm_type}" communication with cognitive load ${stage1.cognitive_load_score}/10.
Today's date: ${today}

For EACH item you extract, provide:
- "task_id": unique identifier like "t1", "t2", etc.
- "task": the full task description
- "deadline": ISO date string (YYYY-MM-DD) or null if no specific date
- "days_remaining": integer days until deadline from today, or null
- "source_sentence": the EXACT sentence from the original text this was extracted from (verbatim quote)
- "item_type": one of "form", "deadline", "payment", "meeting", "action"
- "people": array of people mentioned in relation to this task
- "subject": school subject if relevant (e.g. "Biology", "English"), or null
- "url": any URL mentioned, or null
- "confidence": your confidence in this extraction from 0.0 to 1.0

Return a JSON object: { "items": [...] }

CRITICAL RULES:
- Extract ALL action items, even minor ones
- source_sentence must be an EXACT quote from the input text
- Calculate days_remaining from today's date (${today})
- If a deadline is relative (e.g. "this Friday"), convert to absolute date
- Confidence should reflect how certain you are about the extraction accuracy`;

  const result = await callGemini(
    'gemini-3.1-flash-lite',
    systemPrompt,
    `Extract all tasks and deadlines from this ${stage1.comm_type}:\n\n${rawText}`
  );

  const parsed = JSON.parse(result);
  return { ...parsed, model: 'gemini-3.1-flash-lite' };
}

// ============================================================
// STAGE 3 — SCORING & COLLISION (gemini-3.1-flash-lite)
// ============================================================
export async function stage3Score(
  stage2: Stage2Result,
  stage1: Stage1Result
): Promise<Stage3Result> {
  const systemPrompt = `You are a task scoring and collision detection agent. Score each extracted task and detect deadline collisions.

For each task, score on these axes:
- "urgency": 1-10 based on days until deadline (1=far away, 10=due today/overdue)
- "effort": "low" (click/reply), "medium" (fill form), "high" (write/create), "very_high" (multi-step project)
- "consequence": what happens if missed — "grade", "opportunity", "social", "financial", "none"
- "dependency": task_id of another task this depends on, or null
- "composite_score": weighted score 0-10 combining urgency (40%), consequence (30%), effort (20%), dependency (10%)

Also detect:
- "collision_days": array of date strings where 3+ tasks fall on the same day
- "reorder_suggestion": if collisions exist, suggest which task to move and why, or null

Return JSON: { "scored_items": [...], "collision_days": [...], "reorder_suggestion": "..." }`;

  const result = await callGemini(
    'gemini-3.1-flash-lite',
    systemPrompt,
    `Score these extracted tasks (communication type: ${stage1.comm_type}):\n\n${JSON.stringify(stage2.items, null, 2)}`
  );

  const parsed = JSON.parse(result);
  return { ...parsed, model: 'gemini-3.1-flash-lite' };
}

// ============================================================
// STAGE 4 — CONTEXT FUSION (gemini-3.1-flash-lite)
// ============================================================
export async function stage4Fuse(
  stage2: Stage2Result,
  stage3: Stage3Result,
  studentContext: StudentContext | null
): Promise<Stage4Result> {
  const systemPrompt = `You are a context fusion agent. Merge newly extracted tasks with the student's stored context.

Your jobs:
1. Take the extracted items and merge them with any existing student context.
2. Deduplicate: if a task matches one the student has already seen/completed, note it.
3. Detect recurring items (e.g., weekly assignments, recurring meetings, repetitive updates) and set "is_recurring": true on those specific items in "merged_items".
4. Match tasks to student's known subjects.

Return JSON:
{
  "merged_items": [
    // same structure as extracted items, but with "is_recurring": true/false added
  ],
  "deduplicated": ["description of what was deduped"],
  "recurring_detected": true, // true if any recurring item is found
  "student_subject_match": { "SubjectName": ["t1", "t2"] }
}

If no student context is provided, return the items as-is with empty dedup arrays.`;

  const result = await callGemini(
    'gemini-3.1-flash-lite',
    systemPrompt,
    `Merge these tasks with student context:\n\nExtracted items:\n${JSON.stringify(stage2.items, null, 2)}\n\nScored items:\n${JSON.stringify(stage3.scored_items, null, 2)}\n\nStudent context:\n${JSON.stringify(studentContext ?? { completed_task_ids: [], known_subjects: [], past_tasks: [] }, null, 2)}`
  );

  const parsed = JSON.parse(result);
  return { ...parsed, model: 'gemini-3.1-flash-lite' };
}

// ============================================================
// STAGE 5 — DAY-BY-DAY PLANNING (gemini-3.1-flash-lite)
// ============================================================
export async function stage5Plan(
  stage2: Stage2Result,
  stage3: Stage3Result,
  stage4: Stage4Result,
  studentContext: StudentContext | null
): Promise<Stage5Result> {
  const today = new Date().toISOString().split('T')[0];

  const systemPrompt = `You are a day-by-day planning agent for ADHD students. Create a concrete, manageable daily action plan.

Today's date: ${today}

RULES:
- Never assign more than 3 high-effort tasks to a single day
- Cognitive load balancing: spread tasks across days
- If a day is overloaded (3+ high-effort items), suggest which items to move and why
- Generate estimated time budget per day
- Account for student's busy days if provided
- Prioritize by composite_score (highest first)

Horizons:
- "today": tasks due today or that should be started today
- "tomorrow": tasks for tomorrow
- "this_week": tasks for the rest of this week
- "later": tasks beyond this week

Return JSON:
{
  "plan": {
    "today": [{"task_id": "t1", "est_mins": 5}],
    "tomorrow": [...],
    "this_week": [...],
    "later": [...]
  },
  "daily_budgets": {"today": 25, "tomorrow": 20},
  "load_warning": "string warning if any day is overloaded, or null"
}`;

  const busyDays = studentContext?.busy_days?.join(', ') || 'none specified';

  const result = await callGemini(
    'gemini-3.1-flash-lite',
    systemPrompt,
    `Plan these tasks for the student:\n\nExtracted:\n${JSON.stringify(stage4.merged_items, null, 2)}\n\nScored:\n${JSON.stringify(stage3.scored_items, null, 2)}\n\nCollision days: ${JSON.stringify(stage3.collision_days)}\n\nStudent busy days: ${busyDays}`
  );

  const parsed = JSON.parse(result);
  return { ...parsed, model: 'gemini-3.1-flash-lite' };
}

// ============================================================
// STAGE 6 — LANGUAGE REWRITER (gemini-3.1-flash-lite)
// ============================================================
export async function stage6Rewrite(
  stage2: Stage2Result,
  stage3: Stage3Result,
  stage5: Stage5Result
): Promise<Stage6Result> {
  const systemPrompt = `You are an ADHD-optimized language rewriter. Rewrite every task description for an ADHD high school student.

RULES:
- Maximum 12 words per rewritten task
- Active voice only — start with a verb
- No bureaucratic phrasing, no passive constructions
- Plain, calm, clear language
- Add a "why_it_matters" sentence if the task has grade/opportunity/financial consequence
- Generate a "start_cue" — the SINGLE FIRST physical action the student should take to begin
  (e.g., "Open Google Forms in your browser", "Get the blue form from your backpack")
  This removes the initiation barrier that ADHD students face.

For each task return:
{
  "task_id": "t1",
  "rewritten": "Sign field trip form. Hand to room 204.",
  "why_it_matters": "Missing this means you cannot attend." or null,
  "start_cue": "Open your backpack and find the blue form.",
  "original": "the original task description"
}

Return JSON: { "rewritten_items": [...] }`;

  const result = await callGemini(
    'gemini-3.1-flash-lite',
    systemPrompt,
    `Rewrite these tasks in ADHD-optimized language:\n\nExtracted tasks:\n${JSON.stringify(stage2.items, null, 2)}\n\nScored tasks:\n${JSON.stringify(stage3.scored_items, null, 2)}\n\nPlanned schedule:\n${JSON.stringify(stage5.plan, null, 2)}`
  );

  const parsed = JSON.parse(result);
  return { ...parsed, model: 'gemini-3.1-flash-lite' };
}

// ============================================================
// STAGE 7 — QA AGENT (gemini-3.1-flash-lite)
// ============================================================
export async function stage7QA(
  stage2: Stage2Result,
  stage5: Stage5Result,
  stage6: Stage6Result
): Promise<Stage7Result> {
  const systemPrompt = `You are a quality assurance agent. Check the full pipeline output for issues.

CHECK FOR:
1. Missing deadlines: compare extracted count vs planned count — flag any task that was extracted but not planned
2. Low confidence: any task with confidence < 0.7 — flag as "low_confidence" with action "flag_for_review"
3. Missing start cue: any rewritten task without a start_cue — flag as "missing_start_cue"
4. Overloaded days: any day with 3+ tasks not flagged with a load warning — flag as "overloaded_day"
5. Rewrite too long: any rewritten task over 12 words — flag as "rewrite_too_long"

Return JSON:
{
  "qa_passed": true/false (false if any issues found),
  "qa_issues": [
    { "task_id": "t3", "issue": "low_confidence", "action": "flag_for_review" },
    { "task_id": "t5", "issue": "rewrite_too_long", "action": "request_rewrite" }
  ]
}

If no issues found, return { "qa_passed": true, "qa_issues": [] }`;

  const result = await callGemini(
    'gemini-3.1-flash-lite',
    systemPrompt,
    `QA check this pipeline output:\n\nExtracted (${stage2.items.length} items):\n${JSON.stringify(stage2.items, null, 2)}\n\nPlanned:\n${JSON.stringify(stage5.plan, null, 2)}\n\nRewritten:\n${JSON.stringify(stage6.rewritten_items, null, 2)}`
  );

  const parsed = JSON.parse(result);
  return { ...parsed, model: 'gemini-3.1-flash-lite' };
}

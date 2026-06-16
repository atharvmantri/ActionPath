// ============================================================
// ActionPath — Task Serialization for Counselor/Parent Share Link
// Safe Unicode Base64 encoding/decoding with zero database dependency
// ============================================================

import type { ActionTask } from './schema';

/**
 * Serializes the action tasks list into a URL-safe Base64 string.
 */
export function serializeTasks(tasks: ActionTask[]): string {
  try {
    // Keep only essential fields to keep the string compact
    const minimal = tasks.map((t) => ({
      task_id: t.task_id,
      task: t.task,
      deadline: t.deadline,
      days_remaining: t.days_remaining,
      source_sentence: t.source_sentence,
      item_type: t.item_type,
      people: t.people,
      subject: t.subject,
      url: t.url,
      confidence: t.confidence,
      urgency: t.urgency,
      effort: t.effort,
      consequence: t.consequence,
      dependency: t.dependency,
      composite_score: t.composite_score,
      scheduled_day: t.scheduled_day,
      est_mins: t.est_mins,
      rewritten: t.rewritten,
      why_it_matters: t.why_it_matters,
      start_cue: t.start_cue,
      completed: t.completed,
    }));

    const jsonString = JSON.stringify(minimal);
    const utf8Bytes = new TextEncoder().encode(jsonString);
    let binString = '';
    utf8Bytes.forEach((b) => {
      binString += String.fromCharCode(b);
    });

    return btoa(binString)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (err) {
    console.error('Error serializing tasks:', err);
    return '';
  }
}

/**
 * Deserializes a URL-safe Base64 string back into an action tasks array.
 */
export function deserializeTasks(hash: string): ActionTask[] | null {
  if (!hash) return null;
  try {
    let base64 = hash.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const binString = atob(base64);
    const utf8Bytes = new Uint8Array(binString.length);
    for (let i = 0; i < binString.length; i++) {
      utf8Bytes[i] = binString.charCodeAt(i);
    }

    const jsonString = new TextDecoder().decode(utf8Bytes);
    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed)) return null;

    return parsed.map((t: any) => ({
      ...t,
      qa_issues: t.qa_issues ?? [],
    })) as ActionTask[];
  } catch (err) {
    console.error('Error deserializing tasks:', err);
    return null;
  }
}

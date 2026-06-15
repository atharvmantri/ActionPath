// ============================================================
// ActionPath — ICS Calendar Export Helper
// ============================================================

import type { ActionTask } from './schema';

export function generateICSContent(tasks: ActionTask[]): string {
  const now = new Date();
  const formatDate = (d: Date): string => {
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ActionPath//AI Task Manager//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:ActionPath Tasks',
    'X-WR-TIMEZONE:America/New_York',
  ];

  tasks.forEach((task) => {
    if (!task.deadline) return;

    const deadlineDate = new Date(task.deadline + 'T09:00:00');
    const endDate = new Date(deadlineDate.getTime() + (task.est_mins || 30) * 60 * 1000);

    const uid = `${task.task_id}-${Date.now()}@actionpath.app`;
    const summary = task.rewritten || task.task;
    const description = [
      task.why_it_matters ? `Why: ${task.why_it_matters}` : '',
      task.start_cue ? `Start: ${task.start_cue}` : '',
      task.source_sentence ? `Source: "${task.source_sentence}"` : '',
      `Effort: ${task.effort}`,
      `Urgency: ${task.urgency}/10`,
    ]
      .filter(Boolean)
      .join('\\n');

    ics.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${formatDate(now)}`,
      `DTSTART:${formatDate(deadlineDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${escapeICS(summary)}`,
      `DESCRIPTION:${escapeICS(description)}`,
      task.subject ? `CATEGORIES:${escapeICS(task.subject)}` : '',
      `STATUS:${task.completed ? 'COMPLETED' : 'NEEDS-ACTION'}`,
      `PRIORITY:${task.urgency <= 3 ? 9 : task.urgency <= 6 ? 5 : 1}`,
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      `DESCRIPTION:ActionPath: ${escapeICS(summary)}`,
      'END:VALARM',
      'END:VEVENT'
    );
  });

  ics.push('END:VCALENDAR');
  return ics.filter(Boolean).join('\r\n');
}

function escapeICS(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function downloadICS(tasks: ActionTask[]): void {
  const content = generateICSContent(tasks);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `actionpath-tasks-${new Date().toISOString().split('T')[0]}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

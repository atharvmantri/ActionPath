// ============================================================
// ActionPath - Calendar Export API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import type { ActionTask } from '@/lib/schema';

export async function POST(req: NextRequest) {
  try {
    const { tasks } = (await req.json()) as { tasks: ActionTask[] };

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: 'No tasks to export' }, { status: 400 });
    }

    // Generate ICS server-side as well (for API consumers)
    const now = new Date();
    const formatDate = (d: Date): string => {
      return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const escapeICS = (str: string): string => {
      return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
    };

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ActionPath//AI Task Manager//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:ActionPath Tasks',
    ];

    tasks.forEach((task) => {
      if (!task.deadline) return;
      const deadlineDate = new Date(task.deadline + 'T09:00:00');
      const endDate = new Date(deadlineDate.getTime() + (task.est_mins || 30) * 60000);

      lines.push(
        'BEGIN:VEVENT',
        `UID:${task.task_id}-${Date.now()}@actionpath.app`,
        `DTSTAMP:${formatDate(now)}`,
        `DTSTART:${formatDate(deadlineDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:${escapeICS(task.rewritten || task.task)}`,
        `DESCRIPTION:${escapeICS(task.start_cue || '')}`,
        'BEGIN:VALARM',
        'TRIGGER:-PT1H',
        'ACTION:DISPLAY',
        `DESCRIPTION:ActionPath reminder`,
        'END:VALARM',
        'END:VEVENT'
      );
    });

    lines.push('END:VCALENDAR');
    const icsContent = lines.join('\r\n');

    return new NextResponse(icsContent, {
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="actionpath-tasks.ics"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}

'use client';

import React from 'react';
import type { ActionTask } from '@/lib/schema';
import { getSubjectColor, formatMinutes } from '@/lib/utils';
import ConfidenceBadge from './ConfidenceBadge';

interface WeekViewProps {
  tasks: ActionTask[];
  collisionDays: string[];
  dailyBudgets: Record<string, number>;
}

export default function WeekView({ tasks, collisionDays, dailyBudgets }: WeekViewProps) {
  // Generate 7 days starting from today
  const days: { date: string; label: string; dayName: string; isToday: boolean }[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: i === 0,
    });
  }

  // Group tasks by deadline date
  const tasksByDate = new Map<string, ActionTask[]>();
  const unscheduled: ActionTask[] = [];

  tasks.forEach((task) => {
    if (task.deadline) {
      const existing = tasksByDate.get(task.deadline) || [];
      existing.push(task);
      tasksByDate.set(task.deadline, existing);
    } else {
      unscheduled.push(task);
    }
  });

  const isCollisionDay = (date: string) => collisionDays.includes(date);
  const isOverloadedDay = (date: string) => {
    const dayTasks = tasksByDate.get(date) || [];
    return dayTasks.filter((t) => t.effort === 'high' || t.effort === 'very_high').length >= 3;
  };

  return (
    <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(140px, 1fr))',
        gap: '8px',
        minWidth: '980px',
      }}>
        {days.map((day) => {
          const dayTasks = tasksByDate.get(day.date) || [];
          const budget = dailyBudgets[day.date] || dailyBudgets[day.dayName.toLowerCase()];
          const isCollision = isCollisionDay(day.date);
          const isOverloaded = isOverloadedDay(day.date);
          const totalMins = dayTasks.reduce((sum, t) => sum + t.est_mins, 0);

          return (
            <div
              key={day.date}
              className="glass-card-static"
              style={{
                padding: '12px',
                minHeight: '200px',
                borderTop: `3px solid ${
                  isOverloaded ? 'var(--accent-rose)' :
                  isCollision ? 'var(--accent-amber)' :
                  day.isToday ? 'var(--accent-blue)' :
                  'var(--border-subtle)'
                }`,
                background: day.isToday ? 'rgba(59, 130, 246, 0.04)' : undefined,
              }}
            >
              {/* Day header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}>
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: day.isToday ? 'var(--accent-blue)' : 'var(--text-primary)',
                  }}>
                    {day.dayName}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {day.label}
                  </div>
                </div>
                {dayTasks.length > 0 && (
                  <span style={{
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-glass)',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}>
                    {formatMinutes(totalMins)}
                  </span>
                )}
              </div>

              {/* Warning indicators */}
              {isOverloaded && (
                <div style={{
                  fontSize: '0.65rem',
                  color: 'var(--accent-rose)',
                  marginBottom: '8px',
                  padding: '4px 8px',
                  background: 'rgba(255, 59, 48, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  fontWeight: 600,
                }}>
                  Overloaded
                </div>
              )}
              {isCollision && !isOverloaded && (
                <div style={{
                  fontSize: '0.65rem',
                  color: 'var(--accent-amber)',
                  marginBottom: '8px',
                  padding: '4px 8px',
                  background: 'rgba(255, 149, 0, 0.08)',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  fontWeight: 600,
                }}>
                  Collision
                </div>
              )}

              {/* Task pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dayTasks.map((task) => (
                  <div
                    key={task.task_id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: task.completed ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-glass)',
                      border: `1px solid ${task.completed ? 'rgba(16, 185, 129, 0.2)' : 'var(--border-subtle)'}`,
                      fontSize: '0.7rem',
                      lineHeight: 1.4,
                      opacity: task.completed ? 0.6 : 1,
                      borderLeft: `3px solid ${getSubjectColor(task.subject)}`,
                      transition: 'all 0.2s ease',
                      cursor: 'default',
                    }}
                    title={`${task.original}\n\nStart: ${task.start_cue}\nEffort: ${task.effort}\nTime: ${formatMinutes(task.est_mins)}`}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '4px',
                    }}>
                      <span style={{
                        color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        fontWeight: 500,
                      }}>
                        {task.rewritten}
                      </span>
                      <ConfidenceBadge confidence={task.confidence} showLabel={task.confidence < 0.7} />
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '4px',
                      color: 'var(--text-muted)',
                      fontSize: '0.6rem',
                    }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {formatMinutes(task.est_mins)}
                      </span>
                      {task.subject && <span style={{ color: getSubjectColor(task.subject) }}>● {task.subject}</span>}
                    </div>
                  </div>
                ))}

                {dayTasks.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '20px 8px',
                    color: 'var(--text-muted)',
                    fontSize: '0.7rem',
                  }}>
                    {day.isToday ? 'Free day!' : 'No tasks'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unscheduled tasks */}
      {unscheduled.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h4 style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            No specific date
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {unscheduled.map((task) => (
              <div
                key={task.task_id}
                style={{
                  padding: '6px 12px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.7rem',
                  color: 'var(--text-secondary)',
                  borderLeft: `3px solid ${getSubjectColor(task.subject)}`,
                }}
              >
                {task.rewritten}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

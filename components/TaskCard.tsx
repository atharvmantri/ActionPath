'use client';

import React, { useState } from 'react';
import type { ActionTask } from '@/lib/schema';
import { getSubjectColor, formatMinutes } from '@/lib/utils';
import ConfidenceBadge from './ConfidenceBadge';
import StartCue from './StartCue';

interface TaskCardProps {
  task: ActionTask;
  showPlainLanguage: boolean;
  onToggleComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, newText: string) => void;
  index: number;
  onStartFocus?: (task: ActionTask) => void;
  readOnly?: boolean;
}

export default function TaskCard({
  task,
  showPlainLanguage,
  onToggleComplete,
  onDelete,
  onEdit,
  index,
  onStartFocus,
  readOnly = false,
}: TaskCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.rewritten);
  const subjectColor = getSubjectColor(task.subject);
  const hasQAIssues = task.qa_issues.length > 0;
  const isLowConfidence = task.confidence < 0.7;

  const effortConfig: Record<string, { label: string; className: string }> = {
    low: { label: 'Quick', className: 'badge-effort-low' },
    medium: { label: 'Medium', className: 'badge-effort-medium' },
    high: { label: 'Effort', className: 'badge-effort-high' },
    very_high: { label: 'Big Task', className: 'badge-effort-very_high' },
  };

  const effort = effortConfig[task.effort] || effortConfig.medium;

  return (
    <div
      className="glass-card"
      style={{
        padding: '16px 20px',
        borderLeft: `3px solid ${subjectColor}`,
        border: isLowConfidence ? '1.5px solid var(--accent-rose)' : undefined,
        opacity: task.completed ? 0.5 : 1,
        transition: 'all 0.3s ease',
        animationDelay: `${index * 0.05}s`,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Checkbox */}
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          disabled={readOnly}
          onChange={() => !readOnly && onToggleComplete(task.task_id)}
          aria-label={`Mark "${task.rewritten}" as ${task.completed ? 'incomplete' : 'complete'}`}
          id={`task-${task.task_id}`}
        />

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header row: task text + badges */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onEdit(task.task_id, editText);
                        setIsEditing(false);
                      }
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                    autoFocus
                    style={{
                      flex: 1,
                      background: 'var(--bg-glass)',
                      border: '1px solid var(--border-glow)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 10px',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      outline: 'none',
                    }}
                  />
                  <button
                    onClick={() => { onEdit(task.task_id, editText); setIsEditing(false); }}
                    style={{
                      background: 'var(--accent-emerald)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      color: 'white',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    lineHeight: 1.4,
                    cursor: 'default',
                  }}
                >
                  {showPlainLanguage ? task.rewritten : task.original}
                </p>
              )}
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0, alignItems: 'center' }}>
              {task.is_recurring && (
                <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)' }} title="Recurring Task">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                    Weekly
                  </span>
                </span>
              )}
              <ConfidenceBadge confidence={task.confidence} showLabel={isLowConfidence} />
              <span className={`badge ${effort.className}`}>{effort.label}</span>
            </div>
          </div>

          {/* Meta row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '12px',
            marginTop: '8px',
            fontSize: '0.75rem',
          }}>
            {task.subject && (
              <span style={{
                color: subjectColor,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                {task.subject}
              </span>
            )}

            {task.deadline && (
              <span style={{
                color: task.days_remaining !== null && task.days_remaining <= 1
                  ? 'var(--accent-rose)'
                  : task.days_remaining !== null && task.days_remaining <= 3
                  ? 'var(--accent-amber)'
                  : 'var(--text-muted)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                {task.deadline}
                {task.days_remaining !== null && (
                  <span> ({task.days_remaining === 0 ? 'Today!' : task.days_remaining === 1 ? 'Tomorrow' : `${task.days_remaining}d left`})</span>
                )}
              </span>
            )}

            <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              {formatMinutes(task.est_mins)}
            </span>

            {task.people.length > 0 && (
              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                {task.people.join(', ')}
              </span>
            )}
          </div>

          {/* Why it matters */}
          {task.why_it_matters && (
            <p style={{
              marginTop: '8px',
              fontSize: '0.75rem',
              color: 'var(--accent-amber)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
              <span>{task.why_it_matters}</span>
            </p>
          )}

          {/* QA Issues */}
          {hasQAIssues && (
            <div style={{
              marginTop: '6px',
              padding: '6px 10px',
              background: 'rgba(244, 63, 94, 0.06)',
              border: '1px solid rgba(244, 63, 94, 0.15)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.7rem',
              color: 'var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              <span>QA: {task.qa_issues.map((i) => i.issue.replace(/_/g, ' ')).join(', ')}</span>
            </div>
          )}

          {/* Source sentence tooltip */}
          <div
            className="tooltip-container"
            style={{ marginTop: '8px', display: 'inline-block' }}
          >
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.7rem',
                cursor: 'pointer',
                padding: '2px 0',
                textDecoration: 'underline',
                textDecorationStyle: 'dotted',
              }}
              aria-label="View source sentence"
            >
              View source sentence
            </button>
            {showTooltip && (
              <div className="tooltip-content" style={{ bottom: 'calc(100% + 6px)', top: 'auto', left: 0 }}>
                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ConfidenceBadge confidence={task.confidence} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {Math.round(task.confidence * 100)}% confident
                  </span>
                </div>
                <p style={{ fontStyle: 'italic', lineHeight: 1.5 }}>
                  &ldquo;{task.source_sentence}&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Start Cue */}
          <StartCue cue={task.start_cue} />
        </div>

        {/* Actions */}
        {!readOnly && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
            {onStartFocus && !task.completed && (
              <button
                onClick={() => onStartFocus(task)}
                className="btn-ghost"
                style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}
                title="Start focus timer"
                aria-label="Start focus timer"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </button>
            )}
            <button
              onClick={() => setIsEditing(true)}
              className="btn-ghost"
              style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Edit task"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            </button>
            <button
              onClick={() => onDelete(task.task_id)}
              className="btn-ghost"
              style={{ padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Delete task"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

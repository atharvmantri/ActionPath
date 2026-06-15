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
}

export default function TaskCard({
  task,
  showPlainLanguage,
  onToggleComplete,
  onDelete,
  onEdit,
  index,
}: TaskCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.rewritten);
  const subjectColor = getSubjectColor(task.subject);
  const hasQAIssues = task.qa_issues.length > 0;

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
          onChange={() => onToggleComplete(task.task_id)}
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
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
              <ConfidenceBadge confidence={task.confidence} showLabel={false} />
              <span className={`badge ${effort.className}`}>{effort.label}</span>
            </div>
          </div>

          {/* Meta row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '8px',
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
                📚 {task.subject}
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
              }}>
                📅 {task.deadline}
                {task.days_remaining !== null && (
                  <span> ({task.days_remaining === 0 ? 'Today!' : task.days_remaining === 1 ? 'Tomorrow' : `${task.days_remaining}d left`})</span>
                )}
              </span>
            )}

            <span style={{ color: 'var(--text-muted)' }}>
              ⏱ {formatMinutes(task.est_mins)}
            </span>

            {task.people.length > 0 && (
              <span style={{ color: 'var(--text-muted)' }}>
                👤 {task.people.join(', ')}
              </span>
            )}
          </div>

          {/* Why it matters */}
          {task.why_it_matters && (
            <p style={{
              marginTop: '8px',
              fontSize: '0.75rem',
              color: 'var(--accent-amber)',
              fontStyle: 'italic',
            }}>
              ⚡ {task.why_it_matters}
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
            }}>
              ⚠ QA: {task.qa_issues.map((i) => i.issue.replace(/_/g, ' ')).join(', ')}
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
              📄 View source sentence
            </button>
            {showTooltip && (
              <div className="tooltip-content" style={{ bottom: 'auto', top: 'calc(100% + 8px)', left: 0, transform: 'none' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
          <button
            onClick={() => setIsEditing(true)}
            className="btn-ghost"
            style={{ padding: '4px 8px', fontSize: '0.7rem' }}
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(task.task_id)}
            className="btn-ghost"
            style={{ padding: '4px 8px', fontSize: '0.7rem' }}
            aria-label="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

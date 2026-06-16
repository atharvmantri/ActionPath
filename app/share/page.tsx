'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { deserializeTasks } from '@/lib/share';
import type { ActionTask } from '@/lib/schema';
import TaskCard from '@/components/TaskCard';
import WeekView from '@/components/WeekView';

function SharePageContent() {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<ActionTask[]>([]);
  const [viewMode, setViewMode] = useState<'checklist' | 'week'>('checklist');
  const [showPlainLanguage, setShowPlainLanguage] = useState(true);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      const decoded = deserializeTasks(data);
      if (decoded) {
        setTasks(decoded);
      }
    }
  }, [searchParams]);

  if (tasks.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        padding: '24px',
      }}>
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '12px' }}>No Shared Plan Found</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Please make sure you have the complete shareable URL from the student.
          </p>
        </div>
      </div>
    );
  }

  // Group tasks
  const groupedTasks = {
    today: tasks.filter((t) => t.scheduled_day === 'today'),
    tomorrow: tasks.filter((t) => t.scheduled_day === 'tomorrow'),
    this_week: tasks.filter((t) => t.scheduled_day === 'this_week'),
    later: tasks.filter((t) => t.scheduled_day === 'later'),
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 24px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-blue)' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              <span className="gradient-text">ActionPath</span>
              <span style={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.85rem', marginLeft: '8px' }}>Counselor & Parent View</span>
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setViewMode('checklist')}
              className={viewMode === 'checklist' ? 'btn-secondary' : 'btn-ghost'}
              style={{ fontSize: '0.8rem', padding: '8px 16px' }}
            >
              Checklist
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={viewMode === 'week' ? 'btn-secondary' : 'btn-ghost'}
              style={{ fontSize: '0.8rem', padding: '8px 16px' }}
            >
              Week
            </button>
          </div>
        </div>
      </header>

      {/* Main container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div className="glass-card-static" style={{ padding: '16px 20px', marginBottom: '24px', borderLeft: '3px solid var(--accent-blue)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong>Read-only Share View:</strong> This dashboard displays the student's compiled action items and schedule. Checkbox completion, edits, deletes, and focus timers are disabled in this view.
          </p>
        </div>

        {viewMode === 'checklist' ? (
          <div>
            {/* Plain language toggle */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <span>Plain Language</span>
                <input
                  type="checkbox"
                  checked={showPlainLanguage}
                  onChange={() => setShowPlainLanguage(!showPlainLanguage)}
                  style={{ cursor: 'pointer' }}
                />
              </label>
            </div>

            {(['today', 'tomorrow', 'this_week', 'later'] as const).map((group) => {
              const groupTasks = groupedTasks[group];
              if (groupTasks.length === 0) return null;

              const labels = {
                today: { label: 'Today', accent: 'var(--accent-blue)' },
                tomorrow: { label: 'Tomorrow', accent: 'var(--accent-purple)' },
                this_week: { label: 'This Week', accent: 'var(--accent-cyan)' },
                later: { label: 'Later', accent: 'var(--text-muted)' },
              };
              const { label, accent } = labels[group];
              const completedCount = groupTasks.filter((t) => t.completed).length;

              return (
                <div key={group} style={{ marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: accent, marginBottom: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {label}
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-glass)', padding: '2px 8px', borderRadius: '9999px' }}>
                      {completedCount}/{groupTasks.length} Done
                    </span>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {groupTasks.map((task, i) => (
                      <TaskCard
                        key={task.task_id}
                        task={task}
                        showPlainLanguage={showPlainLanguage}
                        onToggleComplete={() => {}}
                        onDelete={() => {}}
                        onEdit={() => {}}
                        index={i}
                        readOnly={true}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <WeekView
            tasks={tasks}
            collisionDays={[]}
            dailyBudgets={{}}
          />
        )}
      </main>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        Loading shared plan...
      </div>
    }>
      <SharePageContent />
    </Suspense>
  );
}

'use client';

import React from 'react';
import type { StageInfo } from '@/lib/schema';
import { PIPELINE_STAGES } from '@/lib/schema';

interface PipelineProgressProps {
  currentStage: number; // 0 = not started, 1-7 = running that stage, 8 = complete
  stageTimings?: Record<number, number>; // stage -> ms
  error?: string | null;
}

export default function PipelineProgress({ currentStage, stageTimings = {}, error }: PipelineProgressProps) {
  const stages: StageInfo[] = PIPELINE_STAGES.map((s) => ({
    ...s,
    status:
      error && s.stage === currentStage
        ? 'error'
        : s.stage < currentStage
        ? 'complete'
        : s.stage === currentStage
        ? 'running'
        : 'pending',
    duration_ms: stageTimings[s.stage],
  }));

  return (
    <div className="glass-card-static" style={{ padding: '24px', marginBottom: '24px' }}>
      <h3 style={{
        fontSize: '0.875rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{
          display: 'inline-block',
          animation: currentStage > 0 && currentStage <= 7 ? 'spin-slow 2s linear infinite' : 'none',
        }}>
          {currentStage > 7 ? '✅' : '⚡'}
        </span>
        {currentStage > 7
          ? 'Pipeline Complete'
          : currentStage > 0
          ? 'Processing with 7 AI Agents...'
          : 'Ready to Process'}
      </h3>

      {/* Progress bar */}
      <div style={{
        height: '4px',
        background: 'var(--bg-glass)',
        borderRadius: '2px',
        marginBottom: '20px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${Math.min((currentStage / 7) * 100, 100)}%`,
          background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple), var(--accent-cyan))',
          borderRadius: '2px',
          transition: 'width 0.5s ease-out',
        }} />
      </div>

      {/* Stages list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {stages.map((stage) => (
          <div
            key={stage.stage}
            className={`pipeline-stage ${stage.status}`}
            style={{
              opacity: stage.status === 'pending' ? 0.4 : stage.status === 'complete' ? 0.65 : 1,
            }}
          >
            <div className={`stage-indicator ${stage.status}`}>
              {stage.status === 'complete' ? '✓' : stage.status === 'error' ? '✕' : stage.stage}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: stage.status === 'running' ? 700 : 500,
                  color: stage.status === 'running' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}>
                  {stage.name}
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'monospace',
                  flexShrink: 0,
                }}>
                  {stage.model}
                </span>
              </div>
              {stage.status === 'running' && (
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--accent-blue)',
                  marginTop: '2px',
                }}>
                  {stage.description}
                </div>
              )}
              {stage.duration_ms !== undefined && (
                <div style={{
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                }}>
                  {(stage.duration_ms / 1000).toFixed(1)}s
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          color: 'var(--accent-rose)',
        }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
}

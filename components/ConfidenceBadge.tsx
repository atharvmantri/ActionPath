'use client';

import React from 'react';
import { getConfidenceLevel } from '@/lib/utils';

interface ConfidenceBadgeProps {
  confidence: number;
  showLabel?: boolean;
}

export default function ConfidenceBadge({ confidence, showLabel = true }: ConfidenceBadgeProps) {
  const level = getConfidenceLevel(confidence);

  const config = {
    high: { label: 'High', icon: '✓', className: 'badge-high' },
    medium: { label: 'Medium', icon: '~', className: 'badge-medium' },
    review: { label: 'Review', icon: '!', className: 'badge-review' },
  };

  const { label, icon, className } = config[level];

  return (
    <span className={`badge ${className}`} title={`Confidence: ${Math.round(confidence * 100)}%`}>
      <span>{icon}</span>
      {showLabel && <span>{label}</span>}
    </span>
  );
}

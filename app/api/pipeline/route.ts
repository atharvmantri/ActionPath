// ============================================================
// ActionPath — Pipeline API Route (Server-Side)
// Orchestrates all 7 Gemini stages sequentially
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import {
  stage1Classify,
  stage2Extract,
  stage3Score,
  stage4Fuse,
  stage5Plan,
  stage6Rewrite,
  stage7QA,
} from '@/lib/gemini';
import type { StudentContext, PipelineResponse } from '@/lib/schema';

export const maxDuration = 60; // Allow up to 60s for full pipeline

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, studentContext } = body as {
      text: string;
      studentContext?: StudentContext;
    };

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Please provide at least 10 characters of text to process.' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please set GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // Stage 1: Classify
    const stage1 = await stage1Classify(text);

    // Stage 2: Extract
    const stage2 = await stage2Extract(text, stage1);

    // Stage 3: Score
    const stage3 = await stage3Score(stage2, stage1);

    // Stage 4: Fuse with context
    const stage4 = await stage4Fuse(stage2, stage3, studentContext ?? null);

    // Stage 5: Plan
    const stage5 = await stage5Plan(stage2, stage3, stage4, studentContext ?? null);

    // Stage 6: Rewrite
    const stage6 = await stage6Rewrite(stage2, stage3, stage5);

    // Stage 7: QA
    const stage7 = await stage7QA(stage2, stage5, stage6);

    const response: PipelineResponse = {
      pipeline_version: '2.0',
      processed_at: new Date().toISOString(),
      stage_1_classify: stage1,
      stage_2_extract: stage2,
      stage_3_score: stage3,
      stage_4_fuse: stage4,
      stage_5_plan: stage5,
      stage_6_rewrite: stage6,
      stage_7_qa: stage7,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error('Pipeline error:', error);
    const message = error instanceof Error ? error.message : 'Unknown pipeline error';
    return NextResponse.json(
      { error: `Pipeline failed: ${message}` },
      { status: 500 }
    );
  }
}

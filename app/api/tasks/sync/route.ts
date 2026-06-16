import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { syncUserPlanData } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('actionpath_session')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = verifySession(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    
    const body = await req.json();
    
    // Validate request keys
    const syncedData = await syncUserPlanData(userId, {
      tasks: body.tasks,
      completed_task_ids: body.completed_task_ids,
      streak: body.streak,
      mood_history: body.mood_history,
      effort_feedback: body.effort_feedback,
      pipeline_result: body.pipeline_result,
    });
    
    return NextResponse.json({ success: true, data: syncedData });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}

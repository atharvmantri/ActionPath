import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySession } from '@/lib/auth';
import { getUserById, getUserPlanData } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('actionpath_session')?.value;
    
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    
    const userId = verifySession(token);
    if (!userId) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }
    
    const userData = await getUserPlanData(userId);
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
      },
      data: userData,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}

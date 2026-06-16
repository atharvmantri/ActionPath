import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserByUsername, getUserPlanData } from '@/lib/db';
import { hashPassword, signSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required.' },
        { status: 400 }
      );
    }
    
    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 400 }
      );
    }
    
    const expectedHash = hashPassword(password, user.salt);
    if (user.passwordHash !== expectedHash) {
      return NextResponse.json(
        { error: 'Invalid username or password.' },
        { status: 400 }
      );
    }
    
    const token = signSession(user.id);
    const cookieStore = await cookies();
    cookieStore.set('actionpath_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    
    const userData = await getUserPlanData(user.id);
    
    return NextResponse.json({
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

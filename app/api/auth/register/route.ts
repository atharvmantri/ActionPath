import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserByUsername, createUser } from '@/lib/db';
import { generateSalt, hashPassword, signSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    if (!username || !password || username.trim().length < 3 || password.length < 6) {
      return NextResponse.json(
        { error: 'Username must be at least 3 chars and password at least 6 chars.' },
        { status: 400 }
      );
    }
    
    const existing = await getUserByUsername(username);
    if (existing) {
      return NextResponse.json(
        { error: 'Username is already taken.' },
        { status: 400 }
      );
    }
    
    const salt = generateSalt();
    const hash = hashPassword(password, salt);
    
    const newUser = await createUser(username, hash, salt);
    const token = signSession(newUser.id);
    
    const cookieStore = await cookies();
    cookieStore.set('actionpath_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    
    return NextResponse.json({
      id: newUser.id,
      username: newUser.username,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 }
    );
  }
}

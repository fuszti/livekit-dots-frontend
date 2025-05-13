import { NextResponse } from "next/server";
import { cookies } from 'next/headers';

// Password should be stored securely in environment variables
const CORRECT_PASSWORD = process.env.APP_PASSWORD || 'default_password';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password === CORRECT_PASSWORD) {
      // Set authentication cookie
      const cookieStore = cookies();
      cookieStore.set('auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
} 
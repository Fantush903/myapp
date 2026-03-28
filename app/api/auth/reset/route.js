import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { initDb, findUserByEmail, setResetCode, resetPassword } from '../../../../lib/db'

export async function POST(request) {
  try {
    await initDb()
    const { email } = await request.json()

    if (!email)
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    if (!await findUserByEmail(email))
      return NextResponse.json({ error: 'No account found with this email' }, { status: 404 })

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    await setResetCode(email, resetCode)

    return NextResponse.json({
      success: true,
      resetCode,
      message: 'Reset code generated! In production this would be emailed.'
    })
  } catch (err) {
    console.error('Reset request error:', err)
    return NextResponse.json({ error: 'Could not connect to database. Check your .env.local file.' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    await initDb()
    const { email, resetCode, newPassword } = await request.json()

    if (!email || !resetCode || !newPassword)
      return NextResponse.json({ error: 'Email, reset code and new password are required' }, { status: 400 })

    if (newPassword.length < 6)
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    const ok             = await resetPassword(email, resetCode, hashedPassword)

    if (!ok)
      return NextResponse.json({ error: 'Invalid reset code. Please try again.' }, { status: 401 })

    return NextResponse.json({ success: true, message: 'Password updated! You can now log in.' })
  } catch (err) {
    console.error('Reset password error:', err)
    return NextResponse.json({ error: 'Could not connect to database. Check your .env.local file.' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'

export async function POST(request) {
  const { name, email, password } = await request.json()

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: name, email, password }),
  })

  const data = await res.json()

  if (!res.ok) return NextResponse.json({ error: data.error }, { status: res.status })

  return NextResponse.json({ success: true, user: { email, name } })
}
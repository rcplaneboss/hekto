import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireAdminAuth } from '@/lib/api-auth-utils'

export async function POST(req: NextRequest) {
  // Check authorization
  const authError = await requireAdminAuth(req)
  if (authError) return authError

  const body = await req.json()
  const id = body?.id as string
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  await prisma.heroBanner.delete({ where: { id } })
  try { revalidatePath('/') } catch (e) {}

  return NextResponse.json({ success: true })
}

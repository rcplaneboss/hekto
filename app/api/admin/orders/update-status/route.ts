import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { requireAdminAuth } from '@/lib/api-auth-utils'
import { emailService } from '@/lib/email-service'

export async function POST(req: NextRequest) {
  // Check authorization
  const authError = await requireAdminAuth(req)
  if (authError) return authError

  const body = await req.json()
  const id = body?.id as string
  const status = body?.status as string
  if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })

  // Validate status is a valid OrderStatus enum value
  const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  await prisma.order.update({ where: { id }, data: { status: status as any } })
  
  // Send email notification for status updates
  try {
    await emailService.sendOrderStatusUpdate(id, status)
  } catch (error) {
    console.error('Failed to send status update email:', error)
  }
  
  try { revalidatePath('/admin/orders') } catch (e) {}

  return NextResponse.json({ success: true })
}

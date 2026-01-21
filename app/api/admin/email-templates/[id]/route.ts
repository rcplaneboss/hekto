import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminAuth } from '@/lib/api-auth-utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const template = await prisma.emailTemplate.findUnique({
    where: { id }
  });

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  return NextResponse.json(template);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  const { id } = await params;
  const body = await req.json();

  try {
    const template = await prisma.emailTemplate.update({
      where: { id },
      data: {
        name: body.name,
        subject: body.subject,
        htmlContent: body.htmlContent,
        textContent: body.textContent,
        variables: body.variables,
        isActive: body.isActive,
      }
    });

    return NextResponse.json(template);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}
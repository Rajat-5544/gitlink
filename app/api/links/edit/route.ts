import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/utils/authOptions';
import prisma from '@/app/libs/prismadb';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch (error) {
    console.error("Failed to parse request body:", error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { id, revoked }: { id: string; revoked: boolean } = body;

  if (!id || revoked === undefined) {
    return NextResponse.json({ error: 'Missing link id or revoked' }, { status: 400 });
  }

  try {
    await prisma.link.update({
      where: { id },
      data: { revoked },
    });
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("Failed to update link:", error);
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
  }
}
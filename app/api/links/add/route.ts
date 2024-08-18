import { Link } from "@prisma/client";
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/app/libs/prismadb';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const { repoId, repoName }: { repoId: number; repoName: string } = body;
  if (!repoId) {
    return NextResponse.json({ error: 'missing repoId' }, { status: 400 });
  }

  try {
    const link = await prisma.link.create({
      data: {
        userId: session.user.id as string,
        repoId,
        repoName,
      },
    });
    const withCount: Link & { _count: { uses: number } } = {
      ...link,
      _count: { uses: 0 },
    };
    return NextResponse.json(withCount, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}

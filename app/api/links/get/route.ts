import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/utils/authOptions';
import prisma from '@/app/libs/prismadb';
import { Link} from "@/app/dashboard/dashboard";

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

  if (!body?.repoIds) {
    return NextResponse.json({ error: 'Missing repoIds' }, { status: 400 });
  }

  try {
    const links: Link[] = await prisma.link.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      where: {
        userId: session.user.id as string,
        repoId: {
          in: body.repoIds,
        },
      },
      select: {
        id: true,
        repoId: true,
        revoked: true,
        _count: {
          select: {
            uses: true,
          },
        },
      },
    });

    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch links:", error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}




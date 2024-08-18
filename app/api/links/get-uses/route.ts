import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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

  if (!body?.id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  try {
    const link = await prisma.link.findUnique({
      where: {
        id: body.id,
      },
      select: {
        uses: {
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
          select: {
            user: {
              select: {
                githubUsername: true,
              },
            },
          },
        },
      },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json(link, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch link uses:", error);
    return NextResponse.json({ error: 'Failed to fetch link uses' }, { status: 500 });
  }
}

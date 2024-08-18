import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/utils/authOptions';
import accessToken from '@/app/libs/accessToken';
import prisma from '@/app/libs/prismadb';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const { id }: { id: string } = body;
  if (!id) {
    return NextResponse.json({ error: 'missing link id' }, { status: 400 });
  }

  const link = await prisma.link.findUnique({
    where: { id },
    select: {
      repoId: true,
      user: {
        include: { accounts: true },
      },
    },
  });

  if (!link) {
    return NextResponse.json({ error: 'link not found' }, { status: 404 });
  }

  const token = link.user.accounts[0]?.access_token;
  if (!token) {
    return NextResponse.json({ error: 'No access token available' }, { status: 400 });
  }

  const result = await fetch(
    `https://api.github.com/repositories/${link.repoId}/collaborators/${
      session?.user.githubUsername as string
    }`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        accept: 'application/vnd.github.v3+json',
        "Content-Length": "0",
      },
    }
  );

  if (result.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  if (!result.ok) {
    return NextResponse.json({ error: 'Failed to invite collaborator' }, { status: result.status });
  }

  const json = await result.json();

  if (result.status !== 201) {
    return NextResponse.json({ error: json.message }, { status: 400 });
  }

  const invitationId = json.id;

  const userToken = await accessToken(session.user.id);

  // accept the invitation
  const invitePromise =  fetch(
    `https://api.github.com/user/repository_invitations/${invitationId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `token ${userToken}`,
        accept: 'application/vnd.github.v3+json',
      },
    }
  );

  const dbPromise = await prisma.use.create({
    data: {
      userId: session?.user.id as string,
      linkId: id,
    },
  });

  const [inviteResult] = await Promise.all([invitePromise, dbPromise]);

  if (!inviteResult.ok) {
    return NextResponse.json({ error: 'Failed to accept invitation' }, { status: inviteResult.status });
  }

  return NextResponse.json({ message: 'Invitation sent successfully' }, { status: 200 });
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import accessToken from '@/app/libs/accessToken';
import createUrl from '@/app/libs/createUrl';
import parseLinkHeader from "parse-link-header";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const body = await req.json();
  const { page }: { page: number } = body;
  if (!page) {
    return NextResponse.json({ message: 'missing page' }, { status: 400 });
  }

  const userId = session.user.id;
  const token = await accessToken(userId as string);
  const url = createUrl('https://api.github.com/user/repos', {
    affiliation: 'owner',
    sort: 'updated',
    page: page.toString(),
  });
  const result = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      accept: 'application/vnd.github.v3+json',
    },
  });

  if (!result.ok) {
    const errorText = await result.text();
    console.error('GitHub API error:', errorText);
    return NextResponse.json({ message: 'Error fetching repos' }, { status: 500 });
  }

  let last = page;
  const linkHeaders = parseLinkHeader(result.headers.get('Link') || '');

  if (linkHeaders && linkHeaders.last && linkHeaders.last.page) {
    last = parseInt(linkHeaders.last.page, 10);
  }

  const repos = await result.json();

  return NextResponse.json({
    repos,
    last,
  });
}


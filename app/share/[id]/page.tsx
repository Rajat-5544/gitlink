'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import NotSignedIn from '@/app/(site)/components/NotSignedIn';
import { useParams } from 'next/navigation';

const LinkPage = () => {
  const { status } = useSession();
  const [invite, setInvite] = useState('not sent');
  const [loading, setLoading] = useState(false);
  const [repoName, setRepoName] = useState('');
  const params = useParams();

  useEffect(() => {
    const fetchRepo = async () => {
      const id = params.id as string;
      if (id) {
        try {
          const res = await fetch(`/api/links/${id}`);
          const data = await res.json();
          setRepoName(data.repoName);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchRepo();
  }, [params.id]);

  const sendInvite = async () => {
    setLoading(true);
    const res= await fetch('/api/github/send-invite', {
      method: 'POST',
      body: JSON.stringify({
        id: params.id,
      }),
    });

    if (res.status >= 300) {
      const { error } = await res.json();
      alert("Error: " + error);
      setLoading(false);
      return;
    }
    window.location.href = `https://github.com/${repoName}`;
    setLoading(false);
  };

  if (status === 'unauthenticated') {
    return <NotSignedIn />;
  }

  return (
    <main className="px-8 py-16 min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl">
        You have been invited to{' '}
        <a
          href={`https://github.com/${repoName}`}
          className="hover:underline text-primary-600 font-bold"
        >
          {repoName}
        </a>
      </h1>
      <button
        className="text-lg btn"
        disabled={loading}
        onClick={() => sendInvite()}
      >
        {loading ? "Accepting..." : "Accept Invite"}  
      </button>
    </main>
  );
};

export default LinkPage;



import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    githubUsername?: string;
  }
  
  interface Session {
    user: {
      id: string;
      githubUsername?: string;
    } & DefaultSession['user'];
  }
}
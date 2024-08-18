"use client";
import SignInButton from "./components/SignInButton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);
  
  return (
    <main>
        <section className="container px-8 py-16 mx-auto min-h-screen flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute -left-1 sm:-left-1.5 -right-1 sm:-right-1.5 bottom-0.5 sm:bottom-1.5 h-4 sm:h-6 bg-primary-200 rounded-md sm:rounded-lg" />
            <h1 className="relative text-6xl sm:text-8xl font-bold text-center">
              gitlink
            </h1>
          </div>
          <h2 className="text-2xl sm:text-3xl text-center font-light">
            Link sharing for GitHub repositories.
          </h2>
          <div className="mt-4">
            {status === "loading" ? (
              <div className="cta-btn">Get Started</div>
            ) : status === "unauthenticated" ? (
              <>
                <SignInButton className="cta-btn">Get Started</SignInButton>
              </>
            ) : null
            }
          </div>
        </section>
      </main>
  );
}
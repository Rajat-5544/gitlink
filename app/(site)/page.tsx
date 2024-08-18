"use client";
import SignInButton from "./components/SignInButton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

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
        <section className="bg-primary-50 w-full">
          <div className="max-w-5xl w-full mx-auto px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
              <div className="md:text-right order-1 px-6 md:px-0">
                <h2 className="text-2xl font-semibold">Step 1</h2>
                <p>Sign in, then create a link in your dashboard.</p>
              </div>
              <div className="order-2">
              <Image src="/step-1.png" alt="Step 1" layout="responsive" width={500} height={300} />
              </div>
              <div className="order-3 md:order-4 px-6 md:px-0">
                <h2 className="text-2xl font-semibold">Step 2</h2>
                <p>
                  Send the link to someone you want to invite to your
                  repository.
                </p>
              </div>
              <div className="order-4 md:order-3">
                <Image src="/step-2.png" alt="Step 2" layout="responsive" width={500} height={300} />
              </div>
              <div className="md:text-right order-5 px-6 md:px-0">
                <h2 className="text-2xl font-semibold">Step 3</h2>
                <p>
                  When they click the link and accept the invite, they'll be
                  added to the repository!
                </p>
              </div>
              <div className="order-6">
                <Image src="/step-3.png" alt="Step 3" layout="responsive" width={500} height={300} />
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
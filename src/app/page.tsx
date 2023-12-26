"use client";

import Link from "next/link";
import { useAtom } from "jotai";

import RegistrationSection from "./registration-section";
import Challenge1 from "./challenge-1";
import { usernameAtom } from "./store";

export default function Home() {
  const [username] = useAtom(usernameAtom);

  return (
    <>
      <div className="max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-2">Register Your Twitter ID</h2>
        <p>
          Fill in your Twitter ID (not display name) to help us identify you and
          record your score.
        </p>
        <RegistrationSection />
      </div>

      {username !== undefined ? (
        <>
          <div className="max-w-3xl w-full">
            <h2 className="text-2xl font-bold mb-2">Challenge 1 - Check In</h2>
            <Challenge1 />
          </div>

          <div className="max-w-3xl w-full">
            <h2 className="text-2xl font-bold mb-2">Challenge 2 - Injection</h2>
          </div>

          <div className="max-w-3xl w-full">
            <h2 className="text-5xl font-bold mb-4">🎉</h2>
            <p>
              Congratulations. You’ve found the final flag! Repost this website
              via Twitter to receive your reward. You can also check out your
              rank{" "}
              <Link className="text-blue-500 hover:underline" href="/ranking">
                here
              </Link>
              .
            </p>
          </div>
        </>
      ) : null}
    </>
  );
}

"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";

import RegistrationSection from "./registration-section";
import Challenge1 from "./challenge-1";
import Challenge2 from "./challenge-2";
import Feedback from "./feedback";
import { completedAtom, unlockedChallengesAtom } from "./store";

export default function Home() {
  const unlockedChallenges = useAtomValue(unlockedChallengesAtom);
  const completed = useAtomValue(completedAtom);

  return (
    <>
      <div className="max-w-3xl w-full">
        <RegistrationSection />
      </div>

      {unlockedChallenges >= 1 ? (
        <div className="max-w-3xl w-full">
          <Challenge1 />
        </div>
      ) : null}

      {unlockedChallenges >= 2 ? (
        <div className="max-w-3xl w-full">
          <Challenge2 />
        </div>
      ) : null}

      {completed ? (
        <div className="max-w-3xl w-full">
          <h2 className="text-5xl font-bold mb-4">🎉</h2>
          <p>
            Congratulations. You’ve found the final flag!{" "}
            <a
              className="text-blue-500 hover:underline"
              target="_blank"
              href="https://twitter.com/intent/tweet?text=I%20just%20finished%20the%20challenge%20of%20CTF%202024!%20%40unixzii%0ATry%20it%20here%3A%20https%3A%2F%2Fctf.cyandev.app"
            >
              Tweet
            </a>{" "}
            this website to receive your reward. You can also check out your
            rank{" "}
            <Link className="text-blue-500 hover:underline" href="/ranking">
              here
            </Link>
            .
          </p>
          <Feedback />
        </div>
      ) : null}
    </>
  );
}

"use client";

import Link from "next/link";
import { useAtomValue } from "jotai";

import RegistrationSection from "./registration-section";
import Challenge1 from "./challenge-1";
import Challenge2 from "./challenge-2";
import Feedback from "./feedback";
import {
  wantsFeedbackAtom,
  completedAtom,
  unlockedChallengesAtom,
} from "./store";

export default function Home() {
  const unlockedChallenges = useAtomValue(unlockedChallengesAtom);
  const wantsFeedback = useAtomValue(wantsFeedbackAtom);
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
            Congratulations. You’ve found the final flag! Repost this website
            via Twitter to receive your reward. You can also check out your rank{" "}
            <Link className="text-blue-500 hover:underline" href="/ranking">
              here
            </Link>
            .
          </p>
          {wantsFeedback ? <Feedback /> : null}
        </div>
      ) : null}
    </>
  );
}

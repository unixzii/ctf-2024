import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useAtom, useAtomValue } from "jotai";

import { wantsFeedbackAtom, usernameAtom } from "./store";
import type { CommonAPIResponse } from "./backend-api";

async function doFeedback(username: string, index: number): Promise<void> {
  const resp = await fetch("/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      item: index,
    }),
  });
  const respBody = (await resp.json()) as CommonAPIResponse;
  if (!respBody.ok) {
    throw new Error("failed to submit feedback: " + respBody.err);
  }
}

interface FeedbackButtonProps {
  emoji: string;
  label: string;
  index: number;
  onClick: (index: number) => void;
}

function FeedbackButton(props: FeedbackButtonProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState([0, 0]);
  useLayoutEffect(() => {
    const spanEl = spanRef.current;
    if (!spanEl) {
      return;
    }
    setPosition([
      spanEl.offsetLeft + (spanEl.offsetWidth - 100) / 2,
      spanEl.offsetTop,
    ]);
  }, [spanRef, setPosition]);

  return (
    <div
      className="relative inline-block mx-1.5 hover:scale-125 active:scale-110 active:opacity-50 cursor-pointer transition-all duration-100 last:*:transition-opacity last:*:duration-100 last:*:opacity-0 last:*:hover:opacity-100"
      onClick={() => {
        props.onClick(props.index);
      }}
    >
      <span ref={spanRef}>{props.emoji}</span>
      <p
        className="absolute text-zinc-500 pointer-events-none"
        style={{
          left: position[0],
          top: position[1] + 16,
          width: 100,
          fontSize: "9px",
        }}
      >
        {props.label}
      </p>
    </div>
  );
}

export default function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  const [wantsFeedback, setWantsFeedback] = useAtom(wantsFeedbackAtom);
  const username = useAtomValue(usernameAtom);
  const [show, setShow] = useState(wantsFeedback);
  const feedbackToken = useRef(1);

  const handleFeedback = useCallback(
    (index: number) => {
      if (!username) {
        return;
      }

      setSubmitted(true);
      setWantsFeedback(false);

      if (!feedbackToken.current) {
        return;
      }
      feedbackToken.current = 0;

      doFeedback(username, index);
      setTimeout(() => {
        setShow(false);
      }, 3000);
    },
    [setSubmitted, setWantsFeedback, username, setShow, feedbackToken]
  );

  useEffect(() => {
    if (wantsFeedback) {
      setShow(true);
    }
  }, [setShow, wantsFeedback]);

  if (!show) {
    return null;
  }

  return (
    <div className="relative mt-6 py-5 border rounded-md bg-zinc-950 border-zinc-800 text-center overflow-hidden">
      <p className="mb-2 text-sm text-zinc-400">
        What do you think of this challenge?
      </p>
      <p className="text-2xl">
        <FeedbackButton
          emoji="😌"
          label="Boring"
          index={0}
          onClick={handleFeedback}
        />
        <FeedbackButton
          emoji="😄"
          label="Easy"
          index={1}
          onClick={handleFeedback}
        />
        <FeedbackButton
          emoji="🥹"
          label="Moderate"
          index={2}
          onClick={handleFeedback}
        />
        <FeedbackButton
          emoji="😣"
          label="Hard"
          index={3}
          onClick={handleFeedback}
        />
        <FeedbackButton
          emoji="🤯"
          label="WTF"
          index={4}
          onClick={handleFeedback}
        />
      </p>

      {submitted ? (
        <div className="absolute flex left-0 top-0 w-full h-full items-center justify-center font-medium bg-zinc-950 text-zinc-400">
          Thank you!
        </div>
      ) : null}
    </div>
  );
}

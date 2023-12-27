import { useState } from "react";
import { useAtom } from "jotai";

import Input from "./input";
import { usernameAtom } from "./store";
import { isValidTwitterUsername } from "./utils";
import type { CommonAPIResponse } from "./backend-api";

async function doRegister(username: string): Promise<void> {
  const resp = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
    }),
  });
  const respBody = (await resp.json()) as CommonAPIResponse;
  if (!respBody.ok) {
    throw new Error("failed to sign up: " + respBody.err);
  }
}

export default function RegistrationSection() {
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useAtom(usernameAtom);

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Register Your Twitter ID</h2>
      <p>
        Fill in your Twitter ID (not display name) to help us identify you and
        record your score.
      </p>
      <Input
        placeholder="Twitter ID"
        buttonLabel="Start"
        value={username}
        busy={submitting}
        disabled={!!username}
        onSubmit={async (value) => {
          if (!isValidTwitterUsername(value)) {
            alert("Your input is not a valid Twitter username.");
            return;
          }

          setSubmitting(true);

          try {
            await doRegister(value);
            setUsername(value);
          } catch (err) {
            console.error(err);
            alert(
              "Failed to register your Twitter ID, please check console for more information."
            );
          } finally {
            setSubmitting(false);
          }
        }}
      />
    </>
  );
}

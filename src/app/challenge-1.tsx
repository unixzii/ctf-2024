import { useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import Input from "./input";
import { submitFlag1 } from "./engine";
import { usernameAtom, flag1Atom } from "./store";
import { nextTick } from "./utils";

export default function Challenge1() {
  const [submitting, setSubmitting] = useState(false);
  const [flag1, setFlag1] = useAtom(flag1Atom);
  const username = useAtomValue(usernameAtom);

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">
        Challenge 1 - Check In{flag1 ? " ✅" : ""}
      </h2>
      <Input
        placeholder="Flag"
        buttonLabel="Submit"
        value={flag1}
        busy={submitting}
        disabled={!!flag1}
        secret
        onSubmit={(value) => {
          setSubmitting(true);
          nextTick(async () => {
            try {
              if (await submitFlag1(value, username!!)) {
                setFlag1(value);
              } else {
                alert("The flag is wrong!");
              }
            } catch (err) {
              console.error(err);
              alert(
                "Failed to submit the flag, please check console for more information."
              );
            } finally {
              setSubmitting(false);
            }
          });
        }}
      />
      {flag1 ? (
        <p className="text-zinc-500 italic">
          Thanks for your participation! If you tried but still can’t find the
          final flag, then you can quit now and receive your reward of this
          stage.
        </p>
      ) : null}
    </>
  );
}

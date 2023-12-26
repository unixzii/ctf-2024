import { useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import Input from "./input";
import { submitFlag2 } from "./engine";
import { usernameAtom, flag2Atom } from "./store";
import { nextTick } from "./utils";

export default function Challenge2() {
  const [submitting, setSubmitting] = useState(false);
  const [flag2, setFlag2] = useAtom(flag2Atom);
  const username = useAtomValue(usernameAtom);

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">
        Challenge 2 - Injection{flag2 ? " ✅" : ""}
      </h2>
      <Input
        placeholder="Flag"
        buttonLabel="Submit"
        value={flag2}
        busy={submitting}
        disabled={!!flag2}
        secret
        onSubmit={(value) => {
          setSubmitting(true);
          nextTick(async () => {
            try {
              if (await submitFlag2(value, username!!)) {
                setFlag2(value);
              } else {
                alert("The flag is wrong!");
              }
            } catch (err) {
              alert(
                "Failed to submit the flag, please check console for more information."
              );
            } finally {
              setSubmitting(false);
            }
          });
        }}
      />
    </>
  );
}

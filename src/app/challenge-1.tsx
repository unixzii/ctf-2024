import { useState } from "react";
import { useAtomValue } from "jotai";

import Input from "./input";
import { submitFlag1 } from "./engine";
import { usernameAtom } from "./store";
import { nextTick } from "./utils";

export default function Challenge1() {
  const [submitting, setSubmitting] = useState(false);
  const username = useAtomValue(usernameAtom);

  return (
    <Input
      placeholder="Flag"
      buttonLabel="Submit"
      busy={submitting}
      secret
      onSubmit={(value) => {
        setSubmitting(true);
        nextTick(async () => {
          try {
            await submitFlag1(value, username!!);
          } finally {
            setSubmitting(false);
          }
        });
      }}
    />
  );
}

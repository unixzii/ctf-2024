import { useState } from "react";
import { WritableAtom, useAtom, useAtomValue } from "jotai";

import Input from "./input";
import { usernameAtom } from "./store";
import { nextTick } from "./utils";

export interface ChallengeProps<AArgs extends any[], AResult> {
  flagAtom: WritableAtom<string | undefined, AArgs, AResult>;
  title: string;
  onSubmit: (value: string, username: string) => Promise<boolean>;
  contentsWhenComplete?: JSX.Element;
}

export default function Challenge<AResult>(
  props: ChallengeProps<[string], AResult>
) {
  const { flagAtom, title, onSubmit, contentsWhenComplete } = props;

  const [submitting, setSubmitting] = useState(false);
  const [flag, setFlag] = useAtom(flagAtom);
  const username = useAtomValue(usernameAtom);

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">
        {`${title}${flag ? " ✅" : ""}`}
      </h2>
      <Input
        placeholder="Flag"
        buttonLabel="Submit"
        value={flag}
        busy={submitting}
        disabled={!!flag}
        secret
        onSubmit={(value) => {
          setSubmitting(true);
          nextTick(async () => {
            try {
              if (await onSubmit(value, username!!)) {
                setFlag(value);
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
      {flag ? contentsWhenComplete : null}
    </>
  );
}

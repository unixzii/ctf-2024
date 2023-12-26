import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { isValidTwitterUsername } from "./utils";

export const usernameAtom = atomWithStorage<string | undefined>(
  "username",
  undefined
);

export const wantsFeedbackAtom = atom(false);

export const flag1Atom = atomWithStorage<string | undefined>(
  "flag1",
  undefined
);
export const flag2InternalAtom = atomWithStorage<string | undefined>(
  "flag2",
  undefined
);
export const flag2Atom = atom(
  (read) => {
    return read(flag2InternalAtom);
  },
  (read, write, arg: string) => {
    if (read(flag2InternalAtom) === undefined) {
      // Request feedbacks when the user finished this challenge.
      write(wantsFeedbackAtom, true);
    }

    write(flag2InternalAtom, arg);
  }
);

export const unlockedChallengesAtom = atom((read) => {
  const username = read(usernameAtom);
  const flag1 = read(flag1Atom);

  if (!username || !isValidTwitterUsername(username)) {
    return 0;
  }

  if (!flag1) {
    return 1;
  }

  return 2;
});

export const completedAtom = atom((read) => {
  return !!read(flag1Atom) && !!read(flag2Atom);
});

import { atomWithStorage } from "jotai/utils";

export const usernameAtom = atomWithStorage<string | undefined>(
  "username",
  undefined
);

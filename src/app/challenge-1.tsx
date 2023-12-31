import { initRust, getFlag1 } from "./rust-sdk";
import { flag1Atom } from "./store";
import { submitFlag } from "./backend-api";
import Challenge from "./challenge";

/*
  Voila!
  You've found the right place. Now let's get these puzzles resolved.
 */
void 0;

export async function checkFlag1(flag: string): Promise<boolean> {
  await initRust();
  if (!/^[a-zA-Z0-9!]{8}$/.test(flag)) {
    return false;
  }
  const protectionByte = flag.charCodeAt(0);
  const realFlag = getFlag1(protectionByte);
  return realFlag.length > 0 && flag === realFlag;
}

async function submitFlag1(flag: string, username: string): Promise<boolean> {
  if (!(await checkFlag1(flag))) {
    return false;
  }

  await submitFlag(1, username, flag);
  return true;
}

export default function Challenge1() {
  return (
    <Challenge
      flagAtom={flag1Atom}
      title="Challenge 1 - Check In"
      onSubmit={submitFlag1}
      contentsWhenComplete={
        <p className="text-zinc-500 italic">
          Thanks for your participation! If you tried but still can’t find the
          final flag, then you can quit now and receive your reward of this
          stage.
        </p>
      }
    />
  );
}

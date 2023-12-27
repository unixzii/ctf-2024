import { initRust } from "./engine";
import { flag2Atom } from "./store";
import { submitFlag } from "./backend-api";
import Challenge from "./challenge";

async function checkFlag2(flag: string): Promise<boolean> {
  await initRust();
  return false;
}

async function submitFlag2(flag: string, username: string): Promise<boolean> {
  if (!(await checkFlag2(flag))) {
    return false;
  }

  await submitFlag(2, username, flag);
  return true;
}

export default function Challenge2() {
  return (
    <Challenge
      flagAtom={flag2Atom}
      title="Challenge 2 - Bytecode"
      onSubmit={submitFlag2}
    />
  );
}

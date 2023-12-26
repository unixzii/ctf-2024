import { submitFlag2 } from "./engine";
import { flag2Atom } from "./store";
import Challenge from "./challenge";

export default function Challenge2() {
  return (
    <Challenge
      flagAtom={flag2Atom}
      title="Challenge 2 - Bytecode"
      onSubmit={submitFlag2}
    />
  );
}

import { submitFlag1 } from "./engine";
import { flag1Atom } from "./store";
import Challenge from "./challenge";

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

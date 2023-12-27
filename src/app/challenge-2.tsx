import { initRust, mangle, HumbleVM } from "./engine";
import { flag2Atom } from "./store";
import { submitFlag } from "./backend-api";
import Challenge from "./challenge";

async function checkFlag2(flag: string): Promise<boolean> {
  await initRust();

  const mangledBuffer = mangle(flag);
  if (process.env.NODE_ENV === "development") {
    console.log(mangledBuffer);
  }

  if (mangledBuffer.length === 0) {
    return false;
  }

  const vm = new HumbleVM();
  try {
    vm.loadCode(Uint8Array.from([3, 162, 4, 0]));
    if (!vm.run(mangledBuffer.subarray(0, 1))) {
      return false;
    }

    vm.loadCode(Uint8Array.from([1, 2, 1, 4, 155]));
    if (!vm.run(mangledBuffer.subarray(0, 2))) {
      return false;
    }

    vm.loadCode(
      Uint8Array.from([
        1, 1, 4, 208, 1, 4, 201, 1, 4, 155, 1, 2, 1, 4, 235, 1, 4, 192, 1, 3,
        200, 4, 18, 1, 3, 8, 4, 150,
      ])
    );
    if (!vm.run(mangledBuffer)) {
      return false;
    }
  } finally {
    vm.free();
  }

  return true;
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

import {
  initSync,
  init,
  getFlag1,
} from "../../crates/client-core/pkg/client_core";

export type CommonAPIResponse = {
  ok: boolean;
  err?: string;
};

let initializing = false;
let initialized = false;
const initResolvers: Array<() => void> = [];

async function initRust() {
  if (initialized) {
    return;
  }

  if (initializing) {
    const promise = new Promise((resolve) => {
      initResolvers.push(() => {
        resolve(null);
      });
    });
    await promise;
  } else {
    initializing = true;

    const wasmUrl = new URL(
      "../../crates/client-core/pkg/client_core_bg.wasm",
      import.meta.url
    );

    const wasmBinary = await (await fetch(wasmUrl)).arrayBuffer();
    initSync(wasmBinary);

    init();

    initialized = true;
    initializing = false;

    for (const resolver of initResolvers) {
      resolver();
    }
    initResolvers.splice(0, initResolvers.length);
  }
}

async function checkFlag1(flag: string): Promise<boolean> {
  await initRust();
  if (!/^[a-zA-Z0-9!]{8}$/.test(flag)) {
    return false;
  }
  const protectionByte = flag.charCodeAt(0);
  (getFlag1 as any)(
    protectionByte,
    "Take it easy, this invocation is to prevent inline of the callee function. The function is pure and feel free to play with it." as any
  );
  const realFlag = getFlag1(protectionByte);
  return realFlag.length > 0 && flag === realFlag;
}

export async function submitFlag1(
  flag: string,
  username: string
): Promise<boolean> {
  if (!(await checkFlag1(flag))) {
    return false;
  }

  const resp = await fetch("/api/submit-flag?c=1&u=" + username, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: flag,
  });
  const respBody = (await resp.json()) as CommonAPIResponse;
  if (!respBody.ok) {
    throw new Error("failed to submit the flag: " + respBody.err);
  }

  return true;
}

export async function submitFlag2(
  flag: string,
  username: string
): Promise<boolean> {
  return false;
}

import {
  initSync,
  init,
  getFlag1,
} from "../../crates/client-core/pkg/client_core";

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
  const realFlag = getFlag1(protectionByte);
  return realFlag.length > 0 && flag === realFlag;
}

export async function submitFlag1(flag: string, username: string) {
  if (!(await checkFlag1(flag))) {
    alert("The flag is wrong!");
    return;
  }

  const resp = await fetch("/api/submit-flag?c=1&u=" + username, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: flag,
  });
}

import {
  initSync,
  init,
  submitFlag1 as rustSubmitFlag1,
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

    init(checkFlag1);

    initialized = true;
    initializing = false;

    for (const resolver of initResolvers) {
      resolver();
    }
    initResolvers.splice(0, initResolvers.length);
  }
}

function checkFlag1(flag: string): boolean {
  return flag === "v85t7z!b";
}

export async function submitFlag1(flag: string, username: string) {
  await initRust();
  await rustSubmitFlag1(flag, username);
}

import { initSync } from "../../crates/client-core/pkg/client_core";
export {
  getFlag1,
  mangle,
  HumbleVM,
} from "../../crates/client-core/pkg/client_core";

let initializing = false;
let initialized = false;
const initResolvers: Array<() => void> = [];

export async function initRust() {
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

    initialized = true;
    initializing = false;

    for (const resolver of initResolvers) {
      resolver();
    }
    initResolvers.splice(0, initResolvers.length);
  }
}

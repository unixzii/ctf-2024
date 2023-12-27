/* tslint:disable */
/* eslint-disable */
/**
*/
export function start(): void;
/**
* @param {number} protection_byte
* @returns {string}
*/
export function getFlag1(protection_byte: number): string;
/**
* @param {string} s
* @returns {Uint8Array}
*/
export function mangle(s: string): Uint8Array;
/**
*/
export class HumbleVM {
  free(): void;
/**
*/
  constructor();
/**
* @param {Uint8Array} code
*/
  loadCode(code: Uint8Array): void;
/**
* @param {Uint8Array} memory
* @returns {boolean}
*/
  run(memory: Uint8Array): boolean;
/**
* @returns {string}
*/
  dumpCode(): string;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_humblevm_free: (a: number) => void;
  readonly humblevm_new: () => number;
  readonly humblevm_loadCode: (a: number, b: number, c: number, d: number) => void;
  readonly humblevm_run: (a: number, b: number, c: number, d: number) => void;
  readonly humblevm_dumpCode: (a: number, b: number) => void;
  readonly start: () => void;
  readonly getFlag1: (a: number, b: number) => void;
  readonly mangle: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;

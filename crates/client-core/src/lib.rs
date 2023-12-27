#[cfg(debug_assertions)]
use std::panic;

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
fn start() {
    #[cfg(debug_assertions)]
    panic::set_hook(Box::new(console_error_panic_hook::hook));
}

#[wasm_bindgen(js_name = getFlag1)]
pub fn get_flag_1(protection_byte: u8) -> String {
    #[cold]
    #[inline(never)]
    fn a(n: u8) -> u8 {
        if n > 8 {
            return n - 8;
        }
        return n;
    }

    #[cold]
    #[inline(never)]
    fn b(n: u8) -> u8 {
        if n % 2 != 0 {
            return 0;
        }
        return n / 2;
    }

    let c = b(a(protection_byte));

    if c < 50 || c >= 60 {
        return String::new();
    }

    let seq = [5, 7, 2, 0, 2, 4, 1, 3, 6, 8].to_vec();
    if seq[(c - 50) as usize] != 4 {
        return String::new();
    }

    let mut flag = "85t7z!b".to_owned();
    flag.insert_str(0, "v");

    return flag;
}

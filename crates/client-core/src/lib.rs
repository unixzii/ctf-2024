#![feature(ascii_char)]

mod humble_vm;

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

#[wasm_bindgen]
pub fn mangle(s: &str) -> Vec<u8> {
    if s.len() > 255 {
        return vec![];
    }

    let mut res = vec![(s.len() as u8) ^ 0xaa];

    res.extend(
        s.chars()
            .filter_map(|c| c.as_ascii())
            .map(|c| c.to_u8() ^ 0xaa),
    );

    res
}

#[wasm_bindgen(js_name = "getSubmitUrl")]
pub fn get_submit_url(challenge: u32, username: &str, flag: &str) -> Result<String, String> {
    let checksum = crc32fast::hash(flag.as_bytes());
    let expected_checksum = match challenge {
        1 => 3620553811,
        2 => 1779004475,
        _ => {
            return Err("challenge id is invalid".to_string());
        }
    };
    if checksum != expected_checksum {
        return Err("you are not allowed to access the API endpoint now".to_owned());
    }

    return Ok(format!("/api/submit-flag?c={challenge}&u={username}"));
}

#[cfg(test)]
mod tests {
    use crate::get_submit_url;

    #[test]
    fn test_get_submit_url() {
        let url = get_submit_url(1, "test", "v85t7z!b").unwrap();
        assert_eq!(url, "/api/submit-flag?c=1&u=test");
        let url = get_submit_url(2, "test", "0zc1@jp4").unwrap();
        assert_eq!(url, "/api/submit-flag?c=2&u=test");
    }
}

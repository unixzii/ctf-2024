use std::sync::Mutex;

use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::console;
use web_sys::js_sys::Function;
use web_sys::window;
use web_sys::Request;
use web_sys::RequestInit;

struct JsValueWrapper(JsValue);

unsafe impl Send for JsValueWrapper {}

static CHECK_FLAG_FN: Mutex<Option<JsValueWrapper>> = Mutex::new(None);

#[wasm_bindgen]
pub fn init(check_flag_fn: JsValue) {
    let mut lock_guard = CHECK_FLAG_FN.lock().unwrap();
    *lock_guard = Some(JsValueWrapper(check_flag_fn));
}

#[wasm_bindgen(js_name = submitFlag1)]
pub async fn submit_flag_1(flag: &str, username: &str) {
    let check_flag_fn_guard = CHECK_FLAG_FN.lock().unwrap();
    let check_flag_fn = Function::from(check_flag_fn_guard.as_ref().unwrap().0.clone());

    let window = window().unwrap();

    let result = check_flag_fn
        .call1(&JsValue::NULL, &JsValue::from(flag))
        .unwrap();
    if !result.as_bool().unwrap_or(false) {
        window
            .alert_with_message("Sorry, but the flag is incorrect.")
            .unwrap();
        return;
    }

    let mut request_init = RequestInit::new();
    request_init.method("POST");
    request_init.body(Some(&JsValue::from(flag)));
    let request = Request::new_with_str_and_init(
        &format!("/api/submit-flag1?username={}", username),
        &request_init,
    )
    .unwrap();
    let fetch_fut = JsFuture::from(window.fetch_with_request(&request));
    let resp = fetch_fut.await.unwrap();
    console::log_1(&resp);
}

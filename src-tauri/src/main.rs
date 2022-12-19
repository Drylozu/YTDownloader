#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use bytes::Buf;
use std::{
    fs::File,
    io::copy,
    path::Path,
    sync::{Arc, Mutex},
};
use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
    WindowEvent,
};

#[tauri::command]
fn free_space(dir: String) -> String {
    human_bytes::human_bytes(fs2::free_space(&Path::new(&dir)).unwrap_or_default() as f64)
}

#[tauri::command]
async fn download_file(output: String, url: String) -> Result<(), ()> {
    let response = reqwest::get(url).await.or_else(|_| Err(()))?;
    let mut file = File::create(output).or_else(|_| Err(()))?;
    let content = response.bytes().await.or_else(|_| Err(()))?;
    copy(&mut content.reader(), &mut file)
        .map(|_| (()))
        .or_else(|_| Err(()))
}

fn main() {
    let background = Arc::new(Mutex::new(false));
    let backg = background.clone();

    let show = CustomMenuItem::new("show".to_string(), "Mostrar");
    let close = CustomMenuItem::new("close".to_string(), "Cerrar");
    let menu = SystemTrayMenu::new()
        .add_item(show)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(close);
    let tray = SystemTray::new().with_menu(menu);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![free_space, download_file])
        .system_tray(tray)
        .setup(|app| {
            app.listen_global("background", move |event| {
                let mut bg = backg.lock().unwrap();
                match event.payload() {
                    Some("true") => *bg = true,
                    Some("false") => *bg = false,
                    _ => {}
                }
            });
            Ok(())
        })
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                app.get_window("main").unwrap().show().ok();
                app.get_window("main").unwrap().set_focus().ok();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "show" => {
                    app.get_window("main").unwrap().show().ok();
                    app.get_window("main").unwrap().set_focus().ok();
                }
                "close" => {
                    app.exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .on_window_event(move |event| match event.event() {
            WindowEvent::CloseRequested { api, .. } => {
                if *background.lock().unwrap() {
                    api.prevent_close();
                    event.window().hide().ok();
                }
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

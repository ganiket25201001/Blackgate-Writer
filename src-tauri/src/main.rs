#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::fs;
use base64::engine::general_purpose;
use base64::Engine as _;

/// Read text file and return as UTF-8 string
#[tauri::command]
fn read_file(path: String) -> Result<String, String> {
  fs::read_to_string(&path)
    .map_err(|e| format!("Failed to read file '{}': {}", path, e))
}

/// Write base64-encoded content to file
#[tauri::command]
fn write_file(path: String, content_base64: String) -> Result<(), String> {
  match general_purpose::STANDARD.decode(&content_base64) {
    Ok(bytes) => fs::write(&path, bytes)
      .map_err(|e| format!("Failed to write file '{}': {}", path, e)),
    Err(e) => Err(format!("Invalid base64 content: {}", e))
  }
}

/// Read binary file and return as base64-encoded string
#[tauri::command]
fn read_file_base64(path: String) -> Result<String, String> {
  fs::read(&path)
    .map(|bytes| general_purpose::STANDARD.encode(bytes))
    .map_err(|e| format!("Failed to read binary file '{}': {}", path, e))
}

/// Check if file exists
#[tauri::command]
fn file_exists(path: String) -> Result<bool, String> {
  Ok(fs::metadata(&path).is_ok())
}

/// Get file size in bytes
#[tauri::command]
fn get_file_size(path: String) -> Result<u64, String> {
  fs::metadata(&path)
    .map(|m| m.len())
    .map_err(|e| format!("Failed to get file size: {}", e))
}

/// Delete a file
#[tauri::command]
fn delete_file(path: String) -> Result<(), String> {
  fs::remove_file(&path)
    .map_err(|e| format!("Failed to delete file: {}", e))
}

/// Create directory recursively
#[tauri::command]
fn create_dir(path: String) -> Result<(), String> {
  fs::create_dir_all(&path)
    .map_err(|e| format!("Failed to create directory: {}", e))
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      read_file,
      write_file,
      read_file_base64,
      file_exists,
      get_file_size,
      delete_file,
      create_dir
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

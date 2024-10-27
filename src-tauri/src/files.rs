#[tauri::command]
pub fn list_files(directory: String) -> Vec<String> {
    println!("Listing files in directory: {}", directory);
    todo!()
}

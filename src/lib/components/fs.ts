import { basename, join } from '@tauri-apps/api/path';
import { remove, BaseDirectory, rename } from '@tauri-apps/plugin-fs';
import { appState } from './state.svelte';

export const deleteFile = async (name: string, dir: string) => {
	const path = await join(dir, name);
	await remove(path);
};

export const moveFile = async (name: string, dir: string, newDir: string) => {
	const path = await join(dir, name);
	const newPath = await join(newDir, name);
	await rename(path, newPath);
};

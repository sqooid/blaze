import { join } from '@tauri-apps/api/path';
import { remove, rename } from '@tauri-apps/plugin-fs';
import { toast } from 'svelte-sonner';

export const deleteFile = async (name: string, dir: string) => {
	try {
		const path = await join(dir, name);
		await remove(path);
	} catch (error) {
		console.error('deleteFile', error);
		toast.error(`Failed to delete ${name}: ${error}`);
	}
};

export const moveFile = async (name: string, dir: string, newDir: string) => {
	try {
		const path = await join(dir, name);
		const newPath = await join(newDir, name);
		await rename(path, newPath);
	} catch (error) {
		console.log('moveFile', error);
		toast.error(`Failed to move ${name}: ${error}`);
	}
};

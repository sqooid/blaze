import { writable } from 'svelte/store';
import { persistedState } from './persisted-store.svelte';

export const bindingActions = ['move', 'delete', 'skip'] as const;

export type DirectoryBinding = {
	key: string;
	action: (typeof bindingActions)[number];
	directory: string;
};

export const defaultDirectoryBinding: DirectoryBinding = {
	key: '',
	action: 'move',
	directory: ''
};

export type AppConfig = {
	directoryBindings: DirectoryBinding[];
	sourceDirectory: string;
};

export const persistedStore = <T>(key: string, value: T) => {
	const { subscribe, set } = writable<T>(value);
	const json = localStorage.getItem(key);
	if (json) {
		set(JSON.parse(json));
	}
	return {
		subscribe,
		set: (value: any) => {
			set(value);
			localStorage.setItem(key, JSON.stringify(value));
		}
	};
};

const defaultAppConfig: AppConfig = {
	directoryBindings: [],
	sourceDirectory: ''
};

export const appConfig = persistedState('appConfig', defaultAppConfig);

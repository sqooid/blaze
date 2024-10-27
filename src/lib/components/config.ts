import { writable } from 'svelte/store';
import { persistedState } from './persisted-store.svelte';

export type DirectoryBinding = {
	key: string;
	directory: string;
};

export type AppConfig = {
	directoryBindings: DirectoryBinding[];
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
	directoryBindings: []
};

export const appConfig = persistedState('appConfig', defaultAppConfig);

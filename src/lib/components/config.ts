import { writable } from 'svelte/store';
import { persistedState } from './persisted-store.svelte';

export const bindingActions = ['move', 'delete', 'skip'] as const;
export const progressDisplays = ['bar', 'text'] as const;

export const valuesToOptions = (values: Readonly<string[]>) =>
	values.map((value) => ({ value, label: capitalise(value) }));

export const getInitialOption = (options: { value: string; label: string }[], value: string) =>
	options.find((option) => option.value === value);

export const capitalise = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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
	progressDisplay: (typeof progressDisplays)[number];
	actionToast: boolean;
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
	sourceDirectory: '',
	progressDisplay: 'bar',
	actionToast: true
};

export const appConfig = persistedState('appConfig', defaultAppConfig);

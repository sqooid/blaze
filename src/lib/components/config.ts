import { writable } from 'svelte/store';
import { persistedState } from './persisted-store.svelte';

export const bindingActions = ['move', 'delete', 'skip'] as const;
export const progressDisplays = ['bar', 'text'] as const;
export const reminderPositions = [
	'top left',
	'top right',
	'bottom left',
	'bottom right',
	'top',
	'bottom',
	'left',
	'right'
] as const;
export const reminderOrientations = ['horizontal', 'vertical'] as const;

export const valuesToOptions = (values: Readonly<string[]>) =>
	values.map((value) => ({ value, label: capitalise(value) }));

export const getInitialOption = (options: { value: string; label: string }[], value: string) =>
	options.find((option) => option.value === value);

export const capitalise = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export type DirectoryBinding = {
	key: string;
	action: (typeof bindingActions)[number];
	directory: string;
	icon: string;
};

export const defaultDirectoryBinding: DirectoryBinding = {
	key: '',
	action: 'move',
	directory: '',
	icon: ''
};

export type AppConfig = {
	directoryBindings: DirectoryBinding[];
	sourceDirectory: string;
	progressDisplay: (typeof progressDisplays)[number];
	showBindingReminder: boolean;
	reminderPosition: (typeof reminderPositions)[number];
	reminderOrientation: (typeof reminderOrientations)[number];
	reminderOpacity: number;
};

const defaultAppConfig: AppConfig = {
	directoryBindings: [],
	sourceDirectory: '',
	progressDisplay: 'bar',
	showBindingReminder: true,
	reminderPosition: 'top left',
	reminderOrientation: 'vertical',
	reminderOpacity: 10
};

export const appConfig = persistedState('appConfig', defaultAppConfig);

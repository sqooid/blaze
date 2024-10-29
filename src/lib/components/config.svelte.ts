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
export const compareOrientations = ['horizontal', 'vertical'] as const;
export const compareBoxes = ['fill', 'fit'] as const;

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

export const workflowTypes = ['sort', 'compare'] as const;

export type Workflow = {
	type: (typeof workflowTypes)[number];

	sourceDirectory: string;
	directoryBindings: DirectoryBinding[];
	showBindingReminder: boolean;
	reminderPosition: (typeof reminderPositions)[number];
	reminderOrientation: (typeof reminderOrientations)[number];
	reminderOpacity: number;

	compareGroupMatcher: string;
	compareOrientation: (typeof compareOrientations)[number];
	compareBox: (typeof compareBoxes)[number];
	compareConvertScroll: boolean;
};

export type AppConfigInner = {
	progressDisplay: (typeof progressDisplays)[number];
	workflows: Record<string, Workflow>;
	currentWorkflow: string;
};

export class AppConfig {
	#inner = persistedState('appConfig', defaultAppConfig);

	value = $derived(this.#inner.value);
	workflowNames = $derived(Object.keys(this.value.workflows));
	currentWorkflow = $derived(this.value.workflows[this.value.currentWorkflow]);

	createNewWorkflow() {
		let number = this.workflowNames.length + 1;
		let name = `workflow ${number}`;
		while (this.workflowNames.includes(name)) {
			number += 1;
			name = `workflow ${number}`;
		}
		const workflow: Workflow = { ...defaultAppConfig.workflows.default };
		this.value.workflows[name] = workflow;
		this.value.currentWorkflow = name;
		return name;
	}

	deleteCurrentWorkflow() {
		if (this.workflowNames.length === 1) {
			return false;
		}
		const currentWorkflowName = $state.snapshot(this.value.currentWorkflow);
		this.#inner.value.currentWorkflow = this.workflowNames[0];
		delete this.#inner.value.workflows[currentWorkflowName];
		return true;
	}
}

const defaultAppConfig: AppConfigInner = {
	progressDisplay: 'bar',
	currentWorkflow: 'default',
	workflows: {
		default: {
			type: 'sort',
			directoryBindings: [],
			sourceDirectory: '',
			showBindingReminder: true,
			reminderPosition: 'top left',
			reminderOrientation: 'vertical',
			reminderOpacity: 10,
			compareGroupMatcher: '^img_(\\d+)_(\\d+)',
			compareOrientation: 'horizontal',
			compareBox: 'fill',
			compareConvertScroll: false
		}
	}
};

export const appConfig = new AppConfig();

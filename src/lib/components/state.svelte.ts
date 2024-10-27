import { SvelteSet as Set } from 'svelte/reactivity';

const defaultAppState: AppState = {
	currentFile: '',
	fileSet: new Set()
};

class AppState {
	currentFile = $state('');
	fileSet = $state<Set<string>>(new Set());
}

export const appState = new AppState();

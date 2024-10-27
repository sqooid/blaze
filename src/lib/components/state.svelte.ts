import { SvelteSet as Set } from 'svelte/reactivity';

class AppState {
	currentFile = $state('');
	fileSet = $state<Set<string>>(new Set());

	#totalCount = $state(0);

	get progress() {
		return (this.#totalCount - this.fileSet.size) / this.#totalCount;
	}

	get totalCount() {
		return this.#totalCount;
	}

	get doneCount() {
		return this.#totalCount - this.fileSet.size;
	}

	addFile(name: string) {
		this.fileSet.add(name);
		this.#totalCount++;
	}

	removeFile(name: string) {
		this.fileSet.delete(name);
	}

	skipFile(name: string) {
		this.fileSet.delete(name);
		this.fileSet.add(name);
	}

	reset() {
		this.fileSet.clear();
		this.#totalCount = 0;
	}
}

export const appState = new AppState();

import { BlazeLinkedList } from '$lib/linked-list.svelte';
import { appConfig } from './config';
import { deleteFile, moveFile } from './fs';

class AppState {
	fileList = $state(new BlazeLinkedList<string>(10));
	currentFile = $derived(this.fileList.first);

	#totalCount = $state(0);

	get progress() {
		return (this.#totalCount - this.fileList.size) / this.#totalCount;
	}

	get totalCount() {
		return this.#totalCount;
	}

	get doneCount() {
		return this.#totalCount - this.fileList.size;
	}

	addFile(name: string) {
		this.fileList.push(name);
		this.#totalCount += 1;
	}

	snapshotCurrent() {
		return $state.snapshot(this.currentFile);
	}

	async deleteCurrent() {
		const current = this.snapshotCurrent();
		if (current) {
			this.fileList.removeFirst();
			await deleteFile(current, appConfig.value.sourceDirectory);
		}
	}

	async moveCurrent(targetDir: string) {
		const current = this.snapshotCurrent();
		if (current) {
			this.fileList.removeFirst();
			console.log(current, appConfig.value.sourceDirectory, targetDir);

			await moveFile(current, appConfig.value.sourceDirectory, targetDir);
		}
	}

	skipCurrent() {
		const current = this.snapshotCurrent();
		if (current) {
			this.fileList.push(current);
			this.fileList.removeFirst();
		}
	}

	removeCurrent() {
		this.fileList.removeFirst();
	}

	reset() {
		this.fileList.clear();
		this.#totalCount = 0;
	}
}

export const appState = new AppState();

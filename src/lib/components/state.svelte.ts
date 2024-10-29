import { BlazeLinkedList } from '$lib/linked-list.svelte';
import { appConfig } from './config.svelte';
import { deleteFile, moveFile } from './fs';

class AppState {
	fileList = $state(new BlazeLinkedList<string>(10));
	currentFile = $derived(this.fileList.first);

	compareGroups = $state<Record<string, string[]>>({});

	#totalCount = $state(0);

	sortedCompareKeys = $derived(
		Object.keys(this.compareGroups)
			.filter((x) => this.compareGroups[x].length)
			.sort()
	);
	currentCompareKey = $derived(this.sortedCompareKeys.at(0) ?? '');
	currentCompareImages = $derived(this.compareGroups[this.currentCompareKey] ?? []);

	bufferImages = $derived.by(() => {
		if (appConfig.currentWorkflow.type === 'compare') {
			const key = this.sortedCompareKeys.at(1);
			if (key) {
				return this.compareGroups[key];
			}
			return [];
		} else {
			return this.fileList.frontBuffer;
		}
	});

	get progress() {
		return (this.#totalCount - this.fileList.size) / this.#totalCount;
	}

	get totalCount() {
		return this.#totalCount;
	}

	get doneCount() {
		return this.#totalCount - this.fileList.size;
	}

	get remaining() {
		return this.fileList.size;
	}

	addFile(name: string) {
		this.fileList.push(name);
		this.#totalCount += 1;
		if (appConfig.currentWorkflow.type === 'compare') {
			const match = name.match(appConfig.currentWorkflow.compareGroupMatcher);
			if (match) {
				const tokens = [];
				let first = true;
				for (const x of match) {
					if (first) {
						first = false;
						continue;
					}
					tokens.push(x);
				}
				const key = tokens.join('/');
				if (this.compareGroups[key]) {
					if (!this.compareGroups[key].includes(name)) {
						this.compareGroups[key].push(name);
					}
				} else {
					this.compareGroups[key] = [name];
				}
				console.log($state.snapshot(this.compareGroups));
			}
		}
	}

	snapshotCurrent() {
		return $state.snapshot(this.currentFile);
	}

	async deleteCurrent(file?: string) {
		if (file) {
			const index = this.currentCompareImages.indexOf(file);
			this.compareGroups[this.currentCompareKey].splice(index, 1);
			await deleteFile(file, appConfig.currentWorkflow.sourceDirectory);
			return;
		}
		const current = this.snapshotCurrent();
		if (current) {
			this.fileList.removeFirst();
			await deleteFile(current, appConfig.currentWorkflow.sourceDirectory);
		}
	}

	async moveCurrent(targetDir: string, file?: string) {
		if (file) {
			const index = this.currentCompareImages.indexOf(file);
			this.compareGroups[this.currentCompareKey].splice(index, 1);
			await moveFile(file, appConfig.currentWorkflow.sourceDirectory, targetDir);
			return;
		}
		const current = this.snapshotCurrent();
		if (current) {
			this.fileList.removeFirst();
			console.log(current, appConfig.currentWorkflow.sourceDirectory, targetDir);
			await moveFile(current, appConfig.currentWorkflow.sourceDirectory, targetDir);
		}
	}

	skipCurrent() {
		const current = this.snapshotCurrent();
		if (current) {
			this.fileList.push(current);
			this.fileList.removeFirst();
		}
	}

	removeCurrentInvalid() {
		this.fileList.removeFirst();
		this.#totalCount -= 1;
	}

	reset() {
		this.fileList.clear();
		this.#totalCount = 0;
	}
}

export const appState = new AppState();

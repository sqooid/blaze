<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { appConfig, type DirectoryBinding } from './config';
	import { deleteFile, moveFile } from './fs';
	import { appState } from './state.svelte';
	import { convertFileSrc } from '@tauri-apps/api/core';

	const currentImageName = $derived(appState.fileSet.values().next().value);
	const srcDir = $derived(appConfig.value.sourceDirectory);
	const currentImagePath = $derived(`${srcDir}/${currentImageName}`);
	const currentImageUrl = $derived(convertFileSrc(currentImagePath));

	const bindMap = $derived(
		appConfig.value.directoryBindings.reduce(
			(acc, binding) => {
				acc[binding.key] = binding;
				return acc;
			},
			{} as Record<string, DirectoryBinding>
		)
	);
	const keyListener = $derived(async (event: KeyboardEvent) => {
		if (!currentImageName) return;
		if (bindMap[event.key]) {
			const binding = bindMap[event.key];
			const name = currentImageName;
			let action = '';
			if (binding.action === 'move') {
				action = 'Moved';
				moveFile(name, appConfig.value.sourceDirectory, binding.directory);
				appState.removeFile(name);
				console.log(`Moved ${name} to ${binding.directory}`);
			} else if (binding.action === 'delete') {
				action = 'Deleted';
				deleteFile(name, appConfig.value.sourceDirectory);
				appState.removeFile(name);
				console.log(`Deleted ${name}`);
			} else if (binding.action === 'skip') {
				action = 'Skipped';
				appState.skipFile(name);
				console.log(`Skipped ${name}`);
			}
			if (appConfig.value.actionToast) {
				toast(action);
			}
		}
	});
</script>

<svelte:document on:keydown={keyListener} />

{#if currentImageName}
	<div>
		<img src={currentImageUrl} alt="" class="img mx-auto" />
	</div>
{/if}

<style lang="postcss">
	.img {
		max-height: calc(100vh - 3.5rem);
	}
</style>

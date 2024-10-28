<script lang="ts">
	import { convertFileSrc } from '@tauri-apps/api/core';
	import { toast } from 'svelte-sonner';
	import { appConfig, type DirectoryBinding } from './config';
	import { appState } from './state.svelte';

	const currentImageName = $derived(appState.currentFile);
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

	const runBinding = (binding: DirectoryBinding, name: string) => {
		let action = '';
		if (binding.action === 'move') {
			action = 'Moved';
			appState.moveCurrent(binding.directory);
			console.log(`Moved ${name} to ${binding.directory}`);
		} else if (binding.action === 'delete') {
			action = 'Deleted';
			appState.deleteCurrent();
			console.log(`Deleted ${name}`);
		} else if (binding.action === 'skip') {
			action = 'Skipped';
			appState.skipCurrent();
			console.log(`Skipped ${name}`);
		}
		if (appConfig.value.actionToast) {
			toast(action);
		}
	};

	const keyListener = $derived(async (event: KeyboardEvent) => {
		if (!currentImageName) return;
		if (bindMap[event.key]) {
			const binding = bindMap[event.key];
			const name = currentImageName;
			runBinding(binding, name);
		}
	});

	const preloadImages = $derived(
		appState.fileList.frontBuffer.map((f) =>
			convertFileSrc(`${appConfig.value.sourceDirectory}/${f}`)
		)
	);
</script>

<svelte:document on:keydown={keyListener} />

{#each preloadImages as file}
	<link rel="preload" href={file} as="image" />
	<img src={file} alt="" class="h-0 w-0" />
{/each}

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

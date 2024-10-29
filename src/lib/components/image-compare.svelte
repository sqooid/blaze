<script lang="ts">
	import { convertFileSrc } from '@tauri-apps/api/core';
	import { toast } from 'svelte-sonner';
	import { appConfig, type DirectoryBinding } from './config.svelte';
	import { appState } from './state.svelte';

	const srcDir = $derived(appConfig.currentWorkflow.sourceDirectory);

	const bindMap = $derived(
		appConfig.currentWorkflow.directoryBindings.reduce(
			(acc, binding) => {
				acc[binding.key] = binding;
				return acc;
			},
			{} as Record<string, DirectoryBinding>
		)
	);

	const imageNames = $derived(appState.currentCompareImages);
	const imagePaths = $derived(imageNames.map((f) => `${srcDir}/${f}`));
	const imageUrls = $derived(imagePaths.map((f) => convertFileSrc(f)));

	let activeImage = $state('');
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
	};

	const keyListener = $derived(async (event: KeyboardEvent) => {
		if (bindMap[event.key]) {
			// const binding = bindMap[event.key];
			// const name = currentImageName;
			// runBinding(binding, name);
		}
	});

	const onWheel = (e: WheelEvent) => {
		if (
			appConfig.currentWorkflow.compareOrientation === 'horizontal' &&
			appConfig.currentWorkflow.compareConvertScroll
		) {
			const elem = document.scrollingElement;
			elem?.scrollBy({ left: e.deltaY, behavior: 'auto' });
		}
	};

	const preloadImages = $derived(
		appState.fileList.frontBuffer.map((f) =>
			convertFileSrc(`${appConfig.currentWorkflow.sourceDirectory}/${f}`)
		)
	);

	const onLoadError = (e: any, index: number) => {
		console.log('Error loading image', e);
		appState.removeCurrentInvalid();
	};

	const containerClassMap = $derived({
		fill: {
			horizontal: 'img w-fit mx-auto',
			vertical: 'flex-col w-full'
		},
		fit: {
			horizontal: 'img w-[100vw] justify-between',
			vertical: 'img flex-col w-[100vw] justify-between'
		}
	});
	const containerClass = $derived(
		containerClassMap[appConfig.currentWorkflow.compareBox][
			appConfig.currentWorkflow.compareOrientation
		]
	);
	const imageStyleMap = $derived({
		fill: {
			horizontal: '',
			vertical: ''
		},
		fit: {
			horizontal: `width: calc(${100 / imageUrls.length}% - 1px);`,
			vertical: `height: calc(${100 / imageUrls.length}% - 1px);`
		}
	});
	const containerStyle = $derived(
		imageStyleMap[appConfig.currentWorkflow.compareBox][
			appConfig.currentWorkflow.compareOrientation
		]
	);
	const imageClassMap = $derived({
		fill: {
			horizontal: '',
			vertical: ''
		},
		fit: {
			horizontal: 'my-auto',
			vertical: 'mx-auto h-full'
		}
	});
	const imageClass = $derived(
		imageClassMap[appConfig.currentWorkflow.compareBox][
			appConfig.currentWorkflow.compareOrientation
		]
	);
</script>

<svelte:document onkeydown={keyListener} onwheel={onWheel} />

{#each preloadImages as file}
	<link rel="preload" href={file} as="image" />
	<img src={file} alt="" class="h-0 w-0" />
{/each}

<div class={`flex gap-[1px] ${containerClass}`}>
	{#each imageUrls as f, i}
		<img
			src={f}
			alt=""
			style={containerStyle}
			class={`transition-all hover:opacity-90 hover:transition-all ${imageClass}`}
			onerror={(e) => {
				onLoadError(e, i);
			}}
			onmouseenter={() => {
				activeImage = imageNames[i];
			}}
			onmouseleave={() => {
				activeImage = '';
			}}
		/>
	{/each}
</div>

<style lang="postcss">
	.img {
		height: calc(100vh - 3.5rem - 20px);
	}
</style>

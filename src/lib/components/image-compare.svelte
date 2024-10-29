<script lang="ts">
	import { convertFileSrc } from '@tauri-apps/api/core';
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
	$inspect(imageNames).with(console.log);
	const imagePaths = $derived(imageNames.map((f) => `${srcDir}/${f}`));
	const imageUrls = $derived(imagePaths.map((f) => convertFileSrc(f)));

	let activeImage = $state('');
	const runBinding = (binding: DirectoryBinding, name: string) => {
		let action = '';
		if (binding.action === 'move') {
			action = 'Moved';
			appState.moveCurrent(binding.directory, name);
			console.log(`Moved ${name} to ${binding.directory}`);
		} else if (binding.action === 'delete') {
			action = 'Deleted';
			appState.deleteCurrent(name);
			console.log(`Deleted ${name}`);
		} else if (binding.action === 'skip') {
			action = 'Skipped';
			appState.skipCurrent();
			console.log(`Skipped ${name}`);
		}
	};

	const keyListener = $derived(async (event: KeyboardEvent) => {
		if (bindMap[event.key]) {
			const binding = bindMap[event.key];
			if (activeImage) {
				runBinding(binding, activeImage);
				activeImage = '';
			}
		}
		if (['ArrowRight', 'ArrowDown'].includes(event.key)) {
			const index = imageNames.indexOf(activeImage);
			if (index < imageNames.length - 1) {
				activeImage = imageNames[index + 1];
			}
		}
		if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
			let index = imageNames.indexOf(activeImage);
			if (index === -1) {
				index = imageNames.length;
			}
			if (index <= imageNames.length && index > 0) {
				activeImage = imageNames[index - 1];
			}
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

	$inspect(activeImage).with(console.log);
</script>

<svelte:document onkeydown={keyListener} onwheel={onWheel} />

{#each preloadImages as file}
	<link rel="preload" href={file} as="image" />
	<img src={file} alt="" class="h-0 w-0" />
{/each}

<div class={`flex gap-[1px] ${containerClass}`}>
	{#each imageNames as f, i (f)}
		<img
			src={imageUrls[i]}
			alt=""
			style:opacity={activeImage === f ? 0.7 : 1}
			style={`${containerStyle}`}
			class={`transition-all hover:transition-all ${imageClass}`}
			onerror={(e) => {
				onLoadError(e, i);
			}}
			onmousemove={() => {
				activeImage = f;
			}}
			onmouseenter={() => {
				activeImage = f;
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

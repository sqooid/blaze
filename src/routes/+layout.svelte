<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';

	import '../app.css';
	import '../typography.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import Header from './header.svelte';
	import { watchImmediate, readDir } from '@tauri-apps/plugin-fs';
	import { basename } from '@tauri-apps/api/path';
	import { appConfig } from '$lib/components/config';
	import { appState } from '$lib/components/state.svelte';

	let { children } = $props();

	let oldSource = $state('');
	const addFile = (file: string) => {
		console.log(`Added ${file}`);
		appState.addFile(file);
	};

	const isImage = (file: string) => /\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(file);

	const readWholeDir = async (dir: string) => {
		const files = await readDir(dir);
		files.forEach((x) => {
			if (x.isFile && isImage(x.name)) addFile(x.name);
		});
	};

	const watchDir = async (dir: string) => {
		return watchImmediate(dir, (event) => {
			if (typeof event.type === 'object' && 'create' in event.type) {
				const files = event.paths;
				files.forEach(async (x) => {
					const name = await basename(x);
					if (isImage(name)) {
						addFile(name);
					}
				});
			}
		});
	};

	let unwatchFn: () => void = () => {};
	$effect(() => {
		if (appConfig.value.sourceDirectory !== oldSource) {
			appState.reset();
			readWholeDir(appConfig.value.sourceDirectory);
			unwatchFn?.();
			watchDir(appConfig.value.sourceDirectory).then((fn) => {
				unwatchFn = fn;
			});
		}
	});
	setTimeout(() => {}, 5000);
</script>

<ModeWatcher />
<Toaster />
<Header />
<div class="mt-14 bg-background">
	{@render children()}
</div>

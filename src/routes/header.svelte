<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Settings, FolderOpen } from 'lucide-svelte/icons';
	import { open as openPicker } from '@tauri-apps/plugin-dialog';
	import { appConfig } from '$lib/components/config';
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import { page } from '$app/stores';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { appState } from '$lib/components/state.svelte';

	const onChooseFolder = async () => {
		const directory = await openPicker({
			multiple: false,
			directory: true
		});
		if (directory) {
			appConfig.value.sourceDirectory = directory;
		}
	};
</script>

<div
	class="fixed left-0 right-0 top-0 grid h-14 grid-cols-3 border-b border-solid border-primary border-opacity-10 bg-background px-2 shadow-sm"
>
	<Tooltip.Root openDelay={100} closeDelay={100}>
		<Tooltip.Trigger>
			<Button
				variant="ghost"
				on:click={onChooseFolder}
				class="my-auto grid max-w-full grid-cols-[auto_1fr] items-center justify-start gap-4 overflow-hidden"
			>
				<FolderOpen class="h-6 w-6" />
				<div class="small text-wrap text-start">{appConfig.value.sourceDirectory}</div>
			</Button>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<div>{appState.doneCount} items sorted</div>
			<div>{appState.remaining} items remaining</div>
		</Tooltip.Content>
	</Tooltip.Root>
	<div class="flex items-center justify-center gap-x-2">
		<a class="h1" href="/">Blaze</a>
	</div>
	<div class="flex items-center justify-end gap-x-2">
		<ModeToggle />
		<Button variant="ghost" href={$page.url.pathname === '/config' ? '/' : '/config'}>
			<Settings class="h-6 w-6" />
		</Button>
	</div>
</div>

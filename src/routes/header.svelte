<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Settings, FolderOpen } from 'lucide-svelte/icons';
	import { open as openPicker } from '@tauri-apps/plugin-dialog';
	import { appConfig } from '$lib/components/config';

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

<div class="fixed left-0 right-0 top-0 grid h-14 grid-cols-3 px-2 shadow-sm">
	<div class="flex items-center justify-start gap-x-2">
		<Button variant="ghost" on:click={onChooseFolder} title="Choose source directory">
			<FolderOpen class="mr-2 h-6 w-6" />
			<div class="small text-wrap">{appConfig.value.sourceDirectory}</div>
		</Button>
	</div>
	<div class="flex items-center justify-center gap-x-2">
		<a class="h1" href="/">Blaze</a>
	</div>
	<div class="flex items-center justify-end gap-x-2">
		<Button variant="ghost" href="/config">
			<Settings class="h-6 w-6" />
		</Button>
	</div>
</div>

<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Button } from './ui/button';
	import { open as openPicker } from '@tauri-apps/plugin-dialog';
	import * as Dialog from '$lib/components/ui/dialog';
	import { appConfig } from './config';

	type Props = {
		directory: string;
		key: string;
		index: number;
		open: boolean;
		hidden: boolean;
	};
	let { directory, key, index, open = $bindable(false), hidden = false }: Props = $props();

	const onClickChooseDirectory = async () => {
		const newDirectory = await openPicker({
			multiple: false,
			directory: true
		});
		if (newDirectory) {
			directory = newDirectory;
		}
	};

	let choosingKey = $state(false);
	const onClickChooseKey = () => {
		document.addEventListener('keydown', keyListener);
		choosingKey = true;
	};
	const keyListener = (event: KeyboardEvent) => {
		key = event.key;
		document.removeEventListener('keydown', keyListener);
		choosingKey = false;
	};

	const onClickSave = () => {
		if (!directory || !key) {
			toast.error('Please choose a directory and key');
			return;
		}
		if (
			appConfig.value.directoryBindings.some((binding, i) => i !== index && binding.key === key)
		) {
			toast.error('Key already in use');
			return;
		}
		if (index === -1) {
			appConfig.value.directoryBindings.push({ directory, key });
		} else {
			appConfig.value.directoryBindings[index] = { directory, key };
		}
		open = false;
	};

	const onClickDelete = () => {
		appConfig.value.directoryBindings.splice(index, 1);
		open = false;
	};
</script>

<Dialog.Root bind:open>
	{#if !hidden}
		<Dialog.Trigger asChild let:builder>
			<Button class="flex w-full items-center gap-4" builders={[builder]} variant="ghost">
				<kbd class="kbd">{key}</kbd>
				<span>{directory}</span>
			</Button>
		</Dialog.Trigger>
	{/if}
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				<h3 class="h3">{index >= 0 ? 'Edit' : 'Create'} binding</h3>
			</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-2">
			<div class="flex items-center gap-4">
				<span class="large">Key binding</span>
				<Button variant="outline" on:click={onClickChooseKey}>
					{choosingKey ? 'Listening...' : `${key ? 'Change' : 'Choose'} key`}
				</Button>
			</div>
			<kbd class="kbd">{key || 'None'}</kbd>
			<div class="mt-2 flex items-center gap-2">
				<span class="large">Target directory</span>
				<Button variant="outline" on:click={onClickChooseDirectory}>
					{directory ? 'Change' : 'Choose'} directory
				</Button>
			</div>
			<div class="small">{directory || 'None'}</div>
			<div class="mt-2 flex gap-2">
				<Button variant="default" on:click={onClickSave}>Save</Button>
				{#if index !== -1}
					<Button variant="destructive" on:click={onClickDelete}>Delete</Button>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

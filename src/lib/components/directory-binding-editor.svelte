<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Button } from './ui/button';
	import { open as openPicker } from '@tauri-apps/plugin-dialog';
	import * as Dialog from '$lib/components/ui/dialog';
	import {
		appConfig,
		bindingActions,
		defaultDirectoryBinding,
		type DirectoryBinding
	} from './config';
	import * as Select from '$lib/components/ui/select';

	type Props = {
		directory: string;
		action: DirectoryBinding['action'];
		key: string;
		index: number;
		open: boolean;
		hidden: boolean;
	};
	let { directory, action, key, index, open = $bindable(false), hidden = false }: Props = $props();

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
		if (!key) {
			toast.error('Please choose a key');
			return;
		}
		if (!directory && action === 'move') {
			toast.error('Please choose a directory');
			return;
		}
		if (
			appConfig.value.directoryBindings.some((binding, i) => i !== index && binding.key === key)
		) {
			toast.error('Key already in use');
			return;
		}
		if (index === -1) {
			appConfig.value.directoryBindings.push({ directory, key, action });
		} else {
			appConfig.value.directoryBindings[index] = { directory, key, action };
		}
		if (index === -1) {
			key = defaultDirectoryBinding.key;
			directory = defaultDirectoryBinding.directory;
			action = defaultDirectoryBinding.action;
		}
		open = false;
	};

	const onClickDelete = () => {
		appConfig.value.directoryBindings.splice(index, 1);
		open = false;
	};

	const capitalise = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
	const actionValues = bindingActions.map((action) => ({
		value: action,
		label: capitalise(action)
	}));

	const onSelectedAction = (item: any) => {
		action = item.value;
	};

	const text = $derived(
		action === 'move' ? `Move to ${directory}` : action === 'delete' ? 'Delete' : 'Skip'
	);
</script>

<Dialog.Root bind:open>
	{#if !hidden}
		<Dialog.Trigger asChild let:builder>
			<Button class="flex w-full items-center gap-4" builders={[builder]} variant="ghost">
				<kbd class="kbd">{key}</kbd>
				<span>{text}</span>
			</Button>
		</Dialog.Trigger>
	{/if}
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				<h3 class="h3">{index >= 0 ? 'Edit' : 'Create'} binding</h3>
			</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-4">
			<div class="flex items-center gap-4">
				<span class="large">Key binding</span>
				<Button variant="outline" on:click={onClickChooseKey}>
					{choosingKey ? 'Listening...' : `${key ? 'Change' : 'Choose'} key`}
				</Button>
			</div>
			<kbd class="kbd">{key || 'None'}</kbd>

			<span class="large">Action</span>
			<Select.Root selected={actionValues[0]} onSelectedChange={onSelectedAction}>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Action" />
				</Select.Trigger>
				<Select.Content>
					{#each actionValues as action}
						<Select.Item value={action.value}>{action.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			{#if action === 'move'}
				<div class="mt-2 flex items-center gap-2">
					<span class="large">Target directory</span>
					<Button variant="outline" on:click={onClickChooseDirectory}>
						{directory ? 'Change' : 'Choose'} directory
					</Button>
				</div>
				<div class="small">{directory || 'None'}</div>
			{/if}

			<div class="mt-8 flex gap-2">
				<Button variant="default" on:click={onClickSave}>Save</Button>
				{#if index !== -1}
					<Button variant="destructive" on:click={onClickDelete}>Delete</Button>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

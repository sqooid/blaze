<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { Button } from './ui/button';
	import { open as openPicker } from '@tauri-apps/plugin-dialog';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Popover from '$lib/components/ui/popover';
	import {
		appConfig,
		bindingActions,
		defaultDirectoryBinding,
		getInitialOption,
		valuesToOptions,
		type DirectoryBinding
	} from './config';
	import * as Select from '$lib/components/ui/select';
	import EmojiSearch from './emoji-search.svelte';
	import InputTooltip from './input-tooltip.svelte';

	type Props = {
		directory: string;
		action: DirectoryBinding['action'];
		key: string;
		icon: string;
		index: number;
		open: boolean;
		hidden: boolean;
	};
	let {
		directory,
		action,
		key,
		icon,
		index,
		open = $bindable(false),
		hidden = false
	}: Props = $props();

	let binding = $state({ directory, action, key, icon });

	const onClickChooseDirectory = async () => {
		const newDirectory = await openPicker({
			multiple: false,
			directory: true
		});
		if (newDirectory) {
			binding.directory = newDirectory;
		}
	};

	let choosingKey = $state(false);
	const onClickChooseKey = () => {
		document.addEventListener('keydown', keyListener);
		choosingKey = true;
	};
	const keyListener = (event: KeyboardEvent) => {
		binding.key = event.key;
		document.removeEventListener('keydown', keyListener);
		choosingKey = false;
	};

	const onClickSave = () => {
		if (!binding.key) {
			toast.error('Please choose a key');
			return;
		}
		if (!binding.directory && binding.action === 'move') {
			toast.error('Please choose a directory');
			return;
		}
		if (
			appConfig.value.directoryBindings.some((other, i) => i !== index && other.key === binding.key)
		) {
			toast.error('Key already in use');
			return;
		}
		if (index === -1) {
			appConfig.value.directoryBindings.push(binding);
		} else {
			appConfig.value.directoryBindings[index] = $state.snapshot(binding);
		}
		if (index === -1) {
			binding = { ...defaultDirectoryBinding };
		}
		open = false;
	};

	const onClickDelete = () => {
		appConfig.value.directoryBindings.splice(index, 1);
		open = false;
	};

	const actionValues = valuesToOptions(bindingActions);

	const onSelectedAction = (item: any) => {
		binding.action = item.value;
	};

	const text = $derived(
		action === 'move' ? `Move to ${directory}` : action === 'delete' ? 'Delete' : 'Skip'
	);

	let showIconPicker = $state(false);
	const onChooseIcon = (newIcon: string) => {
		binding.icon = newIcon;
		showIconPicker = false;
	};

	$effect(() => {
		if (!open) {
			binding = { directory, action, key, icon };
			document.removeEventListener('keydown', keyListener);
			choosingKey = false;
		}
	});
</script>

<Dialog.Root bind:open openFocus="#save">
	{#if !hidden}
		<Dialog.Trigger asChild let:builder>
			<Button class="flex w-full items-center gap-4" builders={[builder]} variant="ghost">
				<kbd class="kbd">{key}</kbd>
				<span>{icon}</span>
				<span>{text}</span>
			</Button>
		</Dialog.Trigger>
	{/if}
	<Dialog.Content class="max-h-[90vh] overflow-auto">
		<Dialog.Header>
			<Dialog.Title>
				<h3 class="h3">{index >= 0 ? 'Edit' : 'Create'} binding</h3>
			</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col gap-2">
			<div class="grid grid-cols-2">
				<div>
					<div class="mt-6 flex items-center gap-4">
						<span class="large">Icon</span>
						<InputTooltip
							>{#snippet content()}
								This is shown on the sorting page as a reminder of what the binding does
							{/snippet}</InputTooltip
						>
					</div>
					<Popover.Root bind:open={showIconPicker}>
						<Popover.Trigger asChild let:builder>
							<Button variant="ghost" class="w-fit" title="Change icon" builders={[builder]}>
								<div class="small">{binding.icon || 'None'}</div>
							</Button>
						</Popover.Trigger>
						<Popover.Content>
							<EmojiSearch onchoose={onChooseIcon} />
						</Popover.Content>
					</Popover.Root>
				</div>
				<div>
					<div class="mt-6 flex items-center gap-4">
						<span class="large">Key</span>
						<InputTooltip
							>{#snippet content()}
								Pressing this key will trigger the chosen action while in the sorter
							{/snippet}</InputTooltip
						>
					</div>
					<Button variant="ghost" class="w-fit" on:click={onClickChooseKey} title="Change key">
						<kbd class="kbd">{choosingKey ? 'Listening' : binding.key || 'None'}</kbd>
					</Button>
				</div>
			</div>

			<div class="mt-6 flex items-center gap-4">
				<span class="large">Action</span>
				<InputTooltip
					>{#snippet content()}
						Choose the action that will be taken when the key is pressed
					{/snippet}</InputTooltip
				>
			</div>
			<Select.Root
				selected={getInitialOption(actionValues, action)}
				onSelectedChange={onSelectedAction}
			>
				<Select.Trigger class="w-[180px]">
					<Select.Value placeholder="Action" />
				</Select.Trigger>
				<Select.Content>
					{#each actionValues as action}
						<Select.Item value={action.value}>{action.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<!-- description -->
			{#if binding.action === 'delete'}
				<div class="muted">Files will be deleted without possibility of recovery</div>
			{:else if binding.action === 'skip'}
				<div class="muted">Files will be moved to the back of the queue</div>
			{:else if binding.action === 'move'}
				<div class="muted">Files will be moved to the specified directory</div>
			{/if}

			{#if binding.action === 'move'}
				<span class="large">Target directory</span>
				<Button variant="ghost" on:click={onClickChooseDirectory}>
					<div class="small w-full text-start">{directory || 'None'}</div>
				</Button>
			{/if}

			<div class="mt-8 flex gap-2">
				<Button variant="default" on:click={onClickSave} id="save">Save</Button>
				{#if index !== -1}
					<Button variant="destructive" on:click={onClickDelete}>Delete</Button>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

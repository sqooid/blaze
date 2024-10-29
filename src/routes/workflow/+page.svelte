<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import {
		appConfig,
		compareBoxes,
		compareOrientations,
		defaultDirectoryBinding,
		workflowTypes
	} from '$lib/components/config.svelte';
	import DirectoryBindingEditor from '$lib/components/directory-binding-editor.svelte';
	import DirectoryInput from '$lib/components/directory-input.svelte';
	import SelectWrapper from '$lib/components/select-wrapper.svelte';
	import SettingContainer from '$lib/components/setting-container.svelte';
	import SettingLabel from '$lib/components/setting-label.svelte';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { isEqual } from 'lodash-es';
	import { toast } from 'svelte-sonner';

	const onSave = () => {
		if (name !== appConfig.value.currentWorkflow) {
			onChangeName(name);
		}
		appConfig.value.workflows[name] = values;
		toast.success('Workflow saved');
		resetOldValues();
	};

	const onCancel = () => {
		resetOldValues();
		goto('/');
	};

	let oldWorkflow = '';

	$effect(() => {
		if (appConfig.value.currentWorkflow !== oldWorkflow) {
			oldWorkflow = appConfig.value.currentWorkflow;
			name = appConfig.value.currentWorkflow;
			values = { ...appConfig.currentWorkflow };
			resetOldValues();
		}
	});

	let name = $state(appConfig.value.currentWorkflow);
	let values = $state({ ...appConfig.currentWorkflow });
	// svelte-ignore state_referenced_locally
	let oldValues = $state($state.snapshot(values));
	const resetOldValues = () => {
		oldValues = $state.snapshot(values);
	};

	const onChangeName = (name?: string) => {
		if (!name) return;

		const oldName = $state.snapshot(appConfig.value.currentWorkflow);
		appConfig.value.workflows[name] = $state.snapshot(appConfig.currentWorkflow);
		appConfig.value.currentWorkflow = name;
		delete appConfig.value.workflows[oldName];
	};

	const onClickAddBinding = () => {
		creatingNewBinding = true;
	};

	let creatingNewBinding = $state(false);

	beforeNavigate((e) => {
		if (!isEqual(values, oldValues) || name !== appConfig.value.currentWorkflow) {
			toast.error('You have unsaved changes');
			e.cancel();
			console.log($state.snapshot(values));
			console.log($state.snapshot(oldValues));
		}
	});

	const onDelete = () => {
		const result = appConfig.deleteCurrentWorkflow();
		if (!result) {
			toast.error('Cannot delete the last workflow');
		}
	};
</script>

<DirectoryBindingEditor
	bindings={values.directoryBindings}
	{...defaultDirectoryBinding}
	index={-1}
	bind:open={creatingNewBinding}
	hidden
/>

<div class="mx-auto mb-24 flex max-w-prose flex-col gap-4 p-4">
	<h1 class="h1">Workflow config</h1>
	<div class="my-6 grid grid-cols-[1fr_auto_auto] gap-8">
		<Button on:click={onSave}>Save changes</Button>
		<Button on:click={onCancel} variant="ghost">Discard changes</Button>
		<Button on:click={onDelete} variant="destructive">Delete</Button>
	</div>
	<SettingContainer>
		<SettingLabel name="Workflow name" />
		<Input type="text" bind:value={name} class="w-64" />
	</SettingContainer>
	<SettingContainer>
		<SettingLabel name="Workflow type" />
		<SelectWrapper values={workflowTypes} bind:value={values.type} class="w-64" />
	</SettingContainer>
	<div class="muted">
		{#if values.type === 'sort'}
			Quickly separate images into different directories
		{:else if values.type === 'compare'}
			Compare similar images and choose what to do with each one
		{/if}
	</div>
	<SettingContainer>
		<SettingLabel name="Source directory" tip="Directory where images will be read from" />
		<DirectoryInput bind:value={values.sourceDirectory} class="overflow-clip text-wrap" />
	</SettingContainer>
	<h3 class="h3">Bindings</h3>
	<Button variant="outline" on:click={onClickAddBinding}>Add binding</Button>
	{#each values.directoryBindings as binding, i}
		<DirectoryBindingEditor
			bindings={values.directoryBindings}
			directory={binding.directory}
			key={binding.key}
			action={binding.action}
			icon={binding.icon}
			index={i}
			open={false}
			hidden={false}
		/>
	{/each}
	{#if values.type === 'compare'}
		<h2 class="h2">Compare settings</h2>
		<SettingContainer>
			<SettingLabel
				name="Group matcher"
				tip="Regex with at least one capturing group. Filenames with identical capturing group matches will be compared with each other."
			/>
			<Input bind:value={values.compareGroupMatcher} class="w-64" />
		</SettingContainer>
		<SettingContainer>
			<SettingLabel name="Orientation" />
			<SelectWrapper
				values={compareOrientations}
				bind:value={values.compareOrientation}
				class="w-64"
			/>
		</SettingContainer>
		<SettingContainer>
			<SettingLabel name="Fill mode" />
			<SelectWrapper values={compareBoxes} bind:value={values.compareBox} class="w-64" />
		</SettingContainer>
		<SettingContainer>
			<SettingLabel
				name="Convert scroll"
				tip="When horizontal, whether to convert vertical scroll wheel movement into horizontal movement"
			/>
			<Switch bind:checked={values.compareConvertScroll} />
		</SettingContainer>
	{/if}
</div>

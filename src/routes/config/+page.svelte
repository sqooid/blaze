<script lang="ts">
	import { appConfig, defaultDirectoryBinding } from '$lib/components/config';
	import DirectoryBindingEditor from '$lib/components/directory-binding-editor.svelte';
	import InterfaceConfig from '$lib/components/interface-config.svelte';
	import { Button } from '$lib/components/ui/button';

	const onClickAddBinding = () => {
		creatingNewBinding = true;
	};

	let creatingNewBinding = $state(false);
</script>

<DirectoryBindingEditor
	{...defaultDirectoryBinding}
	index={-1}
	bind:open={creatingNewBinding}
	hidden
/>

<div class="mx-auto flex max-w-prose flex-col gap-4 p-4">
	<h2 class="h2">Configuration</h2>
	<div class="flex items-center gap-2">
		<h3 class="h3">Key bindings</h3>
		<Button variant="outline" on:click={onClickAddBinding}>Add binding</Button>
	</div>
	{#each appConfig.value.directoryBindings as binding, i}
		<DirectoryBindingEditor
			directory={binding.directory}
			key={binding.key}
			action={binding.action}
			index={i}
			open={false}
			hidden={false}
		/>
	{/each}
	<h3 class="h3">Interface</h3>
	<InterfaceConfig />
</div>

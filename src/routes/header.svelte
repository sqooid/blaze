<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Settings, Bolt } from 'lucide-svelte/icons';
	import { open as openPicker } from '@tauri-apps/plugin-dialog';
	import { appConfig } from '$lib/components/config.svelte';
	import ModeToggle from '$lib/components/mode-toggle.svelte';
	import { page } from '$app/stores';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { appState } from '$lib/components/state.svelte';
	import * as Select from '$lib/components/ui/select';
	import { goto } from '$app/navigation';
	import SelectWrapper from '$lib/components/select-wrapper.svelte';
</script>

<div
	class="fixed left-0 right-0 top-0 z-10 flex h-14 justify-between border-b border-solid border-primary border-opacity-10 bg-background px-2 shadow-sm"
>
	<div class="flex items-center justify-center gap-x-2 px-1">
		<Tooltip.Root openDelay={100} closeDelay={100}>
			<Tooltip.Trigger>
				<div class="large cursor-default">Workflow</div>
			</Tooltip.Trigger>
			<Tooltip.Content>
				<div>{appState.doneCount} items sorted</div>
				<div>{appState.remaining} items remaining</div>
			</Tooltip.Content>
		</Tooltip.Root>
		<SelectWrapper
			values={appConfig.workflowNames}
			bind:value={appConfig.value.currentWorkflow}
			class="min-w-64"
		/>
		<Button
			variant="ghost"
			href={$page.url.pathname === '/workflow' ? '/' : '/workflow'}
			title="Configure workflow"
		>
			<Bolt class="h-6 w-6" />
		</Button>
		<!-- {#if $page.url.pathname === '/workflow'}
			<Button>Save changes</Button>
		{/if} -->
	</div>
	<div class="flex items-center justify-end gap-x-2">
		<ModeToggle />
		<Button variant="ghost" href={$page.url.pathname === '/config' ? '/' : '/config'}>
			<Settings class="h-6 w-6" />
		</Button>
	</div>
</div>

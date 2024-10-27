<script lang="ts">
	import { appConfig } from '$lib/components/config';
	import ImageDisplay from '$lib/components/image-display.svelte';
	import { appState } from '$lib/components/state.svelte';
	import Progress from '$lib/components/ui/progress/progress.svelte';
</script>

{#if !appConfig.value.sourceDirectory}
	<div class="comment muted">Choose a source directory to start sorting</div>
{:else if appState.fileSet.size === 0}
	<div class="comment muted">Directory is empty</div>
{:else}
	<div class="img">
		<ImageDisplay />
	</div>
	{#if appConfig.value.progressDisplay === 'bar'}
		<div class="fixed bottom-1 h-[1px] w-full opacity-30">
			<Progress value={appState.progress} max={1} />
		</div>
	{:else if appConfig.value.progressDisplay === 'text'}
		<div class="fixed bottom-2 left-2 rounded-sm bg-primary-foreground p-1 opacity-30">
			{appState.doneCount} / {appState.totalCount}
		</div>
	{/if}
{/if}

<style lang="postcss">
	.comment {
		@apply mx-auto mt-24 max-w-prose p-4 text-center;
	}
</style>

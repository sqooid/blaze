<script lang="ts">
	import { appConfig } from '$lib/components/config';
	import ImageDisplay from '$lib/components/image-display.svelte';
	import { appState } from '$lib/components/state.svelte';
</script>

{#if !appConfig.value.sourceDirectory}
	<div class="comment muted">Choose a source directory to start sorting</div>
{:else if appState.fileSet.size === 0}
	<div class="comment muted">Directory is empty</div>
{:else}
	<ImageDisplay />
{/if}

<style lang="postcss">
	.comment {
		@apply mx-auto mt-24 max-w-prose p-4 text-center;
	}
</style>

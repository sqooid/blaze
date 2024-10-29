<script lang="ts">
	import InputTooltip from './input-tooltip.svelte';

	type Props = {
		name: string;
		tip?: string;
	};
	let { name, tip }: Props = $props();
</script>

<div class="flex items-center gap-2">
	<span class="">{name}</span>
	{#if tip}
		<InputTooltip>
			{#snippet content()}
				{tip}
			{/snippet}
		</InputTooltip>
	{/if}
</div>

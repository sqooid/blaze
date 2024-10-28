<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Info } from 'lucide-svelte';
	import { Button } from './ui/button';
	import type { Snippet } from 'svelte';

	type Props = {
		content: Snippet;
	};
	let { content }: Props = $props();
</script>

<Tooltip.Root openDelay={100} closeDelay={100}>
	<Tooltip.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="icon">
			<Info class="h-3 w-3" />
		</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		{@render content()}
	</Tooltip.Content>
</Tooltip.Root>

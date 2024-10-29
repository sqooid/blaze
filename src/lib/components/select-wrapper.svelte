<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { getInitialOption, valuesToOptions } from './config.svelte';

	type Props = {
		values: string[] | ReadonlyArray<string>;
		value?: string;
		placeholder?: string;
		class?: string;
	};
	let { values, value = $bindable(), placeholder = '', class: className }: Props = $props();

	const options = $derived(valuesToOptions(values));
</script>

<Select.Root
	selected={value ? getInitialOption(options, value) : undefined}
	onSelectedChange={(e) => (value = e?.value)}
>
	<Select.Trigger class={className}>
		<Select.Value {placeholder} />
	</Select.Trigger>
	<Select.Content>
		{#each options as o}
			<Select.Item value={o.value}>{o.label}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>

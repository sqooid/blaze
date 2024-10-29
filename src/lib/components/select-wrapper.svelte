<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { getInitialOption, valuesToOptions } from './config.svelte';
	import { Button } from './ui/button';

	type Props = {
		values: string[] | ReadonlyArray<string>;
		value?: string;
		placeholder?: string;
		class?: string;
		extraValue?: string;
		onExtraValue?: () => void;
	};
	let {
		values,
		value = $bindable(),
		placeholder = '',
		class: className,
		extraValue,
		onExtraValue
	}: Props = $props();

	const options = $derived(valuesToOptions(values));
</script>

<Select.Root
	selected={value ? getInitialOption(options, value) : undefined}
	onSelectedChange={(e) => {
		if (extraValue && e?.value !== extraValue) value = e?.value;
	}}
>
	<Select.Trigger class={className}>
		<Select.Value {placeholder} />
	</Select.Trigger>
	<Select.Content>
		{#each options as o}
			<Select.Item value={o.value}>{o.label}</Select.Item>
		{/each}
		{#if extraValue}
			<Select.Separator />
			<Button on:click={() => onExtraValue?.()} class="w-full" variant="ghost">{extraValue}</Button>
		{/if}
	</Select.Content>
</Select.Root>

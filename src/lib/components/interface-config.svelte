<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';

	import {
		appConfig,
		getInitialOption,
		progressDisplays,
		reminderOrientations,
		reminderPositions,
		valuesToOptions
	} from './config';
	import InputTooltip from './input-tooltip.svelte';
	import { Slider } from './ui/slider';

	const progressDisplayOptions = valuesToOptions(progressDisplays);
	const reminderPositionOptions = valuesToOptions(reminderPositions);
	const reminderOrientationOptions = valuesToOptions(reminderOrientations);
</script>

{#snippet interfaceLabel(name: string, tip: string)}
	<div class="flex items-center gap-2">
		<span class="">{name}</span>
		<InputTooltip>
			{#snippet content()}
				{tip}
			{/snippet}
		</InputTooltip>
	</div>
{/snippet}

<div class="flex items-center justify-between gap-4">
	{@render interfaceLabel(
		'Progress display',
		'Choose how the progress of sorting should be displayed'
	)}
	<Select.Root
		selected={getInitialOption(progressDisplayOptions, appConfig.value.progressDisplay)}
		onSelectedChange={(e) => (appConfig.value.progressDisplay = e?.value as any)}
	>
		<Select.Trigger class="w-32">
			<Select.Value placeholder="" />
		</Select.Trigger>
		<Select.Content>
			{#each progressDisplayOptions as opt}
				<Select.Item value={opt.value}>{opt.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>

<h3 class="h3">Binding reminder</h3>

<div class="flex items-center justify-between gap-4">
	{@render interfaceLabel(
		'Show binding reminder',
		'Choose whether the binding reminder should be shown on the screen'
	)}
	<Switch bind:checked={appConfig.value.showBindingReminder} />
</div>

{#if appConfig.value.showBindingReminder}
	<div class="flex items-center justify-between gap-4">
		{@render interfaceLabel(
			'Binding reminder position',
			'Choose where the binding reminder should be placed on the screen. This would depend on the aspect ratio of your window and images'
		)}
		<Select.Root
			selected={getInitialOption(reminderPositionOptions, appConfig.value.reminderPosition)}
			onSelectedChange={(e) => (appConfig.value.reminderPosition = e?.value as any)}
		>
			<Select.Trigger class="w-32">
				<Select.Value placeholder="" />
			</Select.Trigger>
			<Select.Content>
				{#each reminderPositionOptions as opt}
					<Select.Item value={opt.value}>{opt.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex items-center justify-between gap-4">
		{@render interfaceLabel(
			'Binding reminder orientation',
			'Choose whether the binding reminder should be horizontal or vertical'
		)}
		<Select.Root
			selected={getInitialOption(reminderOrientationOptions, appConfig.value.reminderOrientation)}
			onSelectedChange={(e) => (appConfig.value.reminderOrientation = e?.value as any)}
		>
			<Select.Trigger class="w-32">
				<Select.Value placeholder="" />
			</Select.Trigger>
			<Select.Content>
				{#each reminderOrientationOptions as opt}
					<Select.Item value={opt.value}>{opt.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	<div class="flex items-center justify-between gap-4">
		{@render interfaceLabel(
			'Binding reminder background opacity',
			'Opaqueness of the background of the binding reminder'
		)}
		<Slider
			class="w-48"
			min={0}
			max={100}
			step={1}
			value={[appConfig.value.reminderOpacity]}
			onValueChange={(e) => (appConfig.value.reminderOpacity = e[0])}
		/>
	</div>
{/if}

<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';

	import { appConfig, getInitialOption, progressDisplays, valuesToOptions } from './config';

	const progressDisplayOptions = valuesToOptions(progressDisplays);
</script>

<div class="flex items-center justify-between gap-4">
	<span class="large">Progress display</span>
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

<div class="flex items-center justify-between gap-4">
	<span class="large">Show action toasts</span>
	<Switch bind:checked={appConfig.value.actionToast} />
</div>

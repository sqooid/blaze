<script lang="ts">
	import { appConfig, reminderPositions } from './config';

	const reminderPositionsMap: { [K in (typeof reminderPositions)[number]]: string[] } = {
		top: ['top-14 justify-center left-0 right-0', ''],
		bottom: ['bottom-0 justify-center left-0 right-0', ''],
		left: ['left-0 flex-col justify-center top-14 bottom-0', '-translate-y-[50%]'],
		right: ['right-0 flex-col justify-center top-14 bottom-0', '-translate-y-[50%]'],
		'bottom left': ['bottom-0 left-0', ''],
		'bottom right': ['bottom-0 right-0', ''],
		'top left': ['top-14 left-0', ''],
		'top right': ['top-14 right-0', '']
	};

	const position = $derived(appConfig.value.reminderPosition);
	const orientation = $derived(appConfig.value.reminderOrientation);
</script>

<div class={`fixed ${reminderPositionsMap[position][0]} flex`}>
	<div
		class={`left-0 top-14 m-2 flex gap-4 rounded-md bg-white bg-opacity-30 p-2 ${orientation === 'horizontal' ? '' : 'flex-col'} ${reminderPositionsMap[position][1]}`}
	>
		{#each appConfig.value.directoryBindings as binding}
			<div class="flex items-center gap-1">
				<kbd class="kbd">{binding.key}</kbd>
				<span>{binding.icon}</span>
			</div>
		{/each}
	</div>
</div>

<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { searchEmoji } from '$lib/emoji';

	type Props = {
		onchoose: (emoji: string) => void;
	};
	let { onchoose }: Props = $props();

	let search = $state('');
	const emojiList = $derived(searchEmoji(search));

	const onClick = (emoji: string) => {
		search = '';
		onchoose(emoji);
	};
</script>

<div class="h-fit">
	<Input type="text" placeholder="Search..." bind:value={search} class="top-0" />
	<div class="mt-2 h-72 max-h-[50vh] overflow-y-auto">
		<div class="grid grid-cols-8">
			{#each emojiList as em}
				<button class="rounded-sm p-[1px] hover:bg-primary/5" onclick={() => onClick(em)}
					>{em}</button
				>
			{/each}
		</div>
	</div>
</div>

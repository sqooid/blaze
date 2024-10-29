<script lang="ts">
	import { Button } from './ui/button';
	import { open as openPicker } from '@tauri-apps/plugin-dialog';

	type Props = {
		value: string;
		class?: string;
	};
	let { value = $bindable(''), class: classs }: Props = $props();

	const onClick = async () => {
		const directory = await openPicker({
			multiple: false,
			directory: true
		});
		if (directory) {
			value = directory;
		}
	};
</script>

<Button variant="ghost" on:click={onClick} class={classs}>{value || 'None'}</Button>

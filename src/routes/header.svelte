<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Settings } from 'lucide-svelte/icons';

	const onSettings = () => {
		console.log('Settings clicked');
	};
</script>

<div class="fixed left-0 right-0 top-0 grid h-14 grid-cols-3 px-2 shadow-sm">
	<div class="flex items-center justify-start gap-x-2"></div>
	<div class="flex items-center justify-center gap-x-2">
		<h1 class="h1 pointer-events-none">Blaze</h1>
	</div>
	<div class="flex items-center justify-end gap-x-2">
		<Button variant="ghost" href="/config">
			<Settings class="h-6 w-6" />
		</Button>
	</div>
</div>

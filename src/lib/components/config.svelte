<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Settings } from 'lucide-svelte';
	import { Button } from './ui/button';
</script>

<Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]}>
			<Settings class="h-6 w-6" />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				<h2 class="h2">Configuration</h2>
			</Dialog.Title>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>

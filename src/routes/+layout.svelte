<script>
	import '../app.css';
	import '../typography.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import Header from './header.svelte';
</script>

<Toaster />
<Header />
<div class="mt-12 bg-background">
	<slot></slot>
</div>

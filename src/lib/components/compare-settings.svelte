<script lang="ts">
	import { appConfig, compareOrientations } from './config.svelte';
	import SelectWrapper from './select-wrapper.svelte';
	import SettingContainer from './setting-container.svelte';
	import SettingLabel from './setting-label.svelte';
	import { Input } from './ui/input';
</script>

<SettingContainer>
	<SettingLabel
		name="Group matcher"
		tip="Regex containing at least one capturing group. File names with matching capturing groups will be compared with each other"
	/>
	<Input type="text" bind:value={appConfig.currentWorkflow.compareGroupMatcher} class="w-64" />
</SettingContainer>

<SettingContainer>
	<SettingLabel name="Flow orientation" tip="Direction which images will be placed" />
	<SelectWrapper
		values={compareOrientations}
		bind:value={appConfig.currentWorkflow.compareOrientation}
		class="w-32"
	/>
</SettingContainer>

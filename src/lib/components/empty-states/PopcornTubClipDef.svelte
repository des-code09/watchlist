<script lang="ts">
	let { clipPathId }: { clipPathId: string } = $props();
</script>

<defs>
	<clipPath id={clipPathId}>
		<path d="M18 34.5 24.5 88.5h39L70 34.5H18z" />
	</clipPath>
</defs>

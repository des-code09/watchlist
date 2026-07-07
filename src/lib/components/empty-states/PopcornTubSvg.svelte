<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		clipPathId,
		transform = '',
		interior
	}: {
		clipPathId: string;
		transform?: string;
		interior?: Snippet;
	} = $props();
</script>

<g {transform}>
	<path d="M18 34.5 24.5 88.5h39L70 34.5H18z" fill="var(--illus-inside)" />

	<g clip-path="url(#{clipPathId})">
		<rect x="18" y="34" width="8.5" height="56" fill="var(--illus-accent)" />
		<rect x="26.5" y="34" width="8.5" height="56" fill="var(--illus-accent-alt)" />
		<rect x="35" y="34" width="8.5" height="56" fill="var(--illus-accent)" />
		<rect x="43.5" y="34" width="8.5" height="56" fill="var(--illus-accent-alt)" />
		<rect x="52" y="34" width="8.5" height="56" fill="var(--illus-accent)" />
		<rect x="60.5" y="34" width="8.5" height="56" fill="var(--illus-accent-alt)" />

		{@render interior?.()}
	</g>

	<path
		d="M14 34.5c0-2.2 1.8-4 4-4h52c2.2 0 4 1.8 4 4v2.2H14V34.5z"
		fill="var(--illus-rim)"
	/>
	<path
		d="M14 36.7h60v2.4c0 1.5-1.2 2.7-2.7 2.7H16.7c-1.5 0-2.7-1.2-2.7-2.7v-2.4z"
		fill="var(--illus-rim-shadow)"
	/>
	<path
		d="M16.5 30.2c2.8-1.2 6-1.8 9.2-1.8 3.1 0 6.1.5 8.8 1.5 2.8-1 5.8-1.5 8.9-1.5 3.2 0 6.4.6 9.2 1.8 2.5-1.8 5.6-2.8 8.9-2.8 1.8 0 3.5.3 5.1.9 1.2-2.2 3.5-3.7 6.2-3.7 1.2 0 2.3.3 3.3.8V34c0 2.2-1.8 4-4 4H18c-2.2 0-4-1.8-4-4v-3.2c1-.5 2.1-.8 3.3-.8 2.7 0 5 1.5 6.2 3.7z"
		fill="var(--illus-rim)"
	/>

	<path
		d="M18 34.5 24.5 88.5h39L70 34.5M16.5 30.2c2.8-1.2 6-1.8 9.2-1.8 3.1 0 6.1.5 8.8 1.5 2.8-1 5.8-1.5 8.9-1.5 3.2 0 6.4.6 9.2 1.8 2.5-1.8 5.6-2.8 8.9-2.8 1.8 0 3.5.3 5.1.9 1.2-2.2 3.5-3.7 6.2-3.7 1.2 0 2.3.3 3.3.8V34c0 2.2-1.8 4-4 4H18c-2.2 0-4-1.8-4-4v-3.2c1-.5 2.1-.8 3.3-.8 2.7 0 5 1.5 6.2 3.7z"
		stroke="var(--illus-outline)"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
</g>

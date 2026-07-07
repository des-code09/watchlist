<script lang="ts">
	import PopcornKernel from '$lib/components/empty-states/PopcornKernel.svelte';
	import PopcornTubClipDef from '$lib/components/empty-states/PopcornTubClipDef.svelte';
	import PopcornTubSvg from '$lib/components/empty-states/PopcornTubSvg.svelte';
	import { spilledPopcornPieces } from '$lib/popcorn-tub-pieces';
</script>

<svg
	class="empty-illustration-svg empty-illustration-svg--spilled-popcorn-tub spilled-popcorn-tub"
	viewBox="0 0 88 96"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
>
	<PopcornTubClipDef clipPathId="spilled-tub-body-clip" />

	<ellipse cx="44" cy="92" rx="28" ry="3.5" fill="currentColor" opacity="0.08" />

	{#each spilledPopcornPieces.filter((piece) => piece.x < 52) as piece (piece.id)}
		<PopcornKernel {piece} />
	{/each}

	<PopcornTubSvg
		clipPathId="spilled-tub-body-clip"
		transform="translate(34 52) rotate(68) translate(-44 -58)"
	/>

	{#each spilledPopcornPieces.filter((piece) => piece.x >= 52) as piece (piece.id)}
		<PopcornKernel {piece} />
	{/each}
</svg>

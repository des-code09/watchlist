<script lang="ts">
	import PopcornKernel from '$lib/components/empty-states/PopcornKernel.svelte';
	import PopcornTubClipDef from '$lib/components/empty-states/PopcornTubClipDef.svelte';
	import PopcornTubSvg from '$lib/components/empty-states/PopcornTubSvg.svelte';
	import { overflowPopcornPieces, surfacePopcornPieces } from '$lib/popcorn-tub-pieces';
</script>

<svg
	class="empty-illustration-svg empty-illustration-svg--popcorn-tub full-popcorn-tub"
	viewBox="0 0 88 96"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
>
	<PopcornTubClipDef clipPathId="full-tub-body-clip" />

	<ellipse cx="44" cy="90" rx="24" ry="3.5" fill="currentColor" opacity="0.08" />

	<PopcornTubSvg clipPathId="full-tub-body-clip">
		{#snippet interior()}
			{#each surfacePopcornPieces as piece (piece.id)}
				<PopcornKernel {piece} />
			{/each}
		{/snippet}
	</PopcornTubSvg>

	{#each overflowPopcornPieces as piece (piece.id)}
		<PopcornKernel {piece} />
	{/each}
</svg>

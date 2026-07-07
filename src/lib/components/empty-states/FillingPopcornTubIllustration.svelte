<script lang="ts">
	import { browser } from '$app/environment';
	import PopcornKernel from '$lib/components/empty-states/PopcornKernel.svelte';
	import PopcornTubClipDef from '$lib/components/empty-states/PopcornTubClipDef.svelte';
	import PopcornTubSvg from '$lib/components/empty-states/PopcornTubSvg.svelte';
	import {
		interiorPopcornPieces,
		overflowPopcornPieces,
		type PopcornPiece
	} from '$lib/popcorn-tub-pieces';
	import { onMount } from 'svelte';

	let reduceMotion = $state(false);

	function isStaticPiece(piece: PopcornPiece) {
		return reduceMotion && piece.delay <= 3.86;
	}

	onMount(() => {
		if (!browser) return;

		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = motionQuery.matches;

		const handleMotionChange = (event: MediaQueryListEvent) => {
			reduceMotion = event.matches;
		};

		motionQuery.addEventListener('change', handleMotionChange);

		return () => {
			motionQuery.removeEventListener('change', handleMotionChange);
		};
	});
</script>

<svg
	class="empty-illustration-svg filling-popcorn-tub"
	class:filling-popcorn-tub-static={reduceMotion}
	viewBox="0 0 88 96"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
>
	<PopcornTubClipDef clipPathId="filling-tub-body-clip" />

	<ellipse cx="44" cy="90" rx="24" ry="3.5" fill="currentColor" opacity="0.08" />

	<PopcornTubSvg clipPathId="filling-tub-body-clip">
		{#snippet interior()}
			{#each interiorPopcornPieces as piece (piece.id)}
				<PopcornKernel {piece} animated showWhenStatic={isStaticPiece(piece)} />
			{/each}
		{/snippet}
	</PopcornTubSvg>

	{#each overflowPopcornPieces as piece (piece.id)}
		<PopcornKernel {piece} animated showWhenStatic={isStaticPiece(piece)} />
	{/each}
</svg>

<script lang="ts">
	import { popcornTones, type PopcornPiece } from '$lib/popcorn-tub-pieces';

	let {
		piece,
		animated = false,
		showWhenStatic = false
	}: {
		piece: PopcornPiece;
		animated?: boolean;
		showWhenStatic?: boolean;
	} = $props();

	const colors = $derived(popcornTones[piece.tone]);
	const scale = $derived(piece.scale ?? 1);
</script>

<g transform="translate({piece.x} {piece.y})">
	{#if animated}
		<g
			class="filling-popcorn-piece"
			class:filling-popcorn-piece-static={showWhenStatic}
			style={`--piece-delay: ${piece.delay}s; --piece-rotate: ${piece.rotate}deg; --piece-scale: ${scale};`}
		>
			<ellipse cx="0" cy="0" rx="3.1" ry="2.3" fill={colors.main} />
			<ellipse cx="-2.3" cy="-1.6" rx="2.1" ry="1.7" fill={colors.light} />
			<ellipse cx="2.2" cy="-1.4" rx="1.9" ry="1.5" fill={colors.dark} />
			<ellipse cx="0.8" cy="1.8" rx="1.8" ry="1.4" fill={colors.light} />
		</g>
	{:else}
		<g transform="rotate({piece.rotate}) scale({scale})">
			<ellipse cx="0" cy="0" rx="3.1" ry="2.3" fill={colors.main} />
			<ellipse cx="-2.3" cy="-1.6" rx="2.1" ry="1.7" fill={colors.light} />
			<ellipse cx="2.2" cy="-1.4" rx="1.9" ry="1.5" fill={colors.dark} />
			<ellipse cx="0.8" cy="1.8" rx="1.8" ry="1.4" fill={colors.light} />
		</g>
	{/if}
</g>

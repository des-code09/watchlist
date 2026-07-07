<script lang="ts">
	import {
		overflowPopcornPieces,
		popcornTones,
		surfacePopcornPieces,
		type PopcornPiece
	} from '$lib/popcorn-tub-pieces';
</script>

{#snippet popcornPiece(piece: PopcornPiece)}
	{@const colors = popcornTones[piece.tone]}
	{@const scale = piece.scale ?? 1}
	<g transform="translate({piece.x} {piece.y})">
		<g transform="rotate({piece.rotate}) scale({scale})">
			<ellipse cx="0" cy="0" rx="3.1" ry="2.3" fill={colors.main} />
			<ellipse cx="-2.3" cy="-1.6" rx="2.1" ry="1.7" fill={colors.light} />
			<ellipse cx="2.2" cy="-1.4" rx="1.9" ry="1.5" fill={colors.dark} />
			<ellipse cx="0.8" cy="1.8" rx="1.8" ry="1.4" fill={colors.light} />
		</g>
	</g>
{/snippet}

<svg
	class="empty-illustration-svg empty-illustration-svg--popcorn-tub full-popcorn-tub"
	viewBox="0 0 88 96"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
>
	<defs>
		<clipPath id="full-tub-body-clip">
			<path d="M18 34.5 24.5 88.5h39L70 34.5H18z" />
		</clipPath>
	</defs>

	<ellipse cx="44" cy="90" rx="24" ry="3.5" fill="currentColor" opacity="0.08" />

	<path d="M18 34.5 24.5 88.5h39L70 34.5H18z" fill="var(--illus-inside)" />

	<g clip-path="url(#full-tub-body-clip)">
		<rect x="18" y="34" width="8.5" height="56" fill="var(--illus-accent)" />
		<rect x="26.5" y="34" width="8.5" height="56" fill="var(--illus-accent-alt)" />
		<rect x="35" y="34" width="8.5" height="56" fill="var(--illus-accent)" />
		<rect x="43.5" y="34" width="8.5" height="56" fill="var(--illus-accent-alt)" />
		<rect x="52" y="34" width="8.5" height="56" fill="var(--illus-accent)" />
		<rect x="60.5" y="34" width="8.5" height="56" fill="var(--illus-accent-alt)" />

		{#each surfacePopcornPieces as piece (piece.id)}
			{@render popcornPiece(piece)}
		{/each}
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

	{#each overflowPopcornPieces as piece (piece.id)}
		{@render popcornPiece(piece)}
	{/each}

	<path
		d="M18 34.5 24.5 88.5h39L70 34.5M16.5 30.2c2.8-1.2 6-1.8 9.2-1.8 3.1 0 6.1.5 8.8 1.5 2.8-1 5.8-1.5 8.9-1.5 3.2 0 6.4.6 9.2 1.8 2.5-1.8 5.6-2.8 8.9-2.8 1.8 0 3.5.3 5.1.9 1.2-2.2 3.5-3.7 6.2-3.7 1.2 0 2.3.3 3.3.8V34c0 2.2-1.8 4-4 4H18c-2.2 0-4-1.8-4-4v-3.2c1-.5 2.1-.8 3.3-.8 2.7 0 5 1.5 6.2 3.7z"
		stroke="var(--illus-outline)"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
</svg>

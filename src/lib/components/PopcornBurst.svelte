<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { popcorn, type PopcornBurstEvent } from '$lib/popcorn';

	type Particle = {
		id: string;
		x: number;
		drift: number;
		delay: number;
		duration: number;
		rise: number;
		scale: number;
		rotation: number;
		tone: number;
	};

	const INTENSITY_COUNTS = {
		watching: { min: 10, max: 14 },
		watched: { min: 22, max: 28 }
	} as const;

	let particles = $state<Particle[]>([]);
	let reduceMotion = $state(false);

	function randomBetween(min: number, max: number) {
		return min + Math.random() * (max - min);
	}

	function randomInt(min: number, max: number) {
		return Math.floor(randomBetween(min, max + 1));
	}

	function createParticles(burst: PopcornBurstEvent): Particle[] {
		const { min, max } = INTENSITY_COUNTS[burst.intensity];
		const count = randomInt(min, max);

		return Array.from({ length: count }, (_, index) => ({
			id: `${burst.id}-${index}`,
			x: randomBetween(5, 95),
			drift: randomBetween(-80, 80),
			delay: randomBetween(0, 300),
			duration: randomBetween(1800, 2500),
			rise: randomBetween(60, 90),
			scale: randomBetween(0.8, 1.4),
			rotation: randomBetween(-180, 180),
			tone: randomInt(0, 2)
		}));
	}

	function spawnBurst(burst: PopcornBurstEvent) {
		if (reduceMotion) return;

		const nextParticles = createParticles(burst);
		particles = [...particles, ...nextParticles];

		const maxDuration = Math.max(...nextParticles.map((particle) => particle.duration + particle.delay));
		window.setTimeout(() => {
			const prefix = `${burst.id}-`;
			particles = particles.filter((particle) => !particle.id.startsWith(prefix));
		}, maxDuration + 100);
	}

	onMount(() => {
		if (!browser) return;

		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduceMotion = motionQuery.matches;

		const handleMotionChange = (event: MediaQueryListEvent) => {
			reduceMotion = event.matches;
		};

		motionQuery.addEventListener('change', handleMotionChange);

		const unsubscribe = popcorn.subscribe((burst) => {
			if (burst) {
				spawnBurst(burst);
			}
		});

		return () => {
			motionQuery.removeEventListener('change', handleMotionChange);
			unsubscribe();
		};
	});
</script>

<div class="popcorn-burst" aria-hidden="true">
	{#each particles as particle (particle.id)}
		<span
			class="popcorn-kernel popcorn-kernel--tone-{particle.tone}"
			style="
				--x: {particle.x}%;
				--drift: {particle.drift}px;
				--delay: {particle.delay}ms;
				--duration: {particle.duration}ms;
				--rise: {particle.rise}vh;
				--scale: {particle.scale};
				--rotation: {particle.rotation}deg;
			"
		></span>
	{/each}
</div>

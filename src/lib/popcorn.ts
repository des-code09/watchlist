import { writable } from 'svelte/store';

export type PopcornIntensity = 'watching' | 'watched';

export type PopcornBurstEvent = {
	id: number;
	intensity: PopcornIntensity;
};

function createPopcornTrigger() {
	const { subscribe, update } = writable<PopcornBurstEvent | null>(null);
	let nextId = 0;

	function triggerPopcorn(intensity: PopcornIntensity) {
		update(() => ({ id: nextId++, intensity }));
	}

	return { subscribe, triggerPopcorn };
}

export const popcorn = createPopcornTrigger();
export const { triggerPopcorn } = popcorn;

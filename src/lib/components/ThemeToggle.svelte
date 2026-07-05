<script lang="ts">
	import { onMount } from 'svelte';
	import MoonStar from '@lucide/svelte/icons/moon-star';
	import Sun from '@lucide/svelte/icons/sun';
	import { getEffectiveTheme, toggleTheme, type Theme } from '$lib/theme';

	let theme = $state<Theme>('light');

	onMount(() => {
		theme = getEffectiveTheme();
	});

	function handleToggle() {
		theme = toggleTheme();
	}
</script>

<button
	type="button"
	class="theme-switch"
	role="switch"
	aria-checked={theme === 'dark'}
	aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
	onclick={handleToggle}
>
	<span class="theme-switch-track" aria-hidden="true">
		<span class="theme-switch-sun">
			<Sun size={13} strokeWidth={2} />
		</span>
		<span class="theme-switch-moon">
			<MoonStar size={13} strokeWidth={2} />
		</span>
		<span class="theme-switch-thumb"></span>
	</span>
</button>

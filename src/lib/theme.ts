import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

export const STORAGE_KEY = 'theme';

export function getStoredTheme(): Theme | null {
	if (!browser) return null;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') return stored;
	return null;
}

export function getEffectiveTheme(): Theme {
	const stored = getStoredTheme();
	if (stored) return stored;
	if (browser && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		return 'dark';
	}
	return 'light';
}

export function applyTheme(theme: Theme): void {
	if (!browser) return;
	document.documentElement.dataset.theme = theme;
	localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme(): Theme {
	const next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
	applyTheme(next);
	return next;
}

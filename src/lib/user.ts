import type { User } from 'better-auth';

export function getInitials(user: Pick<User, 'name' | 'email'>): string {
	const source = user.name?.trim() || user.email;
	const parts = source.split(/\s+/).filter(Boolean);
	if (parts.length >= 2) {
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}
	return source.slice(0, 2).toUpperCase();
}

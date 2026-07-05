import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchMovies } from '$lib/server/tmdb';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}

	const query = event.url.searchParams.get('q')?.trim() ?? '';
	if (query.length < 2) {
		error(400, 'Query must be at least 2 characters');
	}

	try {
		const results = await searchMovies(query);
		return json({ results });
	} catch {
		error(502, 'Failed to search movies');
	}
};

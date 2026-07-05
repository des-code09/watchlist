import { fail, redirect } from '@sveltejs/kit';
import { and, desc, eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { movie } from '$lib/server/db/schema';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		return redirect(302, '/login');
	}

	const movies = await db
		.select()
		.from(movie)
		.where(eq(movie.userId, user.id))
		.orderBy(desc(movie.createdAt));

	return { movies };
};

export const actions: Actions = {
	addMovie: async (event) => {
		const user = event.locals.user;
		if (!user) {
			return redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const title = formData.get('title')?.toString().trim() ?? '';

		if (!title) {
			return fail(400, { message: 'Title is required' });
		}

		await db.insert(movie).values({ title, userId: user.id });
	},
	removeMovie: async (event) => {
		const user = event.locals.user;
		if (!user) {
			return redirect(302, '/login');
		}

		const formData = await event.request.formData();
		const idRaw = formData.get('id')?.toString();
		const id = idRaw ? Number.parseInt(idRaw, 10) : NaN;

		if (!idRaw || Number.isNaN(id)) {
			return fail(400, { message: 'Invalid movie' });
		}

		await db.delete(movie).where(and(eq(movie.id, id), eq(movie.userId, user.id)));
	},
	signOut: async (event) => {
		await auth.api.signOut({
			headers: event.request.headers
		});
		return redirect(302, '/login');
	}
};

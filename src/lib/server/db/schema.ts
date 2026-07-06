import { integer, pgTable, real, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.schema';

export const movie = pgTable('movie', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	tmdbId: integer('tmdb_id'),
	posterUrl: text('poster_url'),
	userRating: integer('user_rating'),
	tmdbRating: real('tmdb_rating'),
	releaseYear: integer('release_year'),
	genres: text('genres'),
	status: text('status').notNull().default('to_watch'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export * from './auth.schema';

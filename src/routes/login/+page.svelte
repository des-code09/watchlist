<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="card">
	<h1>Watchlist</h1>
	<p class="subtitle">Sign in or create an account to get started.</p>

	<form method="post" action="?/signInEmail" use:enhance>
		<label>
			Email
			<input type="email" name="email" required autocomplete="email" />
		</label>
		<label>
			Password
			<input type="password" name="password" required autocomplete="current-password" />
		</label>
		<label>
			Name <span class="hint">(for registration only)</span>
			<input name="name" autocomplete="name" />
		</label>
		<div class="actions">
			<button type="submit">Login</button>
			<button type="submit" class="secondary" formaction="?/signUpEmail">Register</button>
		</div>
	</form>
	{#if form?.message}
		<p class="error">{form.message}</p>
	{/if}
</div>

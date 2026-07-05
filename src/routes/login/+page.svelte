<script lang="ts">
	import { enhance } from '$app/forms';
	import Clapperboard from '@lucide/svelte/icons/clapperboard';
	import Lock from '@lucide/svelte/icons/lock';
	import LogIn from '@lucide/svelte/icons/log-in';
	import Mail from '@lucide/svelte/icons/mail';
	import User from '@lucide/svelte/icons/user';
	import UserPlus from '@lucide/svelte/icons/user-plus';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="card">
	<div class="brand">
		<Clapperboard size={28} />
		<div>
			<h1>Watchlist</h1>
			<p class="subtitle">Sign in or create an account to get started.</p>
		</div>
	</div>

	<form method="post" action="?/signInEmail" use:enhance>
		<label>
			<span class="label-row">
				<Mail size={14} />
				Email
			</span>
			<input type="email" name="email" required autocomplete="email" />
		</label>
		<label>
			<span class="label-row">
				<Lock size={14} />
				Password
			</span>
			<input type="password" name="password" required autocomplete="current-password" />
		</label>
		<label>
			<span class="label-row">
				<User size={14} />
				Name <span class="hint">(for registration only)</span>
			</span>
			<input name="name" autocomplete="name" />
		</label>
		<div class="actions">
			<button type="submit" class="btn-with-icon">
				<LogIn size={16} />
				Login
			</button>
			<button type="submit" class="secondary btn-with-icon" formaction="?/signUpEmail">
				<UserPlus size={16} />
				Register
			</button>
		</div>
	</form>
	{#if form?.message}
		<p class="error">{form.message}</p>
	{/if}
</div>

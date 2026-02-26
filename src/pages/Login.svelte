<script lang="ts">
	import { authStore } from '../stores/auth';

	let email = '';
	let password = '';
	let username = '';
	let isRegistering = false;
	let error = '';
	let loading = false;

	async function handleLogin() {
		error = '';
		loading = true;
		const success = await authStore.login(email, password);
		if (!success) {
			error = 'Invalid email or password';
		}
		loading = false;
	}

	async function handleRegister() {
		error = '';
		loading = true;
		const success = await authStore.register(username, email, password);
		if (!success) {
			error = 'Registration failed';
		} else {
			isRegistering = false;
		}
		loading = false;
	}
</script>

<div class="login-container">
	<div class="login-card card">
		<h1>🥭 Mango Dashboard</h1>
		<p class="subtitle">Manage your Minecraft servers</p>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		{#if !isRegistering}
			<form on:submit|preventDefault={handleLogin}>
				<div class="form-group">
					<label for="email">Email</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						placeholder="you@example.com"
						disabled={loading}
					/>
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						placeholder="••••••••"
						disabled={loading}
					/>
				</div>
				<button type="submit" disabled={loading}>
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>
			<p class="toggle">
				Don't have an account?
				<button
					type="button"
					on:click={() => {
						isRegistering = true;
						error = '';
					}}
					class="link-button">
					Register
				</button>
			</p>
		{:else}
			<form on:submit|preventDefault={handleRegister}>
				<div class="form-group">
					<label for="username">Username</label>
					<input
						type="text"
						id="username"
						bind:value={username}
						placeholder="cooluser"
						disabled={loading}
					/>
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						placeholder="you@example.com"
						disabled={loading}
					/>
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						placeholder="••••••••"
						disabled={loading}
					/>
				</div>
				<button type="submit" disabled={loading}>
					{loading ? 'Registering...' : 'Register'}
				</button>
			</form>
			<p class="toggle">
				Already have an account?
				<button
					type="button"
					on:click={() => {
						isRegistering = false;
						error = '';
					}}
					class="link-button">
					Login
				</button>
			</p>
		{/if}
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--bg-primary);
	}

	.login-card {
		width: 100%;
		max-width: 400px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
	}

	h1 {
		text-align: center;
		margin-bottom: 0.5rem;
		font-size: 2rem;
	}

	.subtitle {
		text-align: center;
		color: var(--text-secondary);
		margin-bottom: 2rem;
	}

	.error {
		background-color: rgba(239, 68, 68, 0.1);
		border: 1px solid var(--danger);
		color: #fecaca;
		padding: 0.75rem;
		border-radius: 0.375rem;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	label {
		font-weight: 500;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	form button {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 1rem;
	}

	form button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.toggle {
		text-align: center;
		margin-top: 1rem;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.link-button {
		background: none;
		border: none;
		color: var(--accent);
		cursor: pointer;
		padding: 0;
		text-decoration: underline;
		font-size: inherit;
	}

	.link-button:hover {
		background: none;
		color: var(--accent-hover);
	}
</style>

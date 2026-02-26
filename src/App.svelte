<script lang="ts">
	import './app.css';
	import { authStore } from './stores/auth';
	import Login from './pages/Login.svelte';
	import ServerList from './pages/ServerList.svelte';
	import ServerDetail from './pages/ServerDetail.svelte';

	let currentPage: 'login' | 'list' | 'detail' = 'login';
	let selectedServerId: string | null = null;

	authStore.subscribe(auth => {
		if (auth.token) {
			currentPage = 'list';
		} else {
			currentPage = 'login';
		}
	});

	function handleSelectServer(e: CustomEvent<string>) {
		selectedServerId = e.detail;
		currentPage = 'detail';
	}

	function handleBack() {
		currentPage = 'list';
		selectedServerId = null;
	}

	function handleLogout() {
		authStore.logout();
		currentPage = 'login';
	}
</script>

<div class="app">
	{#if currentPage === 'login'}
		<Login />
	{:else if currentPage === 'list'}
		<div class="header">
			<h1>🥭 Mango Dashboard</h1>
			<button on:click={handleLogout}>Logout</button>
		</div>
		<ServerList on:selectServer={handleSelectServer} />
	{:else if currentPage === 'detail' && selectedServerId}
		<div class="header">
			<button on:click={handleBack} class="secondary">← Back</button>
			<h1>🥭 Server Details</h1>
			<button on:click={handleLogout}>Logout</button>
		</div>
		<ServerDetail serverId={selectedServerId} />
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}

	.app {
		min-height: 100vh;
		background-color: var(--bg-primary);
	}

	.header {
		background-color: var(--bg-secondary);
		border-bottom: 1px solid var(--border);
		padding: 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.header h1 {
		flex: 1;
		margin: 0;
		font-size: 1.5rem;
	}
</style>

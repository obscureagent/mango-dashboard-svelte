<script lang="ts">
	import { serverStore } from '../stores/servers';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher<{ selectServer: string }>();
	let servers: any[] = [];
	let loading = true;

	onMount(async () => {
		await serverStore.fetchServers();
		serverStore.subscribe(s => {
			servers = s;
			loading = false;
		});
	});

	function selectServer(id: string) {
		dispatch('selectServer', id);
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'running':
				return 'green';
			case 'stopped':
				return 'gray';
			case 'starting':
			case 'stopping':
				return 'yellow';
			case 'crashed':
				return 'red';
			default:
				return 'gray';
		}
	}
</script>

<div class="container">
	<div class="list-header">
		<h2>Your Servers</h2>
		<p>{servers.length} server{servers.length !== 1 ? 's' : ''}</p>
	</div>

	{#if loading}
		<div class="loading">Loading servers...</div>
	{:else if servers.length === 0}
		<div class="empty">
			<p>No servers yet. Create one to get started!</p>
		</div>
	{:else}
		<div class="grid">
			{#each servers as server (server.id)}
				<div class="server-card card" on:click={() => selectServer(server.id)} role="button" tabindex="0">
					<div class="card-header">
						<h3>{server.name}</h3>
						<span class="status-badge" style="--status-color: {getStatusColor(server.status)}">
							{server.status}
						</span>
					</div>
					<div class="card-details">
						<p><strong>Type:</strong> {server.type}</p>
						<p><strong>Version:</strong> {server.version}</p>
						<p><strong>Port:</strong> {server.port}</p>
						<p><strong>Memory:</strong> {server.memoryMb} MB</p>
						<p><strong>Max Players:</strong> {server.maxPlayers}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.list-header {
		margin-bottom: 2rem;
	}

	.list-header h2 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
	}

	.list-header p {
		color: var(--text-secondary);
		margin: 0;
	}

	.loading {
		text-align: center;
		color: var(--text-secondary);
		padding: 2rem;
	}

	.empty {
		text-align: center;
		color: var(--text-secondary);
		padding: 2rem;
		background-color: var(--bg-secondary);
		border-radius: 0.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.server-card {
		cursor: pointer;
		transition: all 0.2s;
		border: 1px solid var(--border);
	}

	.server-card:hover {
		border-color: var(--accent);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
		transform: translateY(-2px);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: start;
		margin-bottom: 1rem;
	}

	.card-header h3 {
		margin: 0;
		font-size: 1.25rem;
		flex: 1;
	}

	.status-badge {
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		background-color: var(--status-color);
		opacity: 0.2;
		color: var(--status-color);
		white-space: nowrap;
		margin-left: 0.5rem;
	}

	.card-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.card-details p {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}

	.card-details strong {
		color: var(--text-primary);
	}
</style>

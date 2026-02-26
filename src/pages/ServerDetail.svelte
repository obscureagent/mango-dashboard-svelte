<script lang="ts">
	import { serverStore, type Server, type ServerStats } from '../stores/servers';
	import { onMount, onDestroy } from 'svelte';

	export let serverId: string;

	let server: Server | null = null;
	let stats: ServerStats | null = null;
	let loading = true;
	let consoleOutput: string[] = [];
	let consoleInput = '';
	let statsUpdateInterval: any;

	onMount(async () => {
		server = await serverStore.getServer(serverId);
		loading = false;

		// Simulate real-time stats updates
		statsUpdateInterval = setInterval(() => {
			if (server?.status === 'running') {
				stats = {
					serverId: server.id,
					cpuPercent: Math.random() * 80 + 10,
					memoryUsedMb: Math.random() * (server.memoryMb * 0.8) + 256,
					memoryLimitMb: server.memoryMb,
					playerCount: Math.floor(Math.random() * server.maxPlayers),
					uptime: Math.floor(Math.random() * 86400)
				};
			}
		}, 2000);

		// Add initial console message
		consoleOutput = ['[INFO] Server console connected'];
	});

	onDestroy(() => {
		clearInterval(statsUpdateInterval);
	});

	async function handleAction(action: 'start' | 'stop' | 'restart') {
		if (!server) return;
		if (action === 'start') {
			await serverStore.startServer(server.id);
		} else if (action === 'stop') {
			await serverStore.stopServer(server.id);
		} else if (action === 'restart') {
			await serverStore.restartServer(server.id);
		}
		server = await serverStore.getServer(serverId);
	}

	async function handleConsoleSubmit() {
		if (!consoleInput.trim()) return;
		consoleOutput = [...consoleOutput, `> ${consoleInput}`];
		consoleInput = '';
		// Simulate response
		setTimeout(() => {
			consoleOutput = [...consoleOutput, '[INFO] Command executed'];
		}, 500);
	}

	function formatUptime(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${mins}m`;
	}
</script>

<div class="container">
	{#if loading || !server}
		<div class="loading">Loading server details...</div>
	{:else}
		<div class="content-grid">
			<!-- Server Info & Controls -->
			<div>
				<div class="card">
					<h2>{server.name}</h2>
					<div class="info-grid">
						<div class="info-item">
							<span class="label">Type</span>
							<span class="value">{server.type}</span>
						</div>
						<div class="info-item">
							<span class="label">Version</span>
							<span class="value">{server.version}</span>
						</div>
						<div class="info-item">
							<span class="label">Port</span>
							<span class="value">{server.port}</span>
						</div>
						<div class="info-item">
							<span class="label">Container</span>
							<span class="value" style="font-family: monospace; font-size: 0.875rem;"
								>{server.containerId.slice(0, 12)}</span>
						</div>
					</div>
				</div>

				<div class="card">
					<h3>Controls</h3>
					<div class="button-group">
						<button
							on:click={() => handleAction('start')}
							disabled={server.status === 'running' || server.status === 'starting'}>
							▶ Start
						</button>
						<button
							on:click={() => handleAction('restart')}
							disabled={server.status !== 'running'}
							class="secondary">
							🔄 Restart
						</button>
						<button
							on:click={() => handleAction('stop')}
							disabled={server.status === 'stopped' || server.status === 'stopping'}
							class="danger">
							⏹ Stop
						</button>
					</div>
				</div>

				<!-- Stats Section -->
				{#if stats && server.status === 'running'}
					<div class="card">
						<h3>Real-time Stats</h3>
						<div class="stats-grid">
							<div class="stat-box">
								<div class="stat-label">CPU Usage</div>
								<div class="stat-value">{stats.cpuPercent.toFixed(1)}%</div>
								<div class="stat-bar">
									<div class="stat-fill" style="width: {stats.cpuPercent}%"></div>
								</div>
							</div>
							<div class="stat-box">
								<div class="stat-label">Memory</div>
								<div class="stat-value">
									{stats.memoryUsedMb.toFixed(0)} / {stats.memoryLimitMb} MB
								</div>
								<div class="stat-bar">
									<div
										class="stat-fill"
										style="width: {(stats.memoryUsedMb / stats.memoryLimitMb) * 100}%"></div>
								</div>
							</div>
							<div class="stat-box">
								<div class="stat-label">Players</div>
								<div class="stat-value">{stats.playerCount} / {server.maxPlayers}</div>
								<div class="stat-bar">
									<div
										class="stat-fill"
										style="width: {(stats.playerCount / server.maxPlayers) * 100}%"></div>
								</div>
							</div>
							<div class="stat-box">
								<div class="stat-label">Uptime</div>
								<div class="stat-value">{formatUptime(stats.uptime)}</div>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Console Section -->
			<div class="card console-card">
				<h3>Console</h3>
				<div class="console-output">
					{#each consoleOutput as line}
						<div class="console-line">{line}</div>
					{/each}
				</div>
				<form on:submit|preventDefault={handleConsoleSubmit} class="console-input-form">
					<input
						type="text"
						bind:value={consoleInput}
						placeholder="Enter command..."
						disabled={server.status !== 'running'}
					/>
					<button type="submit" disabled={server.status !== 'running'}>Send</button>
				</form>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.loading {
		text-align: center;
		color: var(--text-secondary);
		padding: 2rem;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	@media (max-width: 1024px) {
		.content-grid {
			grid-template-columns: 1fr;
		}
	}

	.card h2 {
		margin: 0 0 1.5rem 0;
		font-size: 1.75rem;
	}

	.card h3 {
		margin: 0 0 1rem 0;
		font-size: 1.125rem;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.label {
		font-size: 0.75rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		font-weight: 600;
	}

	.value {
		font-size: 0.95rem;
		color: var(--text-primary);
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.button-group button {
		width: 100%;
		padding: 0.75rem 1rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.stat-box {
		background-color: var(--bg-primary);
		padding: 1rem;
		border-radius: 0.375rem;
		border: 1px solid var(--border);
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--accent);
	}

	.stat-bar {
		width: 100%;
		height: 6px;
		background-color: var(--bg-tertiary);
		border-radius: 3px;
		overflow: hidden;
	}

	.stat-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent), #0ea5e9);
		transition: width 0.3s ease;
	}

	.console-card {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: fit-content;
	}

	.console-output {
		flex: 1;
		background-color: var(--bg-primary);
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		padding: 1rem;
		font-family: 'Courier New', monospace;
		font-size: 0.875rem;
		overflow-y: auto;
		max-height: 400px;
		color: #10b981;
	}

	.console-line {
		margin: 0.25rem 0;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.console-input-form {
		display: flex;
		gap: 0.5rem;
	}

	.console-input-form input {
		flex: 1;
	}

	.console-input-form button {
		width: auto;
		padding: 0.5rem 1rem;
	}
</style>

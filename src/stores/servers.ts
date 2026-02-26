import { writable } from 'svelte/store';
import { authStore } from './auth';

export interface Server {
	id: string;
	name: string;
	ownerId: string;
	type: 'paper' | 'forge' | 'fabric' | 'vanilla';
	version: string;
	port: number;
	memoryMb: number;
	maxPlayers: number;
	status: 'created' | 'starting' | 'running' | 'stopping' | 'stopped' | 'crashed';
	containerId: string;
	createdAt: string;
}

export interface ServerStats {
	serverId: string;
	cpuPercent: number;
	memoryUsedMb: number;
	memoryLimitMb: number;
	playerCount: number;
	uptime: number;
}

function createServerStore() {
	const { subscribe, set, update } = writable<Server[]>([]);

	let token: string | null = null;
	authStore.subscribe(auth => {
		token = auth.token;
	});

	return {
		subscribe,
		fetchServers: async () => {
			if (!token) return;
			const response = await fetch('/site/mango-dashboard/mock/servers', {
				headers: { Authorization: `Bearer ${token}` }
			});
			const servers = await response.json();
			set(servers);
		},
		getServer: async (id: string): Promise<Server | null> => {
			if (!token) return null;
			const response = await fetch(`/site/mango-dashboard/mock/servers/${id}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
			return await response.json();
		},
		createServer: async (data: Partial<Server>) => {
			if (!token) return;
			const response = await fetch('/site/mango-dashboard/mock/servers', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
			const server = await response.json();
			update(servers => [...servers, server]);
		},
		startServer: async (id: string) => {
			if (!token) return;
			await fetch(`/site/mango-dashboard/mock/servers/${id}/start`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` }
			});
			update(servers =>
				servers.map(s => (s.id === id ? { ...s, status: 'running' as const } : s))
			);
		},
		stopServer: async (id: string) => {
			if (!token) return;
			await fetch(`/site/mango-dashboard/mock/servers/${id}/stop`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` }
			});
			update(servers =>
				servers.map(s => (s.id === id ? { ...s, status: 'stopped' as const } : s))
			);
		},
		restartServer: async (id: string) => {
			if (!token) return;
			await fetch(`/site/mango-dashboard/mock/servers/${id}/restart`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${token}` }
			});
			update(servers =>
				servers.map(s => (s.id === id ? { ...s, status: 'starting' as const } : s))
			);
		},
		deleteServer: async (id: string) => {
			if (!token) return;
			await fetch(`/site/mango-dashboard/mock/servers/${id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${token}` }
			});
			update(servers => servers.filter(s => s.id !== id));
		}
	};
}

export const serverStore = createServerStore();

import { writable } from 'svelte/store';

export interface User {
	id: string;
	username: string;
	email: string;
	role: 'user' | 'admin';
}

export interface AuthState {
	token: string | null;
	user: User | null;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		token: localStorage.getItem('token'),
		user: null
	});

	return {
		subscribe,
		login: async (email: string, password: string) => {
			const response = await fetch('/mock/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			const data = await response.json();
			if (data.token) {
				localStorage.setItem('token', data.token);
				set({ token: data.token, user: data.user });
				return true;
			}
			return false;
		},
		register: async (username: string, email: string, password: string) => {
			const response = await fetch('/mock/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password })
			});
			const data = await response.json();
			if (data.token) {
				localStorage.setItem('token', data.token);
				set({ token: data.token, user: data.user });
				return true;
			}
			return false;
		},
		logout: () => {
			localStorage.removeItem('token');
			set({ token: null, user: null });
		}
	};
}

export const authStore = createAuthStore();

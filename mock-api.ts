import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Mock data
const users: Record<string, any> = {
	'test@example.com': {
		id: 'user-1',
		username: 'testuser',
		email: 'test@example.com',
		password: 'password123',
		role: 'user'
	}
};

const servers: Record<string, any> = {
	'server-1': {
		id: 'server-1',
		name: 'Survival World',
		ownerId: 'user-1',
		type: 'paper',
		version: '1.21.1',
		port: 25565,
		memoryMb: 2048,
		maxPlayers: 20,
		status: 'running',
		containerId: 'abc123def456ghi789jkl',
		createdAt: new Date().toISOString()
	},
	'server-2': {
		id: 'server-2',
		name: 'Creative Realm',
		ownerId: 'user-1',
		type: 'fabric',
		version: '1.20.4',
		port: 25566,
		memoryMb: 1024,
		maxPlayers: 10,
		status: 'stopped',
		containerId: 'xyz789uvw456mno123pqr',
		createdAt: new Date().toISOString()
	},
	'server-3': {
		id: 'server-3',
		name: 'PvP Arena',
		ownerId: 'user-1',
		type: 'vanilla',
		version: '1.21',
		port: 25567,
		memoryMb: 3072,
		maxPlayers: 50,
		status: 'running',
		containerId: 'def456ghi789jkl012mno',
		createdAt: new Date().toISOString()
	}
};

// JWT simulation (for demo purposes, just use email as token)
function getTokenUser(token: string): any {
	const user = Object.values(users).find(u => u.email === token.replace('Bearer ', ''));
	return user;
}

// Auth endpoints
app.post('/mock/auth/login', (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user = users[email];
	if (user && user.password === password) {
		res.json({
			token: email,
			user: { id: user.id, username: user.username, email: user.email, role: user.role }
		});
	} else {
		res.status(401).json({ error: 'Invalid credentials' });
	}
});

app.post('/mock/auth/register', (req: Request, res: Response) => {
	const { username, email, password } = req.body;
	if (users[email]) {
		res.status(400).json({ error: 'User already exists' });
		return;
	}
	const newUser = {
		id: `user-${Date.now()}`,
		username,
		email,
		password,
		role: 'user'
	};
	users[email] = newUser;
	res.json({
		token: email,
		user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }
	});
});

// Server endpoints
app.get('/mock/servers', (req: Request, res: Response) => {
	const token = req.headers.authorization?.replace('Bearer ', '');
	if (!token || !users[token]) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	res.json(Object.values(servers));
});

app.get('/mock/servers/:id', (req: Request, res: Response) => {
	const token = req.headers.authorization?.replace('Bearer ', '');
	if (!token || !users[token]) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	const server = servers[req.params.id];
	if (!server) {
		res.status(404).json({ error: 'Server not found' });
		return;
	}
	res.json(server);
});

app.post('/mock/servers/:id/start', (req: Request, res: Response) => {
	const token = req.headers.authorization?.replace('Bearer ', '');
	if (!token || !users[token]) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	const server = servers[req.params.id];
	if (server) {
		server.status = 'running';
	}
	res.json({ success: true });
});

app.post('/mock/servers/:id/stop', (req: Request, res: Response) => {
	const token = req.headers.authorization?.replace('Bearer ', '');
	if (!token || !users[token]) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	const server = servers[req.params.id];
	if (server) {
		server.status = 'stopped';
	}
	res.json({ success: true });
});

app.post('/mock/servers/:id/restart', (req: Request, res: Response) => {
	const token = req.headers.authorization?.replace('Bearer ', '');
	if (!token || !users[token]) {
		res.status(401).json({ error: 'Unauthorized' });
		return;
	}
	const server = servers[req.params.id];
	if (server) {
		server.status = 'starting';
		setTimeout(() => {
			server.status = 'running';
		}, 2000);
	}
	res.json({ success: true });
});

const PORT = 5174;
app.listen(PORT, '0.0.0.0', () => {
	console.log(`Mock API server running on http://0.0.0.0:${PORT}`);
	console.log('Test credentials: test@example.com / password123');
});

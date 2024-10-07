import express from 'express';
import { Client, Auth, UserCompact } from 'osu-web.js';
import { config } from 'dotenv';
config();

import fs from 'fs';
import cors from 'cors';
import { addUser, getUser, getUsers } from './controllers/userController';
import mongoose from 'mongoose';

const PORT = 5000;

const CLIENT_ID = Number(process.env.CLIENT_ID);
const auth = new Auth(
	CLIENT_ID!,
	process.env.CLIENT_SECRET!,
	process.env.REDIRECT_URI!
);
let api: Client;

interface apiToken {
	expires: number;
	accessToken: string;
	tokenType: string;
}

async function main() {
	const token: apiToken = await setupAPI();
	api = new Client(token.accessToken);
	let ids: { [key: string]: string[] } = {}; // Dictionary to store user IDs and their events
	let cursor: any = null;
	const loops = 1;

	for (let i = 0; i < loops; i++) {
		const r: any = await api.ranking.getRanking(
			'osu',
			'performance',
			cursor ? { query: cursor } : {}
		);
		const ranking = r.ranking;

		// Initialize empty arrays in the dictionary for each user ID
		ranking.forEach((obj: any) => {
			ids[obj.user.id] = []; // Initialize an empty array for each user ID
		});
		cursor = r.cursor;
	}

	async function fetchAndStoreEvents() {
		// Map over ids to create an array of promises
		const promises = Object.keys(ids).map(async (id) => {
			const events = await api.users.getUserScores(
				parseInt(id),
				'recent',
				{
					query: {
						mode: 'osu',
					},
				}
			);
			events.forEach((event) => {
				if (event.pp > 500) {
					ids[id].push(event.beatmapset.title); // Add the title to the corresponding user's array
				}
			});
		});

		// Wait for all promises to resolve
		await Promise.all(promises);
		console.log(ids); // Log the entire ids dictionary
	}

	fetchAndStoreEvents();

	return;

	// Initialize routes after 'api' is initialized
	setupRoutes();
}

async function setupAPI(): Promise<apiToken> {
	const read = fs.readFileSync('data.json', 'utf8');

	if (!read || !read.length) {
		return await newToken();
	}
	const curToken = JSON.parse(read);

	if (curToken.expires! > Date.now() / 1000) {
		console.log('using existing token');
		return curToken;
	}

	return await newToken();
}

async function newToken(): Promise<apiToken> {
	const token = await auth.clientCredentialsGrant();
	const saveToken: apiToken = {
		expires: token.expires_in + Date.now() / 1000,
		accessToken: token.access_token,
		tokenType: token.token_type,
	};
	const jsonData = JSON.stringify(saveToken, null, 2);
	fs.writeFileSync('data.json', jsonData);

	console.log('generated new token');
	return saveToken;
}

const app = express();
app.use(
	cors({
		origin: '*',
	})
);
app.use(express.json());

// Define routes, called after osu! api token is initialized
function setupRoutes() {
	app.get('/users/:userID', getUser(api));
	app.get('/users', getUsers);
	app.post('/users/', addUser);

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

mongoose.connect(process.env.MONGO_URL!).then(() => {
	console.log('connected to mongo');
	main();
});

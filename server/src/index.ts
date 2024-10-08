import express from 'express';
import { Client, Auth } from 'osu-web.js';
import { config } from 'dotenv';
config();

import fs from 'fs';
import cors from 'cors';
import {
	addUser,
	getUser,
	getUsers,
	getUsersLeaderboard,
} from './controllers/userController';
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
	setupRoutes();
}

async function setupAPI(): Promise<apiToken> {
	if (!fs.existsSync('data.json')) {
		return await newToken();
	}

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

// define routes, called after osu! api object is initialized
function setupRoutes() {
	app.get('/users/:userID', getUser(api));
	app.get('/users', getUsers);
	app.get('/users/leaderboard/:ranks', getUsersLeaderboard(api));
	app.post('/users', addUser);

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

mongoose.connect(process.env.MONGO_URL!).then(() => {
	console.log('connected to mongo');
	main();
});

import express from 'express';
import { Client, Auth } from 'osu-web.js';
import { config } from 'dotenv';
import fs from 'fs';
import cors from 'cors';
import { getUser } from './controllers/userController';
config();

const PORT = 5000;

const CLIENT_ID = Number(process.env.CLIENT_ID);
const auth = new Auth(CLIENT_ID!, process.env.CLIENT_SECRET!, process.env.REDIRECT_URI!);
let api: Client;

interface apiToken {
  expires: number;
  accessToken: string;
  tokenType: string;
}

async function main() {
  const token: apiToken = await setupAPI();
  api = new Client(token.accessToken);

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
  app.get('/user/:userID', getUser(api));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();

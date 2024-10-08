import { Request, Response } from 'express';
import { Client, isOsuJSError } from 'osu-web.js';
import { parseUser } from '../utils/userUtils';
import User from '../models/User';
import { userObject } from '../../../shared/types/UserObject';

export const getUser =
  (api: Client) =>
  async (req: Request, res: Response): Promise<void> => {
    const userID = req.params.userID;

    try {
      const u = await api.users.getUser(userID, {
        urlParams: {
          mode: 'osu',
        },
      });

      const user = parseUser(u);
      res.send(user);
    } catch (error) {
      if (isOsuJSError(error)) {
        res.status(404).send({ message: 'User not found.' });
      } else {
        res.status(500).send({
          message: 'An error occurred while fetching the user.',
        });
      }
    }
  };

export const getUsersLeaderboard =
  (api: Client) =>
  async (req: Request, res: Response): Promise<void> => {
    const ranks: number = parseInt(req.params.ranks);
    const loops = Math.ceil(ranks / 50);
    let ids: { [key: string]: string[] } = {}; // dictionary to store user IDs and their events
    let cursor = null;
    let idList: string[] = [];

    try {
      // Fetch user IDs
      for (let i = 0; i < loops; i++) {
        const r: any = await api.ranking.getRanking(
          'osu',
          'performance',
          cursor ? { query: cursor } : {}
        );
        const ranking = r.ranking;

        // only add array for users with play
        ranking.forEach((obj: { user: { id: string } }) => {
          // ids[obj.user.id] = [];
          idList.push(obj.user.id);
        });
        cursor = r.cursor;
      }

      // Fetch and store events after collecting user IDs
      await fetchAndStoreEvents(ids, idList, api);

      res.send(ids);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error: 'Failed to fetch leaderboard or events.',
      });
    }
  };

// Separate function to fetch and store user events
async function fetchAndStoreEvents(
  ids: { [key: string]: string[] },
  idList: string[],
  api: Client
) {
  const promises = idList.map(async (id) => {
    const events = await api.users.getUserScores(parseInt(id), 'recent', {
      query: { mode: 'osu' },
    });
    events.forEach((event) => {
      if (event.pp > 800) {
        // keep track of users with scores > X pp
        if (!ids[id]) {
          ids[id] = [];
        }
        ids[id].push(event.beatmapset.title);
      }
    });
  });

  await Promise.all(promises);
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  const users = await User.find();
  res.json(users);
}

export async function addUser(req: Request, res: Response) {
  console.log(req.body.username);

  const user: userObject = req.body.user;

  const newUser = new User({
    username: user.username,
    id: user.id,
    pp: user.pp,
  });

  const createdUser = await newUser.save();
  res.json(createdUser);
}

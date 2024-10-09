import { Request, Response } from 'express';
import {
  BeatmapsetCompact,
  Client,
  GameMode,
  isOsuJSError,
  Mod,
  ScoreStatistics,
} from 'osu-web.js';
import { parseUser } from '../utils/userUtils';
import User from '../models/User';
import { userObject, scoreType } from '../../../shared/types/UserObject';

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
    let ids: { [key: string]: { username: string; events: scoreType[] } } = {};
    let cursor = null;
    let idList: string[] = [];

    try {
      for (let i = 0; i < loops; i++) {
        const r: any = await api.ranking.getRanking(
          'osu',
          'performance',
          cursor ? { query: cursor } : {}
        );
        const ranking = r.ranking;

        ranking.forEach((obj: any) => {
          const userId = obj.user.id;
          idList.push(userId);
          ids[userId] = { username: obj.user.username, events: [] };
        });
        cursor = r.cursor;
      }

      await fetchAndStoreEvents(ids, idList, api);

      Object.keys(ids).forEach((userId) => {
        if (ids[userId].events.length === 0) {
          delete ids[userId];
        }
      });

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
  ids: { [key: string]: { username: string; events: scoreType[] } },
  idList: string[],
  api: Client
) {
  const promises = idList.map(async (id) => {
    const events = await api.users.getUserScores(parseInt(id), 'recent', {
      query: { mode: 'osu' },
    });

    events.forEach((event) => {
      if (event.pp > 800) {
        console.log(event);
        const scoreObj: scoreType = {
          user: {
            id: event.user.id,
            username: event.user.username,
          },
          score: {
            pp: event.pp,
            title: event.beatmapset.title,
            playID: event.id,
            accuracy: event.accuracy,
            mods: event.mods,
            passed: event.passed,
            statistics: {
              ctMiss: event.statistics.count_miss,
              ct50: event.statistics.count_50,
              ct100: event.statistics.count_100,
              ct300: event.statistics.count_300,
            },
          },
        };

        ids[id].events.push(scoreObj);
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
  const user: userObject = req.body.user;

  const newUser = new User({
    username: user.username,
    id: user.id,
    pp: user.pp,
  });

  const createdUser = await newUser.save();
  res.json(createdUser);
}

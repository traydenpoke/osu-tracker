import { Request, Response } from 'express';
import { Client, isOsuJSError } from 'osu-web.js';
import { parseUser } from '../utils/userUtils';

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
        res.status(500).send({ message: 'An error occurred while fetching the user.' });
      }
    }
  };

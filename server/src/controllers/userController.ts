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

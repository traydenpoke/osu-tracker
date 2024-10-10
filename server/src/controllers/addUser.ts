import { Request, Response } from 'express';
import { userObject } from '../../../shared/types/UserObject';
import User from '../models/User';

export async function addUser(req: Request, res: Response): Promise<void> {
	const user: userObject = req.body.user;

	const newUser = new User({
		username: user.username,
		id: user.id,
		pp: user.pp,
	});

	const createdUser = await newUser.save();
	res.json(createdUser);
}

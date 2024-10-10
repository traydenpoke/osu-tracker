import { Request, Response } from 'express';
import User from '../models/User';

export async function getUsers(req: Request, res: Response): Promise<void> {
	const users = await User.find();
	res.json(users);
}

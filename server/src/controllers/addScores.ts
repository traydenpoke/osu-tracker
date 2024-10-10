import { Request, Response } from 'express';
import Score from '../models/Score';

export async function addScores(req: Request, res: Response): Promise<void> {
	const { user, scores } = req.body;

	try {
		// Check if a user with the given id already exists
		const existingUser = await Score.findOne({ 'user.id': user.id });

		if (existingUser) {
			// If user exists, only add scores to array that don't already exist
			existingUser.scores.push(...scores);
			const updatedScore = await existingUser.save();
			res.json(updatedScore);
		} else {
			// If user doesn't exist, create a new Score document
			const newScore = new Score({
				user: user,
				scores: scores,
			});
			const createdScore = await newScore.save();
			res.json(createdScore);
		}
	} catch (error) {
		res.status(500).json({ error: 'Error adding score' });
	}
}

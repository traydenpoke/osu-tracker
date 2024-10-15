import { Request, Response } from 'express';
import Score from '../models/Score';
import { scoreType } from '../../../shared/types/UserObject';

export async function addScores(req: Request, res: Response): Promise<void> {
  const { user, scores } = req.body;

  try {
    // Check if a user with the given id already exists
    const existingUser = await Score.findOne({ 'user.id': user.id });

    if (existingUser) {
      // Filter out scores that already exist based on playID
      const existingPlayIDs = new Set(existingUser.scores.map((score) => score.playID));
      const newScores = scores.filter((score: scoreType) => !existingPlayIDs.has(score.playID));

      // Add only the new scores that don't already exist
      existingUser.scores.push(...newScores);
      const updatedScores = await existingUser.save();
      res.json(updatedScores);
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

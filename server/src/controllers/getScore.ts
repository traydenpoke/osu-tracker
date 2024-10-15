import { Request, Response } from 'express';
import Score from '../models/Score';

export async function getScore(req: Request, res: Response): Promise<void> {
  const userID = req.params.userID;

  try {
    let userScores;
    if (!isNaN(Number(userID))) {
      userScores = await Score.find({ 'user.id': Number(userID) });
    } else {
      userScores = await Score.find({
        'user.username': { $regex: new RegExp(`^${userID}$`, 'i') },
      });
    }

    res.json(userScores);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving scores' });
  }
}

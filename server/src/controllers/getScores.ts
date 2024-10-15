import { Request, Response } from 'express';
import Score from '../models/Score';

export async function getScores(req: Request, res: Response): Promise<void> {
  const scores = await Score.find();
  res.json(scores);
}

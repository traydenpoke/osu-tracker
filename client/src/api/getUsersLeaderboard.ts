import { usersEventsType } from '../types';

export async function getUsersLeaderboard(ranks: string): Promise<usersEventsType> {
  const response = await fetch(`http://localhost:5000/users/leaderboard/${ranks}`);
  return await response.json();
}

import { scoreType } from '../../../shared/types/UserObject';

export async function addScore(score: scoreType): Promise<any> {
  const response = await fetch(`http://localhost:5000/users`, {
    method: 'POST',
    body: JSON.stringify({ score }),
    headers: { 'Content-Type': 'application/json' },
  });

  return await response.json();
}

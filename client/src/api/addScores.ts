import { scoreType } from '../../../shared/types/UserObject';

export async function addScores(user: any, scores: scoreType[]): Promise<any> {
	const response = await fetch(`http://localhost:5000/scores`, {
		method: 'POST',
		body: JSON.stringify({ user: user, scores: scores }),
		headers: { 'Content-Type': 'application/json' },
	});

	return await response.json();
}

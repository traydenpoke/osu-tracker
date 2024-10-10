import { Request, Response } from 'express';
import { Client, Mod } from 'osu-web.js';
import { scoreType } from '../../../shared/types/UserObject';

export const getUsersLeaderboard =
	(api: Client) =>
	async (req: Request, res: Response): Promise<void> => {
		const ranks: number = parseInt(req.params.ranks);
		const loops = Math.ceil(ranks / 50);
		let ids: { [key: string]: { username: string; scores: scoreType[] } } = {};
		let cursor = null;
		let idList: string[] = [];

		try {
			for (let i = 0; i < loops; i++) {
				const r: any = await api.ranking.getRanking('osu', 'performance', cursor ? { query: cursor } : {});
				const ranking = r.ranking;

				ranking.forEach((obj: any) => {
					const userId = obj.user.id;
					idList.push(userId);
					ids[userId] = { username: obj.user.username, scores: [] };
				});
				cursor = r.cursor;
			}

			await fetchAndStoreScores(ids, idList, api);

			Object.keys(ids).forEach((userId) => {
				if (ids[userId].scores.length === 0) {
					delete ids[userId];
				}
			});

			res.send(ids);
		} catch (error) {
			console.log(error);
			res.status(500).send({
				error: 'Failed to fetch leaderboard or scores.',
			});
		}
	};

// Separate function to fetch and store user scores
async function fetchAndStoreScores(
	ids: { [key: string]: { username: string; scores: scoreType[] } },
	idList: string[],
	api: Client
) {
	const promises = idList.map(async (id) => {
		const scores = await api.users.getUserScores(parseInt(id), 'recent', {
			query: { mode: 'osu' },
		});

		scores.forEach((score) => {
			if (score.pp > 600) {
				const scoreObj: scoreType = {
					pp: score.pp,
					title: score.beatmapset.title,
					playID: score.id,
					accuracy: score.accuracy,
					mods: score.mods,
					passed: score.passed,
					statistics: {
						ctMiss: score.statistics.count_miss,
						ct50: score.statistics.count_50,
						ct100: score.statistics.count_100,
						ct300: score.statistics.count_300,
					},
				};

				ids[id].scores.push(scoreObj);
			}
		});
	});

	await Promise.all(promises);
}

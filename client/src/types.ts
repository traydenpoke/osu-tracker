import { scoreType } from '../../shared/types/UserObject';

export interface userDB {
	_id: string;
	username: string;
	id: string;
	pp: number;
	__v: string;
}

export type usersScoresType = {
	[key: string]: {
		username: string;
		scores: scoreType[];
	};
};

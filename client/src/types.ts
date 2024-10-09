import { scoreType } from '../../shared/types/UserObject';

export interface userDB {
  _id: string;
  username: string;
  id: string;
  pp: number;
  __v: string;
}

export type usersEventsType = {
  [key: string]: {
    username: string;
    events: scoreType[];
  };
};

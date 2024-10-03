import { UserExtended } from 'osu-web.js';
import { userObject } from '../../../shared/types/UserObject';

export function parseUser(user: UserExtended): userObject {
    const u = {
        username: user.username,
        id: user.id,
        pp: user.statistics.pp,
    };

    return u;
}

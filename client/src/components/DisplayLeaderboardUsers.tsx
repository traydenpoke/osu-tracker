import { useEffect, useState } from 'react';
import { usersScoresType } from '../types';
import { getUsersLeaderboard } from '../api/getUsersLeaderboard';
import { addScores } from '../api/addScores';
import '../styles/DisplayLeaderboardUsers.css';
import Score from './Score';

const DisplayLeaderboardUsers = () => {
  const [usersScores, setUsersScores] = useState<usersScoresType>({});

  async function getUsers(): Promise<void> {
    console.log('fetching users');
    // Fetch leaderboard users from the API
    const scores = await getUsersLeaderboard('50');
    setUsersScores(scores);

    console.log('saving scores');
    Object.keys(usersScores).map(async (userID: string) => {
      const scores = usersScores[userID].scores;
      const user = {
        id: userID,
        username: usersScores[userID].username,
      };
      // const newScore = await addScores(user, scores);
      // console.log(newScore);
    });
  }

  useEffect(() => {
    getUsers();

    const minutes = 5;
    const interval = setInterval(() => {
      getUsers();
    }, minutes * 60 * 1000); // converts to ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='scores'>
      {Object.keys(usersScores).map((userID: string) => (
        <div className='userScore' key={userID}>
          <h3>
            <a href={`https://osu.ppy.sh/users/${userID}`} target='_blank'>
              {usersScores[userID].username}
            </a>
          </h3>
          <Score scores={usersScores[userID].scores} />
        </div>
      ))}
    </div>
  );
};

export default DisplayLeaderboardUsers;

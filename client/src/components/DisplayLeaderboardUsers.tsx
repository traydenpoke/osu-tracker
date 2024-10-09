import { useEffect, useState } from 'react';
import '../styles/DisplayLeaderboardUsers.css';
import { usersEventsType } from '../types';
import { getUsersLeaderboard } from '../api/getUsersLeaderboard';
import { scoreType } from '../../../shared/types/UserObject';

const DisplayLeaderboardUsers = () => {
  const [usersEvents, setUsersEvents] = useState<usersEventsType>({});

  async function getUsers(): Promise<void> {
    console.log('fetching users');
    // Fetch leaderboard users from the API
    const events = await getUsersLeaderboard('50');
    console.log(events);
    setUsersEvents(events);

    Object.keys(usersEvents).map((userID: string, index: number) => {
      usersEvents[userID].events.map((event: scoreType, eventIndex) => {
        //
      });
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
      {Object.keys(usersEvents).map((userID: string, index: number) => (
        <div className='userScore' key={index}>
          <h3>
            <a href={`https://osu.ppy.sh/users/${userID}`} target='_blank'>
              {usersEvents[userID].username}
            </a>{' '}
          </h3>
          {usersEvents[userID].events.map((event, eventIndex) => (
            <p key={eventIndex}>
              {event.score.title} <br /> {event.score.pp}pp -{' '}
              {Math.round(event.score.accuracy * 100 * 100) / 100}%
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DisplayLeaderboardUsers;

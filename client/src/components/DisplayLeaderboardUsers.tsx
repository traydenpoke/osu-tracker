import { useEffect, useState } from 'react';

type UsersDBType = {
  [key: string]: string[];
};

const DisplayLeaderboardUsers = () => {
  const [usersDB, setUsersDB] = useState<UsersDBType>({});

  async function getUsers(): Promise<void> {
    if (Object.keys(usersDB).length !== 0) return;

    // Fetch leaderboard users from the API
    const response = await fetch('http://localhost:5000/users/leaderboard/100');
    const users = await response.json();
    setUsersDB(users);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      {Object.keys(usersDB).map((userID: string, index: number) => (
        <div key={index}>
          <p>
            {userID}: {usersDB[userID].join(', ')}
          </p>{' '}
        </div>
      ))}
    </div>
  );
};

export default DisplayLeaderboardUsers;

import { useEffect, useState } from 'react';
import './App.css';
import AddUser from './components/AddUser';
import SearchBox from './components/SearchBox';
import UserPrompt from './components/UserPrompt';
import { userDB } from './types';
import DisplayLeaderboardUsers from './components/DisplayLeaderboardUsers';
import DisplayUsers from './components/DisplayUsers';

function App() {
  const [databaseUsers, setDatabaseUsers] = useState<userDB[]>([]);

  async function getUsers() {
    const response = await fetch(`http://localhost:5000/users`);
    const users = await response.json();
    setDatabaseUsers(users);
  }

  // call only on component mount (?)
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <SearchBox databaseUsers={databaseUsers} />
      <UserPrompt />
      <AddUser databaseUsers={databaseUsers} setDatabaseUsers={setDatabaseUsers} />
      <DisplayLeaderboardUsers />
      <DisplayUsers databaseUsers={databaseUsers} />
    </>
  );
}

export default App;

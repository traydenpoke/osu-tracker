import { useState } from 'react';
import { userDB } from '../types';
import { createUser } from '../api/createUser';

interface AddUserProps {
  setDatabaseUsers: React.Dispatch<React.SetStateAction<userDB[]>>;
  databaseUsers: userDB[];
}

const AddUser: React.FC<AddUserProps> = ({ setDatabaseUsers, databaseUsers }) => {
  const [inputValue, setInputValue] = useState('');

  async function addUser(value: string) {
    if (databaseUsers.some((obj) => obj.id === value)) {
      console.log('User already in DB');
      return;
    }

    const newUser = await createUser(value);
    setInputValue('');

    if (newUser === null) {
      console.log('error');
      return;
    }

    setDatabaseUsers([...databaseUsers, newUser]);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      addUser(inputValue);
    }
  }

  return (
    <div>
      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={() => addUser(inputValue)}>Add User</button>
      <button onClick={() => console.log(databaseUsers)}>Log Users</button>
    </div>
  );
};

export default AddUser;

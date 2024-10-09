import { useState } from 'react';
import User from './User';

const UserPrompt = () => {
  const [inputValue, setInputValue] = useState('');
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function getUser(value: string): Promise<void> {
    try {
      const response = await fetch(`http://localhost:5000/users/${value}`);
      if (!response.ok) {
        const errorData = await response.json(); // error message comes from getUser
        throw new Error(errorData.message || 'User not found.'); // caught below
      }

      const data = await response.json();
      setUserData(data);
      setErrorMessage('');
    } catch (err) {
      setUserData(null);
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      getUser(inputValue); // Call the getUser function on Enter key press
    }
  };

  return (
    <div>
      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown} // Add the onKeyDown handler
      />
      <button onClick={() => getUser(inputValue)}>Find User</button>
      {userData && <User data={userData} />}
      {!userData && errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default UserPrompt;

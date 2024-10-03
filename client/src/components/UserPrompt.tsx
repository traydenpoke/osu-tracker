import { useState } from 'react';
import User from './User';

const UserPrompt = () => {
  const [inputValue, setInputValue] = useState('');
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function test(value: string): Promise<void> {
    try {
      const response = await fetch(`http://localhost:5000/user/${value}`);
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
      test(inputValue); // Call the test function on Enter key press
    }
  };

  return (
    <div>
      <h1>Hi</h1>
      <input
        type='text'
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown} // Add the onKeyDown handler
      ></input>
      <button onClick={() => test(inputValue)}>Submit</button>
      {userData && <User data={userData} />}
      {!userData && errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default UserPrompt;

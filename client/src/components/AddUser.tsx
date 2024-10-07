import { useState } from 'react';
import { userDB } from '../types';

interface AddUserProps {
	setDatabaseUsers: React.Dispatch<React.SetStateAction<userDB[]>>;
	databaseUsers: userDB[];
}

const AddUser: React.FC<AddUserProps> = ({
	setDatabaseUsers,
	databaseUsers,
}) => {
	const [inputValue, setInputValue] = useState('');

	async function addUser(value: string) {
		if (databaseUsers.some((obj) => obj.id === value)) {
			console.log('User already in DB');
			return;
		}

		try {
			const user = await getUser(value);
			const response = await fetch(`http://localhost:5000/users`, {
				method: 'POST',
				body: JSON.stringify({ user }),
				headers: { 'Content-Type': 'application/json' },
			});

			const newUser = await response.json();
			setDatabaseUsers([...databaseUsers, newUser]);
			setInputValue('');
		} catch (err) {
			console.log(
				err instanceof Error ? err.message : 'An error occurred'
			);
		}
	}

	async function getUser(value: string) {
		try {
			const response = await fetch(
				`http://localhost:5000/users/${value}`
			);
			if (!response.ok) {
				throw new Error('User not found.');
			}
			return await response.json();
		} catch (err) {
			throw new Error('User not found.');
		}
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
			<button onClick={() => console.log(databaseUsers)}>
				Log Users
			</button>
		</div>
	);
};

export default AddUser;

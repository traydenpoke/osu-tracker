import { useEffect, useState } from 'react';

const DisplayUsers = () => {
	const [usersDB, setUsersDB] = useState([]);

	async function getUsers(): Promise<void> {
		if (usersDB.length !== 0) return;

		// users in db
		const response = await fetch(
			`http://localhost:5000/users/leaderboard/100`
		);

		const users = await response.json();
		setUsersDB(users);
		console.log(users);
	}

	useEffect(() => {
		getUsers();
	}, []);

	return <div></div>;
};

export default DisplayUsers;

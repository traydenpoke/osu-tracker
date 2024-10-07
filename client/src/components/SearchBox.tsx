import { useState } from 'react';
import { userDB } from '../types';

interface SearchBoxProps {
	databaseUsers: userDB[];
}

const SearchBox: React.FC<SearchBoxProps> = ({ databaseUsers }) => {
	const [searchValue, setSearchValue] = useState('');

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const filteredUsers = databaseUsers.filter((user) =>
		user.username.toLowerCase().includes(searchValue.toLowerCase())
	);

	return (
		<div>
			<input
				type='text'
				placeholder='Search by username...'
				value={searchValue}
				onChange={handleInputChange}
			/>
			<ul>
				{searchValue &&
					filteredUsers.map((user) => (
						<li key={user.id}>{user.username}</li>
					))}
			</ul>
		</div>
	);
};

export default SearchBox;

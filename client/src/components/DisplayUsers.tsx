import { userDB } from '../types';

interface AddUserProps {
	databaseUsers: userDB[];
}

const DisplayUsers: React.FC<AddUserProps> = ({ databaseUsers }) => {
	return <div></div>;
};

export default DisplayUsers;

import { userObject } from '../../../shared/types/UserObject';
import '../styles/User.css';

const User: React.FC<{ data: userObject }> = ({ data }) => {
  if (!data) return null;

  return (
    <div className='user'>
      <p>
        <strong>Username:</strong> {data.username}
      </p>
      <p>
        <strong>ID:</strong> {data.id}
      </p>
      <p>
        <strong>pp:</strong> {data.pp}
      </p>
      <p>
        <a href={`https://osu.ppy.sh/users/${data.id}`} target='_blank'>
          Profile
        </a>
      </p>
    </div>
  );
};

export default User;

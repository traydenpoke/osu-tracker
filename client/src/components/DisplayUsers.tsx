import { useState } from 'react';
import { userDB } from '../types';

interface AddUserProps {
  databaseUsers: userDB[];
}

const DisplayUsers: React.FC<AddUserProps> = ({ databaseUsers }) => {
  console.log(databaseUsers);

  return <div></div>;
};

export default DisplayUsers;

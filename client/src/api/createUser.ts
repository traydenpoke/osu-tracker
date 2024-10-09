import { getUser } from './getUser';

export async function createUser(value: string): Promise<any> {
  const user = await getUser(value);

  if (user === null) {
    return null;
  }

  const response = await fetch(`http://localhost:5000/users`, {
    method: 'POST',
    body: JSON.stringify({ user }),
    headers: { 'Content-Type': 'application/json' },
  });

  return await response.json();
}

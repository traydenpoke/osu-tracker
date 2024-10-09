export async function getUser(value: string): Promise<any> {
  try {
    const response = await fetch(`http://localhost:5000/users/${value}`);
    if (!response.ok) {
      throw new Error('User not found.');
    }
    return await response.json();
  } catch (err) {
    return null;
  }
}

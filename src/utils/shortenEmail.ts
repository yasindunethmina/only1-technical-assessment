export const shortenEmail = (email?: string, usernameLength: number = 5) => {
  if (!email) {
    return '';
  }

  const [username, domain] = email.split('@');
  const shortenedUsername =
    username.length > usernameLength
      ? `${username.slice(0, usernameLength)}...`
      : username;
  return `${shortenedUsername}@${domain}`;
};

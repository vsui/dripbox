const login = async (username, password) => {
  const res = await fetch('http://localhost:3001/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (res.status !== 200) {
    return Promise.reject(new Error('Could not login'));
  }
  const { token } = await res.json();
  return token;
};

const register = async (username, password) => {
  const res = await fetch('http://localhost:3001/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  });
  if (res.status !== 200) {
    return Promise.reject(new Error('Could not register'));
  }
  const { token } = await res.json();
  return token;
};

export {
  login,
  register,
};

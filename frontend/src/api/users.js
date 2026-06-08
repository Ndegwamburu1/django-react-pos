const USERS_API = 'http://127.0.0.1:8000/api/users/'

export function getUsers() {
  return fetch(USERS_API).then((response) => {
    if (!response.ok) {
      throw new Error('Users could not be loaded')
    }

    return response.json()
  })
}

export function createUser(userForm) {
  return fetch(USERS_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userForm),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('User could not be saved')
    }

    return response.json()
  })
}
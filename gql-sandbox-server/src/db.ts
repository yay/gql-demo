// In-memory "database".

import { faker } from '@faker-js/faker';

export type DB = {
  users: User[];
};

const db: DB = {
  users: Array.from({ length: 4 }).map(() => createRandomUser()),
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export function createUser(params: Omit<User, 'id'>): User {
  const { email, firstName, lastName } = params;
  if (db.users.find((u) => u.email === email)) {
    throw new Error(`User with email ${email} already exists!`);
  }
  const user: User = {
    id: faker.string.uuid(),
    email,
    firstName,
    lastName,
  };
  db.users.push(user);
  return user;
}

export function deleteUser(id: string): string | null {
  const index = db.users.findIndex((u) => u.id === id);
  if (index >= 0) {
    db.users.splice(index, 1);
    return id;
  }
  return null;
}

export function updateUser(params: {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
}): User | null {
  const user = db.users.find((u) => u.id === params.id);
  if (user) {
    if (params.firstName) {
      user.firstName = params.firstName;
    }
    if (params.lastName) {
      user.lastName = params.lastName;
    }
    return user;
  }
  return null;
}

export function getUsers() {
  return db.users;
}

export function createRandomUser(): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
}

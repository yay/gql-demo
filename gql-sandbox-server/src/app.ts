import * as dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { hash } from './hash';
import { readFileSync } from 'fs';
import { Resolvers } from './generated/graphql';
import { createUser, deleteUser, getUsers, updateUser } from './db';

dotenv.config();

// https://www.apollographql.com/docs/apollo-server/performance/caching/
const createDog = (breed: string, subbreeds: string[]) => ({
  breed,
  id: hash(breed),
  subbreeds: subbreeds.length > 0 ? subbreeds : null,
});

const API = 'https://dog.ceo/api';

const resolvers: Resolvers = {
  Query: {
    users: async () => {
      return getUsers();
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const { email, firstName, lastName } = args.input;
      return createUser({ email, firstName, lastName });
    },
    deleteUser: async (parent, args) => {
      const { id } = args;
      return deleteUser(id);
    },
    updateUser: async (parent, args) => {
      const { input } = args;
      return updateUser(input);
    },
  },
};

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

// https://www.apollographql.com/docs/apollo-server/data/context/
export interface SandboxContext {
  authScope?: string;
}

const server = new ApolloServer<SandboxContext>({
  typeDefs,
  resolvers,
  introspection: true,
});

// Start an Express app with ApolloServer middleware:
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => ({
    authScope: req.headers.authorization,
  }),
});

console.log(`🚀  Server ready at: ${url}`);

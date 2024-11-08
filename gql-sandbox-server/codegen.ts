import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'schema.graphql',
  generates: {
    'src/generated/graphql.ts': {
      config: {
        contextType: '../app#SandboxContext',
      },
      plugins: ['typescript', 'typescript-resolvers'],
    },
    './graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;

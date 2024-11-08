import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { ApolloClient, InMemoryCache, ApolloProvider, Resolvers, gql } from '@apollo/client';
import { DesignProvider } from './Theme';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import GraphQLPage from './gql';
import { AppLayout } from './AppLayout';
import { clientCache } from './client-cache';

const defaultResolver: Resolvers = {
  Query: {
    // uiMode(parent, args, { clientCache }) {
    //   clientCache.readQuery({
    //     query: gql`
    //       query getUiMode {
    //         uiMode @client
    //       }
    //     `,
    //     // variables: {
    //     //   messageId: parent.id,
    //     // },
    //   });
    // },
    // user: {
    //   messages: {
    //     isOpen: (parent, args, { clientCache }) => {
    //       // reference the clientCache to get your data return
    //       clientCache.readQuery({
    //         query: MESSAGE_IS_OPEN_QUERY,
    //         variables: {
    //           messageId: parent.id,
    //         },
    //       });
    //     },
    //   },
    // },
  },
};

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: clientCache,
  devtools: {
    enabled: true,
  },
  // typeDefs: clientSchema,
  // resolvers: defaultResolver,
});

const routes = [
  {
    name: 'GraphQL',
    path: '/gql',
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout routes={routes} />,
    children: [
      {
        path: 'gql',
        element: <GraphQLPage />,
      },
    ],
  },
]);

function Root(props: React.PropsWithChildren<{ strict?: boolean }>) {
  const { strict, children } = props;
  return strict ? <React.StrictMode>{children}</React.StrictMode> : children;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Root strict>
    <DesignProvider>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </DesignProvider>
  </Root>
);

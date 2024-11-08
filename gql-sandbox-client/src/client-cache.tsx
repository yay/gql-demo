import { InMemoryCache, makeVar, ReactiveVar } from '@apollo/client';
import { UiMode } from './generated/graphql';

export const clientCache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        uiMode: {
          read() {
            return uiModeVar();
          },
        },
      },
    },
  },
});

export const uiModeVar: ReactiveVar<UiMode> = makeVar<UiMode>(UiMode.Light);

import React, { FC, useState, useEffect } from 'react';

type UseLoadingResult = {
  loading: boolean;
  data?: string;
  error?: string;
};

const useLoading = (): UseLoadingResult => {
  const [data, setData] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const promise = new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() >= 0.5) {
          resolve('Data loaded');
        } else {
          reject('Data loading failed');
        }
      }, 1000 + Math.random() * 1000);
    });
    promise
      .then((result) => {
        setData(result);
      })
      .catch((reason: string) => {
        setError(reason);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    data,
    error,
    loading,
  };
};

// Potential interview question for a junior/mid-level candidate.
// Implement the `useLoading` hook (similar to `useQuery` hook in GraphQL) that:
// - takes 1 to 2 seconds to complete
// - returns `true` for `loading` state while loading is in progress
// - returns `false` when loading is complete
// - succeeds returning data (of type string) half the time (undefined otherwise)
// - fails and returns the error (of type string) half the time (undefined otherwise)

export const Loading: FC = () => {
  const { data, error, loading } = useLoading();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!data) {
    return <p>No data</p>;
  }

  return <p>{data}</p>;
};

import React, { Suspense, useCallback } from 'react';
import { gql } from '@apollo/client';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersSuspenseQuery,
  useUpdateUserMutation,
} from '../generated/graphql';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Button, Typography, useTheme } from '@mui/material';
import { faker } from '@faker-js/faker';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import UpdateIcon from '@mui/icons-material/ChangeCircle';
import Box from '@mui/material/Box';
import { uiModeVar } from '../client-cache';

export default function Page() {
  const theme = useTheme();

  const [createUser] = useCreateUserMutation({
    update: (cache, { data }) => {
      if (!data) return;
      cache.modify({
        fields: {
          users(existingUsers = []) {
            const newUserRef = cache.writeFragment({
              data: data.createUser,
              fragment: gql`
                fragment NewUser on User {
                  id
                  email
                  firstName
                  lastName
                }
              `,
            });
            return [...existingUsers, newUserRef];
          },
        },
      });
    },
    // refetchQueries: ['getUsers'],
  });

  const [updateUser] = useUpdateUserMutation();

  const [deleteUser] = useDeleteUserMutation({
    update(cache, { data }) {
      const id = data?.deleteUser;
      if (!id) return;
      const normalizedId = cache.identify({ id, __typename: 'User' });
      cache.evict({ id: normalizedId });
      cache.gc();
    },
  });

  const { data: userData } = useGetUsersSuspenseQuery();
  const users = userData?.users;

  const handleCreateUserClick = useCallback(async () => {
    try {
      const { data } = await createUser({
        variables: {
          input: createRandomUser(),
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, [createUser]);

  const handleUpdateUserClick = async (id: string) => {
    try {
      const { data } = await updateUser({
        variables: {
          input: {
            id,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
          },
        },
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUserClick = async (id: string) => {
    try {
      const { data } = await deleteUser({
        variables: {
          id,
        },
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!users) {
    return 'No users';
  }

  return (
    <Suspense>
      <List>
        {users.map((user) => {
          return (
            <ListItem
              key={user.email}
              sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="update" onClick={(event) => handleUpdateUserClick(user.id)}>
                    <UpdateIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={(event) => handleDeleteUserClick(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemText>
                <Typography variant="h6" component="p">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body1" component="p">
                  {user.email}
                </Typography>
              </ListItemText>
            </ListItem>
          );
        })}
      </List>
      <Box paddingX={1}>
        <Button variant={'contained'} onClick={handleCreateUserClick}>
          Create user
        </Button>
      </Box>
    </Suspense>
  );
}

export function createRandomUser() {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
}

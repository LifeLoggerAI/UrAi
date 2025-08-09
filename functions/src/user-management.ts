import { onUserCreated, onUserDeleted, UserRecord } from 'firebase-functions/v2/auth';

export const handleUserCreate = onUserCreated(async (event) => {
  const user: UserRecord = event.data;
  // ...
});

export const handleUserDelete = onUserDeleted(async (event) => {
  const user: UserRecord = event.data;
  // ...
});
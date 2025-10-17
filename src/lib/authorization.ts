import { type User } from '@/types/api';

export enum ROLES {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type Role = keyof typeof ROLES;

export const POLICIES = {
  'comment:delete': (user: User, comment: { authorId: string }) => {
    if (user.role === ROLES.ADMIN) {
      return true;
    }
    return user.id === comment.authorId;
  },
  'discussion:delete': (user: User, discussion: { authorId: string }) => {
    if (user.role === ROLES.ADMIN) {
      return true;
    }
    return user.id === discussion.authorId;
  },
  'user:delete': (user: User) => {
    return user.role === ROLES.ADMIN;
  },
};

export const useAuthorization = () => {
  const checkAccess = ({ allowedRoles }: { allowedRoles: Role[] }) => {
    // TODO: Implement actual role checking with user from auth context
    return true;
  };

  return { checkAccess, role: ROLES.USER };
};

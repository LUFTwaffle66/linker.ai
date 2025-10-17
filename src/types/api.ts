export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  role: string;
  bio?: string;
  teamId: string;
}

export interface Discussion extends BaseEntity {
  title: string;
  body: string;
  authorId: string;
  teamId: string;
}

export interface Comment extends BaseEntity {
  body: string;
  authorId: string;
  discussionId: string;
}

export interface Team extends BaseEntity {
  name: string;
  description?: string;
}

export interface Meta {
  page: number;
  totalPages: number;
  total: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: Meta;
}

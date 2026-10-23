export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  author: User;
  contributors: Contributor[];
  commentsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SharedStory {
  id: number;
  title: string;
  content: string;
  author: Pick<User, 'id' | 'name'>;
  createdAt: string;
  updatedAt: string;
}

export interface Contributor extends User {
  contributorId: number;
}

export interface StoryComment {
  id: number;
  storyId: number;
  body: string;
  author: User;
  createdAt: string;
  reactions: CommentReaction[];
}

export interface CommentReaction {
  reaction: string;
  count: number;
  reacted: boolean;
}

export interface StoryVersion {
  id: number;
  storyId: number;
  title: string;
  content: string;
  editor: User;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface ApiError {
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Story {
  id: number;
  title: string;
  content: string;
  author: User;
  contributors: Contributor[];
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

import React from "react";

export type IContextType = {
  user: IUser,
  isLoading: boolean,
  setUser: React.Dispatch<React.SetStateAction<IUser>>,
  isAuthenticated: boolean,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
  checkIsUserAuthenticated: () => Promise<boolean>
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  email: string;
  imageUrl: string;
};

export type INewUser = {
  email: string;
  password: string;
};
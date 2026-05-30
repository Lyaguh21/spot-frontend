enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export interface IUserState {
  id: number;
  name: string;
  email: string;
  username: string;
  avatarUrl: string;
  bio: string;
  visibility: Visibility;
  createdAt: string;
}

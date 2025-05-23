export interface IUserType {
  id: string;
  name: string;
  balance: number;
  profile: unknown;
  posts: unknown[];
  userSubscribedTo: IUserType[];
  subscribedToUser: IUserType[];
}
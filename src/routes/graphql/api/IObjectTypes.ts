export interface IUserType {
  id: string;
  name: string;
  balance: number;
  profile: IProfile;
  posts: unknown[];
  userSubscribedTo: IUserType[];
  subscribedToUser: IUserType[];
}

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberType: IMemberType;
}

export interface IMemberType {
  id: MemberTypeId;
  discount: number;
  postsLimitPerMonth: number;
}

export enum MemberTypeId {
  BASIC,
  BUSINESS,
}

export interface IPost {
  id: string;
  title: string;
  content: string;
}

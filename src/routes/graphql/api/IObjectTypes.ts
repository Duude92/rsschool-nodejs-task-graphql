export interface IUserType {
  id: string;
  name: string;
  balance: number;
  profile?: IProfile;
  posts?: IPost[];
  userSubscribedTo?: ISubscriber[];
  subscribedToUser?: ISubscriber[];
}

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberType?: IMemberType;
  memberTypeId: string;
}

export interface IMemberType {
  id: string; // MemberTypeId
  discount: number;
  postsLimitPerMonth: number;
}

export enum MemberTypeId {
  BASIC = 'BASIC',
  BUSINESS = 'BUSINESS',
}

export interface IPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
}

export interface ISubscriber {
  authorId: string;
  author?: IUserType;
  subscriberId: string;
  subscriber: IUserType;
}

export interface ICreatePostInput {
  title: string;
  content: string;
  authorId: string;
}

export interface IChangePostInput {
  title: string;
  content: string;
}

export interface ICreateProfileInput {
  isMale: boolean;
  yearOfBirth: number;
  userId: string;
  memberTypeId: string;
}

export interface IChangeProfileInput {
  isMale: boolean;
  yearOfBirth: number;
  memberTypeId: string;
}

export interface ICreateUserInput {
  name: string;
  balance: number;
}

export interface IChangeUserInput {
  name: string;
  balance: number;
}

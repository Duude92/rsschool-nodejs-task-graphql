export interface IUserType {
  id: string;
  name: string;
  balance: number;
  profile?: IProfile;
  posts?: unknown[];
  userSubscribedTo?: ISubscriber[];
  subscribedToUser?: ISubscriber[];
}

export interface IProfile {
  id: string;
  isMale: boolean;
  yearOfBirth: number;
  memberType: IMemberType;
  userId: string;
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
export interface ISubscriber{
    authorId:string;
    author?:IUserType;
    subscriberId:string;
    subscriber:IUserType;
}
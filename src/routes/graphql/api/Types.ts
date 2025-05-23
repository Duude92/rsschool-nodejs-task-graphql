import { GraphQLFieldConfig, GraphQLFieldResolver } from 'graphql/type/index.js';
import { IMemberType, IPost, IProfile, IUserType } from './IObjectTypes.js';
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export type FieldBase<TSource,TResult> = Omit<GraphQLFieldConfig<TSource, Context, Record<string, string>>,'resolve' > &  {resolve: GraphQLFieldResolver<TSource, Context, Record<string, string>, Promise<TResult>>};
export type Context = {
  prisma: PrismaClient;
  loaders: {
    postLoader: PostLoaderType;
    profileLoader: ProfileLoaderType;
    memberLoader: MemberLoaderType;
    userLoader: UserLoaderType;
  };
};
export type PostLoaderType = DataLoader<unknown, Promise<IPost[]>, unknown>;
export type ProfileLoaderType = DataLoader<unknown, Promise<IProfile[]>, unknown>;
export type MemberLoaderType = DataLoader<unknown, Promise<IMemberType[]>, unknown>;
export type UserLoaderType = DataLoader<unknown, Promise<IUserType[]>, unknown>;

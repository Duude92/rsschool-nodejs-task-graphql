import { GraphQLFieldConfig, GraphQLResolveInfo } from 'graphql/type/index.js';
import { IMemberType, IPost, IProfile, IUserType } from './IObjectTypes.js';
import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

export type FieldBase<TSource, TResult, TArgs = Record<string, string>> = Omit<
  GraphQLFieldConfig<TSource, Context, TArgs>,
  'resolve'
> & {
  resolve: (
    source: TSource,
    args: TArgs,
    context: Context,
    info: GraphQLResolveInfo,
  ) => Promise<TResult> | TResult;
};
export type Context = {
  prisma: PrismaClient;
  loaders: {
    postLoader: PostLoaderType;
    profileLoader: ProfileLoaderType;
    memberLoader: MemberLoaderType;
    userLoader: UserLoaderType;
  };
};
export type PostLoaderType = DataLoader<string, Promise<IPost[]>>;
export type ProfileLoaderType = DataLoader<string, Promise<IProfile[]>>;
export type MemberLoaderType = DataLoader<string, Promise<IMemberType[]>>;
export type UserLoaderType = DataLoader<string, Promise<IUserType[]>>;

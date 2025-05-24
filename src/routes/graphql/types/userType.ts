import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
  GraphQLString,
} from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profileType.js';
import { PostType } from './postType.js';
import { extractFields } from '../api/extractFields.js';
import { IPost, IProfile, ISubscriber, IUserType } from '../api/IObjectTypes.js';
import { Context, FieldBase } from '../api/Types.js';

function findUnavailableKey(resultUser: IUserType, fields: Record<string, string>) {
  const objectKeys = Object.keys(resultUser);
  const requiredKeys = Object.keys(fields);
  const notFoundKey = requiredKeys.find((oKey) => !objectKeys.includes(oKey));
  return { requiredKeys, notFoundKey };
}

async function requestUserWithKeys(
  context: Context,
  user: IUserType,
  requiredKeys: string[],
) {
  const newResult = (await context.prisma.user.findUnique({
    where: { id: user.id },
    select: Object.fromEntries(requiredKeys.map((key) => [key, true])),
  })) as unknown as IUserType;
  return newResult;
}

async function reloadDataWithSelectedFields(
  info: GraphQLResolveInfo,
  result: IUserType[],
  context: Context,
) {
  const fields = extractFields(info, UserType);
  const flatResult = result.flat();
  for (const resultUser of flatResult) {
    const { requiredKeys, notFoundKey } = findUnavailableKey(resultUser, fields);
    if (notFoundKey) {
      const newResult = await requestUserWithKeys(context, resultUser, requiredKeys);
      const idx = flatResult.findIndex((fUser) => fUser === resultUser);
      flatResult[idx] = newResult;
    }
  }
  return flatResult;
}

export const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    profile: {
      type: ProfileType,
      resolve: async (user, b, context) =>
        (await context.loaders.profileLoader.load(user.id)).pop(),
    } as FieldBase<IUserType, IProfile>,
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (user, b, context) => {
        const result = await context.loaders.postLoader.load(user.id);
        return result;
      },
    } as FieldBase<IUserType, IPost[]>,
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user: IUserType, _, context, info) => {
        const subscriptions = user.userSubscribedTo!.map((subs) => subs.authorId);
        const result = (await context.loaders.userLoader.loadMany(
          subscriptions.length > 0 ? subscriptions : [],
        )) as unknown as IUserType[];
        const flatResult = await reloadDataWithSelectedFields(info, result, context);
        return flatResult;
      },
    } as FieldBase<IUserType, IUserType[]>,
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user, b, context, info) => {
        const subscriptions = user.subscribedToUser!.map((subs) => subs.subscriberId);
        const result = (await context.loaders.userLoader.loadMany(
          subscriptions.length > 0 ? subscriptions : [],
        )) as unknown as IUserType[];
        const flatResult = await reloadDataWithSelectedFields(info, result, context);
        return flatResult;
      },
    } as FieldBase<IUserType, IUserType[]>,
  }),
});
export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});
export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

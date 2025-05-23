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
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const extractFields = (info: GraphQLResolveInfo) => {
  const parsedResolveInfoFragment = parseResolveInfo(info);
  const { fields }: { fields: Record<string, string> } =
    simplifyParsedResolveInfoFragmentWithType(
      parsedResolveInfoFragment as ResolveTree,
      UserType,
    );
  return fields;
};

function findUnavailableKey(resultUser: IUserType, fields: Record<string, string>) {
  const objectKeys = Object.keys(resultUser);
  const requiredKeys = Object.keys(fields);
  const notFoundKey = objectKeys.find((oKey) => !requiredKeys.includes(oKey));
  return { requiredKeys, notFoundKey };
}

async function requestUserWithKeys(context, user: IUserType, requiredKeys: string[]) {
  const newResult = (await context.prisma.User.findUnique({
    where: { id: user.id },
    select: Object.fromEntries(requiredKeys.map((key) => [key, true])),
  })) as IUserType;
  return newResult;
}

async function reloadDataWithSelectedFields(
  info,
  result: IUserType[],
  context,
  user: IUserType,
) {
  const fields = extractFields(info);
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

export const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: (): any => ({
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
      resolve: async (user: { id: typeof UUIDType }, b, context) =>
        (await context.loaders.profileLoader.load(user.id)).pop(),
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (user: { id: typeof UUIDType }, b, context) => {
        const result = await context.loaders.postLoader.load(user.id);
        return result;
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user: IUserType, _, context, info) => {
        const subscriptions = user.userSubscribedTo.map((subs: any) => subs.authorId);
        const result: IUserType[] = await context.loaders.userLoader.loadMany(
          subscriptions.length > 0 ? subscriptions : [],
        );
        const flatResult = await reloadDataWithSelectedFields(
          info,
          result,
          context,
          user,
        );
        return flatResult;
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user: IUserType, b, context, info) => {
        const subscriptions = user.subscribedToUser.map((subs: any) => subs.subscriberId);
        const result: IUserType[] = await context.loaders.userLoader.loadMany(
          subscriptions.length > 0 ? subscriptions : [],
        );
        const flatResult = await reloadDataWithSelectedFields(
          info,
          result,
          context,
          user,
        );
        return flatResult;
      },
    },
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

export interface IUserType {
  id: string;
  name: string;
  balance: number;
  profile: unknown;
  posts: unknown[];
  userSubscribedTo: IUserType[];
  subscribedToUser: IUserType[];
}

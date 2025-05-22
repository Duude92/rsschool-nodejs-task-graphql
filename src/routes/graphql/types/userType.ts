import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { UUIDType } from './uuid.js';
import { ProfileType } from './profileType.js';
import { PostType } from './postType.js';

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
      resolve: async (user: { id: string; userSubscribedTo: unknown[] }, b, context) => {
        const result = await context.loaders.userLoader.loadMany(
          user.userSubscribedTo.map((subs: any) => subs.authorId),
        );
        return result.flat();
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (user: { id: string; subscribedToUser: unknown[] }, b, context) => {
        const subscriptions = user.subscribedToUser.map((subs: any) => subs.subscriberId);
        const result = (await context.loaders.userLoader.loadMany(
          subscriptions.length > 0 ? subscriptions : [],
        )) as unknown[][];
        return result.flat();
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

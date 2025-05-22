import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { UserType } from '../types/userType.js';
import { UUIDType } from '../types/uuid.js';

export const usersQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: async (_, __, context) => {
    const result = await context.prisma.User.findMany({
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
        profile: true,
      },
    });
    result.forEach((user) => {
      context.loaders.userLoader.prime(user.id, new Promise(resolve => resolve(user)));
    })
    return result;
  },
};
export const userQuery = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: typeof UUIDType }, context) =>
    await context.prisma.User.findUnique({
      where: { id: id },
      include: {
        userSubscribedTo: true,
        subscribedToUser: true,
        profile: true,
      },
    }),
};

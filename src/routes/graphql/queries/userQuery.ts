import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { UserType } from '../types/userType.js';
import { UUIDType } from '../types/uuid.js';

export const usersQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: async (_, __, prisma) =>
    await prisma.User.findMany({
      include: {
        // userSubscribedTo: true,
        // subscribedToUser : true
      },
    }),
};
export const userQuery = {
  type: new GraphQLNonNull(UserType),
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: typeof UUIDType }, prisma) =>
    await getUser(id, prisma),
};
export const getUser = async (id, context): typeof UserType =>
  (await context.User.findUnique({ where: { id: id } })) as typeof UserType;

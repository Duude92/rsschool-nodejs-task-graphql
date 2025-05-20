import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { UserType } from '../types/userType.js';
import { UUIDType } from '../types/uuid.js';

export const usersQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: async (_, __, prisma) => await prisma.User.findMany({}),
};
export const userQuery = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: typeof UUIDType }, prisma) =>
    await prisma.User.findUnique({ where: { id: id } }),
};

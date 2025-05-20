import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { UserType } from '../types/userType.js';

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

import { CreateUserInput, UserType } from '../types/userType.js';
import { GraphQLNonNull } from 'graphql/type/index.js';

export const createUser = {
  type: new GraphQLNonNull(UserType),
  args: {
    dto: { type: new GraphQLNonNull(CreateUserInput) },
  },
  resolve: async (a, { dto }, context) => await context.User.create({ data: dto }),
};

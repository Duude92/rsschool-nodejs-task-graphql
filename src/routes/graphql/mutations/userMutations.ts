import { ChangeUserInput, CreateUserInput, UserType } from '../types/userType.js';
import { GraphQLNonNull } from 'graphql/type/index.js';
import { UUIDType } from '../types/uuid.js';

export const createUser = {
  type: new GraphQLNonNull(UserType),
  args: {
    dto: { type: new GraphQLNonNull(CreateUserInput) },
  },
  resolve: async (a, { dto }, context) => await context.User.create({ data: dto }),
};
export const changeUser = {
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInput) },
  },
  resolve: async (a, { id, dto }, context) =>
    await context.User.update({
      where: { id: id },
      data: dto,
    }),
};

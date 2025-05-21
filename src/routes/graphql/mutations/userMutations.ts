import { ChangeUserInput, CreateUserInput, UserType } from '../types/userType.js';
import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { UUIDType } from '../types/uuid.js';
import { context } from 'tap';

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
export const deleteUser = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (a, { id }, context) => {
    const result = await context.User.delete({ where: { id: id } });
    return id;
  },
};
export const subscribeTo = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (a, { userId, authorId }, context) => {
    const user = await context.User.findUnique({
      where: { id: userId },
    });
    const author = await context.User.findUnique({
      where: { id: authorId },
    });
    await context.SubscribersOnAuthors.create({
      data: {
        subscriberId: user.id,
        authorId: author.id,
      },
    });
    return author.name;
  },
};
export const unsubscribeFrom = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (a, { userId, authorId }, context) => {
    await context.SubscribersOnAuthors.delete({
      where: { subscriberId: userId, authorId: authorId },
    });
    return userId;
  },
};

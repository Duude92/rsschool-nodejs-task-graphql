import { ChangeUserInput, CreateUserInput, UserType } from '../types/userType.js';
import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { UUIDType } from '../types/uuid.js';
import { context } from 'tap';

export const createUser = {
  type: new GraphQLNonNull(UserType),
  args: {
    dto: { type: new GraphQLNonNull(CreateUserInput) },
  },
  resolve: async (a, { dto }, { prisma }) => await prisma.User.create({ data: dto }),
};
export const changeUser = {
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInput) },
  },
  resolve: async (a, { id, dto }, { prisma }) =>
    await prisma.User.update({
      where: { id: id },
      data: dto,
    }),
};
export const deleteUser = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (a, { id }, { prisma }) => {
    const result = await prisma.User.delete({ where: { id: id } });
    return id;
  },
};
export const subscribeTo = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (a, { userId, authorId }, { prisma }) => {
    const user = await prisma.User.findUnique({
      where: { id: userId },
    });
    const author = await prisma.User.findUnique({
      where: { id: authorId },
    });
    await prisma.SubscribersOnAuthors.create({
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
  resolve: async (a, { userId, authorId }, { prisma }) => {
    await prisma.SubscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: userId,
          authorId: authorId,
        },
      },
    });
    return userId;
  },
};

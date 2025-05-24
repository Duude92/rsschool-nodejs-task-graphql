import { ChangeUserInput, CreateUserInput, UserType } from '../types/userType.js';
import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { UUIDType } from '../types/uuid.js';
import { FieldBase } from '../api/Types.js';
import { IChangeUserInput, ICreateUserInput, IUserType } from '../api/IObjectTypes.js';

export const createUser: FieldBase<
  unknown,
  Promise<IUserType>,
  { dto: ICreateUserInput }
> = {
  type: new GraphQLNonNull(UserType),
  args: {
    dto: { type: new GraphQLNonNull(CreateUserInput) },
  },
  resolve: async (_, { dto }, { prisma }) => await prisma.user.create({ data: dto }),
};
export const changeUser: FieldBase<
  unknown,
  Promise<IUserType>,
  { id: string; dto: IChangeUserInput }
> = {
  type: new GraphQLNonNull(UserType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInput) },
  },
  resolve: async (_, { id, dto }, { prisma }) =>
    await prisma.user.update({
      where: { id: id },
      data: dto,
    }),
};
export const deleteUser: FieldBase<unknown, string, { id: string }> = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { id }, { prisma }) => {
    const result = await prisma.user.delete({ where: { id: id } });
    return result ? id : 'Error';
  },
};
export const subscribeTo: FieldBase<
  unknown,
  string,
  { userId: string; authorId: string }
> = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { userId, authorId }, { prisma }) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const author = await prisma.user.findUnique({
      where: { id: authorId },
    });
    await prisma.subscribersOnAuthors.create({
      data: {
        subscriberId: user!.id,
        authorId: author!.id,
      },
    });
    return author!.name;
  },
};
export const unsubscribeFrom: FieldBase<
  unknown,
  string,
  { userId: string; authorId: string }
> = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { userId, authorId }, { prisma }) => {
    await prisma.subscribersOnAuthors.delete({
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

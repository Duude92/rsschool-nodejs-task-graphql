import { GraphQLList, GraphQLNonNull, GraphQLResolveInfo } from 'graphql/type/index.js';
import { UserType } from '../types/userType.js';
import { UUIDType } from '../types/uuid.js';
import { extractFields } from '../api/extractFields.js';
import { FieldBase } from '../api/Types.js';
import { IUserType } from '../api/IObjectTypes.js';

export const usersQuery: FieldBase<IUserType, IUserType[]> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: async (_, __, context, info: GraphQLResolveInfo) => {
    const fields = extractFields(info, UserType);
    const result = (
      await context.prisma.user.findMany({
        include: {
          userSubscribedTo: !!fields.userSubscribedTo,
          subscribedToUser: !!fields.subscribedToUser,
          profile: !!fields.profile,
        },
      })
    ).map((res) => res as unknown as IUserType);

    result.forEach((user) => {
      context.loaders.userLoader.prime(
        user.id,
        new Promise((resolve) => resolve([user])) as unknown as Promise<IUserType[]>,
      );
    });
    return result;
  },
};
export const userQuery: FieldBase<IUserType, IUserType> = {
  type: UserType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }, context, info: GraphQLResolveInfo) => {
    const fields = extractFields(info, UserType);
    return (await context.prisma.user.findUnique({
      where: { id: id },
      include: {
        userSubscribedTo: !!fields.userSubscribedTo,
        subscribedToUser: !!fields.subscribedToUser,
        profile: !!fields.profile,
      },
    })) as unknown as IUserType;
  },
};

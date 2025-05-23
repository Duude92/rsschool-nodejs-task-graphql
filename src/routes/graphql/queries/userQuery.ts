import { GraphQLList, GraphQLNonNull, GraphQLResolveInfo } from 'graphql/type/index.js';
import { IUserType, UserType } from '../types/userType.js';
import { UUIDType } from '../types/uuid.js';
import { extractFields } from '../api/extractFields.js';

export const usersQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
  resolve: async (_, __, context, info: GraphQLResolveInfo) => {
    const fields = extractFields(info, UserType);
    const result = await context.prisma.User.findMany({
      include: {
        userSubscribedTo: !!fields.userSubscribedTo,
        subscribedToUser: !!fields.subscribedToUser,
        profile: !!fields.profile,
      },
    });
    result.forEach((user) => {
      context.loaders.userLoader.prime(user.id, new Promise((resolve) => resolve(user)));
    });
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
  resolve: async (
    _,
    { id }: { id: typeof UUIDType },
    context,
    info: GraphQLResolveInfo,
  ) => {
    const fields = extractFields(info, UserType);
    return await context.prisma.User.findUnique({
      where: { id: id },
      include: {
        userSubscribedTo: !!fields.userSubscribedTo,
        subscribedToUser: !!fields.subscribedToUser,
        profile: !!fields.profile,
      },
    });
  },
};

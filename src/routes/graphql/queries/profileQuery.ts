import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { ProfileType } from '../types/profileType.js';
import { UUID } from 'node:crypto';
import { UUIDType } from '../types/uuid.js';
import { extractFields } from '../api/extractFields.js';

export const profileQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
  resolve: async (_, __, context, info) => {
    const fields = extractFields(info, ProfileType);
    return await context.prisma.Profile.findMany({
      include: { memberType: !!fields.memberType },
    });
  },
};
export const profileIdQuery = {
  type: ProfileType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: UUID }, context, info) => {
    const fields = extractFields(info, ProfileType);

    return await context.prisma.Profile.findUnique({
      where: { id: id },
      include: { memberType: !!fields.memberType },
    });
  },
};

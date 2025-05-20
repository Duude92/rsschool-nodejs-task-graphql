import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { ProfileType } from '../types/profileType.js';
import { UUID } from 'node:crypto';
import { UUIDType } from '../types/uuid.js';

export const profileQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
  resolve: async (_, __, prisma) =>
    await prisma.Profile.findMany({
      include: {
        memberType: true,
      },
    }),
};
export const profileIdQuery = {
  type: ProfileType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: UUID }, prisma) =>
    prisma.Profile.findUnique({ where: { id: id }, include: { memberType: true } }),
};

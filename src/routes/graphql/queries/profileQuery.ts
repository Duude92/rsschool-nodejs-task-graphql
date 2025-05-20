import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { ProfileType } from '../types/profileType.js';

export const profileQuery = {
  type: new GraphQLNonNull(new GraphQLList(ProfileType)),
  resolve: async (_, __, prisma) =>
    await prisma.Profile.findMany({
      include: {
        memberType: true,
      },
    }),
};

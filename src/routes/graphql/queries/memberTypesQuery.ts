import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { MemberType, MemberTypeId } from '../types/memberType.js';

export const memberTypesQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
  resolve: async (_, __, context) => await context.prisma.MemberType.findMany(),
};
export const memberTypeIdQuery = {
  type: MemberType,
  args: {
    id: {
      type: new GraphQLNonNull(MemberTypeId),
      description: 'MemberType identifier',
    },
  },
  resolve: async (_, { id }: { id: typeof MemberTypeId }, context) =>
    await context.prisma.MemberType.findUnique({
      where: {
        id: id,
      },
    }),
};

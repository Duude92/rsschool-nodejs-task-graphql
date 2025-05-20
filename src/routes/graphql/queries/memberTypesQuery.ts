import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { MemberType, MemberTypeId } from '../types/memberType.js';

export const memberTypesQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
  resolve: async (_, __, prisma) => await prisma.MemberType.findMany(),
};
export const memberTypeIdQuery = {
  type: MemberType,
  args: {
    id: {
      type: new GraphQLNonNull(MemberTypeId),
      description: 'MemberType identifier',
    },
  },
  resolve: async (_, { id }: { id: typeof MemberTypeId }, prisma) =>
    await prisma.MemberType.findUnique({
      where: {
        id: id,
      },
    }),
};

import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { MemberType } from '../types/memberType.js';

export const memberTypesQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
  resolve: async (_, __, prisma) => await prisma.MemberType.findMany(),
};
export const memberTypeIdQuery = {
  type: MemberType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'MemberType identifier',
    },
  },
  resolve: async (_, { id }: { id: string }, prisma) =>
    await prisma.MemberType.findUnique({
      where: {
        id: id,
      },
    }),
};

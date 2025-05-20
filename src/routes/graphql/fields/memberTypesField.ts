import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { MemberType } from '../types/memberType.js';

export const memberTypesField = {
  type: new GraphQLNonNull(new GraphQLList(MemberType)),
  resolve: async (_, __, prisma) => await prisma.MemberType.findMany(),
};
export const memberTypeIdField = {
  type: new GraphQLNonNull(MemberType),
  args: {
    id: {
      type: GraphQLString,
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

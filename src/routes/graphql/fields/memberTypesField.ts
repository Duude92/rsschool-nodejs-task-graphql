import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { MemberType } from '../types/memberType.js';

export const memberTypesField = {
  type: new GraphQLNonNull(new GraphQLList(MemberType)),
  resolve: async (input, input2, prisma) => await prisma.MemberType.findMany(),
};

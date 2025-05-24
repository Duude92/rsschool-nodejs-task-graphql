import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { MemberType, MemberTypeId } from '../types/memberType.js';
import { FieldBase } from '../api/Types.js';
import { IMemberType } from '../api/IObjectTypes.js';

export const memberTypesQuery: FieldBase<IMemberType, IMemberType[]> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
  resolve: async (_, __, context) =>
    (await context.prisma.memberType.findMany()) as IMemberType[],
};
export const memberTypeIdQuery: FieldBase<IMemberType, IMemberType> = {
  type: MemberType,
  args: {
    id: {
      type: new GraphQLNonNull(MemberTypeId),
      description: 'MemberType identifier',
    },
  },
  resolve: async (_, { id }, context) =>
    (await context.prisma.memberType.findUnique({
      where: {
        id: id,
      },
    })) as IMemberType,
};

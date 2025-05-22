import {
  ChangeProfileInput,
  CreateProfileInput,
  ProfileType,
} from '../types/profileType.js';
import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { UUIDType } from '../types/uuid.js';

export const createProfile = {
  type: new GraphQLNonNull(ProfileType),
  args: {
    dto: { type: new GraphQLNonNull(CreateProfileInput) },
  },
  resolve: async (a, { dto }, { prisma }) => prisma.Profile.create({ data: dto }),
};
export const changeProfile = {
  type: new GraphQLNonNull(ProfileType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInput) },
  },
  resolve: async (a, { id, dto }, { prisma }) =>
    prisma.Profile.update({
      where: {
        id: id,
      },
      data: dto,
    }),
};
export const deleteProfile = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (a, { id }, { prisma }) =>
    (await prisma.Profile.delete({ where: { id: id } })).toString(),
};

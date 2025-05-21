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
  resolve: async (a, { dto }, context) => context.Profile.create({ data: dto }),
};
export const changeProfile = {
  type: new GraphQLNonNull(ProfileType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInput) },
  },
  resolve: async (a, { id, dto }, context) =>
    context.Profile.update({
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
  resolve: async (a, { id }, context) => (await context.Profile.delete({ where: { id: id } })).toString(),
};

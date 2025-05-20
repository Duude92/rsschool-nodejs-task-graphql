import { CreateProfileInput, ProfileType } from '../types/profileType.js';
import { GraphQLNonNull } from 'graphql/type/index.js';

export const createProfile = {
  type: new GraphQLNonNull(ProfileType),
  args: {
    dto: { type: new GraphQLNonNull(CreateProfileInput) },
  },
  resolve: async (a, { dto }, context) => context.Profile.create({ data: dto }),
};

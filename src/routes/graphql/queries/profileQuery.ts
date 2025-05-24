import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { ProfileType } from '../types/profileType.js';
import { UUIDType } from '../types/uuid.js';
import { extractFields } from '../api/extractFields.js';
import { FieldBase } from '../api/Types.js';
import { IProfile } from '../api/IObjectTypes.js';

export const profileQuery: FieldBase<IProfile, IProfile[]> = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
  resolve: async (_, __, context, info) => {
    const fields = extractFields(info, ProfileType);
    return (await context.prisma.profile.findMany({
      include: { memberType: !!fields.memberType },
    })) as IProfile[];
  },
};
export const profileIdQuery: FieldBase<IProfile, IProfile> = {
  type: ProfileType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }, context, info) => {
    const fields = extractFields(info, ProfileType);

    return (await context.prisma.profile.findUnique({
      where: { id: id },
      include: { memberType: !!fields.memberType },
    })) as IProfile;
  },
};

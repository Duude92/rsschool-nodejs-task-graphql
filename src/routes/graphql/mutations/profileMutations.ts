import {
  ChangeProfileInput,
  CreateProfileInput,
  ProfileType,
} from '../types/profileType.js';
import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { UUIDType } from '../types/uuid.js';
import { FieldBase } from '../api/Types.js';
import {
  IChangeProfileInput,
  ICreateProfileInput,
  IProfile,
} from '../api/IObjectTypes.js';

export const createProfile: FieldBase<
  unknown,
  Promise<IProfile>,
  { dto: ICreateProfileInput }
> = {
  type: new GraphQLNonNull(ProfileType),
  args: {
    dto: { type: new GraphQLNonNull(CreateProfileInput) },
  },
  resolve: async (_, { dto }, { prisma }) => prisma.profile.create({ data: dto }),
};
export const changeProfile: FieldBase<
  unknown,
  Promise<IProfile>,
  {
    id: string;
    dto: IChangeProfileInput;
  }
> = {
  type: new GraphQLNonNull(ProfileType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInput) },
  },
  resolve: async (_, { id, dto }, { prisma }) =>
    prisma.profile.update({
      where: {
        id: id,
      },
      data: dto,
    }),
};
export const deleteProfile: FieldBase<unknown, string, { id: string }> = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { id }, { prisma }) =>
    JSON.stringify(await prisma.profile.delete({ where: { id: id } })),
};

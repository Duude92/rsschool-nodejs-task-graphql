import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { ChangePostInput, CreatePostInput, PostType } from '../types/postType.js';
import { UUIDType } from '../types/uuid.js';
import { FieldBase } from '../api/Types.js';
import { IChangePostInput, ICreatePostInput, IPost } from '../api/IObjectTypes.js';

export const createPost: FieldBase<unknown, IPost, { dto: ICreatePostInput }> = {
  type: new GraphQLNonNull(PostType),
  args: {
    dto: { type: new GraphQLNonNull(CreatePostInput) },
  },
  resolve: async (_, { dto }, { prisma }) =>
    (await prisma.post.create({ data: dto })) as IPost,
};
export const changePost: FieldBase<
  unknown,
  IPost,
  { id: string; dto: IChangePostInput }
> = {
  type: new GraphQLNonNull(PostType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangePostInput) },
  },
  resolve: async (_, { id, dto }, { prisma }) =>
    await prisma.post.update({ where: { id: id }, data: dto }),
};
export const deletePost: FieldBase<unknown, string> = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_, { id }, { prisma }) =>
    JSON.stringify(await prisma.post.delete({ where: { id: id } })),
};

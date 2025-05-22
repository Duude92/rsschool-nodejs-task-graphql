import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { ChangePostInput, CreatePostInput, PostType } from '../types/postType.js';
import { UUIDType } from '../types/uuid.js';

export const createPost = {
  type: new GraphQLNonNull(PostType),
  args: {
    dto: { type: new GraphQLNonNull(CreatePostInput) },
  },
  resolve: async (a, { dto }, { prisma }) => prisma.Post.create({ data: dto }),
};
export const changePost = {
  type: new GraphQLNonNull(PostType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangePostInput) },
  },
  resolve: async (a, { id, dto }, { prisma }) =>
    prisma.Post.update({ where: { id: id }, data: dto }),
};
export const deletePost = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (a, { id }, { prisma }) =>
    (await prisma.Post.delete({ where: { id: id } })).toString(),
};

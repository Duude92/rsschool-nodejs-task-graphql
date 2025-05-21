import { GraphQLNonNull, GraphQLString } from 'graphql/type/index.js';
import { ChangePostInput, CreatePostInput, PostType } from '../types/postType.js';
import { UUIDType } from '../types/uuid.js';

export const createPost = {
  type: new GraphQLNonNull(PostType),
  args: {
    dto: { type: new GraphQLNonNull(CreatePostInput) },
  },
  resolve: async (a, { dto }, context) => context.Post.create({ data: dto }),
};
export const changePost = {
  type: new GraphQLNonNull(PostType),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangePostInput) },
  },
  resolve: async (a, { id, dto }, context) =>
    context.Post.update({ where: { id: id }, data: dto }),
};
export const deletePost = {
  type: new GraphQLNonNull(GraphQLString),
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (a, { id }, context) =>
    (await context.Post.delete({ where: { id: id } })).toString(),
};

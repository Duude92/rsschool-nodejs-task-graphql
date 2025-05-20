import { GraphQLNonNull } from 'graphql/type/index.js';
import { CreatePostInput, PostType } from '../types/postType.js';

export const createPost = {
  type: new GraphQLNonNull(PostType),
  args: {
    dto: { type: new GraphQLNonNull(CreatePostInput) },
  },
  resolve: async (a, { dto }, context) => context.Post.create({ data: dto }),
};

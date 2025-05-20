import { GraphQLList, GraphQLNonNull } from 'graphql/type/index.js';
import { PostType } from '../types/postType.js';
import { UUIDType } from '../types/uuid.js';

export const postsQuery = {
  type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
  resolve: async (_, __, context) => await context.Post.findMany(),
};
export const postQuery = {
  type: PostType,
  args: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
  resolve: async (_, { id }: { id: typeof UUIDType }, context) =>
    await context.Post.findUnique({
      where: {
        id: id,
      },
    }),
};

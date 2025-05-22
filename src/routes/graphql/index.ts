import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import { rootSchema } from './gql-schema.js';
import depthLimit from 'graphql-depth-limit';
import DataLoader from 'dataloader';

const createLoader = (values: Promise<unknown[]>, predicate: (value, key) => boolean) =>
  new DataLoader(async (keys) =>
    keys.map(async (key: unknown) =>
      (await values).filter((value) => predicate(value, key)),
    ),
  );

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const errors = validate(rootSchema, parse(query), [depthLimit(5)]);
      if (errors.length) return { errors };

      const postLoader = createLoader(
        prisma.post.findMany(),
        (post: any, key) => post.authorId === key,
      );
      const profileLoader = createLoader(
        prisma.profile.findMany({
          include: {
            memberType: true,
          },
        }),
        (profile: any, key) => profile.userId == key,
      );
      const memberLoader = createLoader(
        prisma.memberType.findMany(),
        (member: any, key) => member.id === key,
      );
      const userLoader = createLoader(
        prisma.user.findMany({
          include: {
            // profile: true,
            // userSubscribedTo: true,
            // subscribedToUser: true,
          },
        }),
        (member: any, key) => member.id === key,
      );

      return graphql({
        schema: rootSchema,
        source: query,
        variableValues: variables,
        contextValue: {
          prisma,
          loaders: { postLoader, profileLoader, memberLoader, userLoader },
        },
      });
    },
  });
};
export default plugin;

import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import { rootSchema } from './gql-schema.js';
import depthLimit from 'graphql-depth-limit';

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
      return graphql({
        schema: rootSchema,
        source: query,
        variableValues: variables,
        contextValue: prisma,
        // validationRules: [depthLimit(5)],
      });
    },
  });
};

export default plugin;

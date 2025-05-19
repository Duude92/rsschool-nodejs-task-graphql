import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql/type/index.js';

export const rootSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      testQuery:{
        type: GraphQLString,
        resolve: async ()=> 'Hello World!'
      }
    }
  }),

})
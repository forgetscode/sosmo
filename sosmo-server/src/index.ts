import "reflect-metadata";
import { createConnection } from 'typeorm';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from "./entities/User";
import express from 'express';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";


const main = async () => {

    const conn = await createConnection({
        type: 'postgres',
        database: 'sosmo',
        username: 'forgetscode',
        password: ' ',
        logging: true, 
        synchronize: !__prod__,
        entities: [User, Post], 
    });
    const app = express();

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[
                HelloResolver,
                PostResolver
            ],
            validate: false
        }),
        context: ({req, res}) => ({req, res}),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app });
};

main().catch((err) => {
    console.error(err);
  });
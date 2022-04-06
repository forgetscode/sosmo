import "reflect-metadata";
import { createConnection } from 'typeorm';
import { __COOKIE_SECRET__, __db_password__, __db_user__, __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from "./entities/User";
import express from 'express';
import session from 'express-session';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import cors from 'cors';
import connectRedis from 'connect-redis'

const Redis = require('ioredis');

const main = async () => {

    const conn = await createConnection({
        type: 'postgres',
        database: 'sosmo',
        username: __db_user__,
        password: __db_password__,
        logging: true, 
        synchronize: !__prod__,
        entities: [User, Post], 
    });
    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(cors({
      origin: Array('http://localhost:3000',"https://studio.apollographql.com"),
      credentials: true,
    }));
    
    app.use(
        session({
          name: "COOKIE_SOSMO345FZRTXZRE",
          store: new RedisStore({ 
              client: redis,
              disableTouch: true,
          }),

          cookie: {
            maxAge: 1000 * 60 * 24 * 60 * 365,
            httpOnly: true,
            sameSite: 'lax',
            secure:__prod__,
          },
          saveUninitialized: false,
          secret: __COOKIE_SECRET__,
          resave: false,
        })
      );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[
                PostResolver,
                UserResolver
            ],
            validate: false
        }),
        context: ({req, res}) => ({req, res, redis}),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
      app,
      cors: false,
    });

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    });

};

main().catch((err) => {
    console.error(err);
  });


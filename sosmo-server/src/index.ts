import "reflect-metadata";
import "dotenv-safe/config";
import { createConnection } from 'typeorm';
import { __prod__ } from './constants';
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
import path from "path";

const Redis = require('ioredis');

const main = async () => {

    const conn = await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        logging: true, 
        //synchronize: true,
        migrations:[path.join(__dirname, "./migrations/*")],
        entities: [User, Post], 
    });
    await conn.runMigrations();

    const app = express();

    const RedisStore = connectRedis(session);
    const redis = new Redis(process.env.REDIS_URL);
    app.set("trust proxy", 1);


    app.use(cors({
      origin: process.env.CORS_ORIGIN,
     // origin: Array(process.env.CORS_ORIGIN, process.env.CORS_ORIGIN_APOLLO),
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
            domain:__prod__ ? ".forgetspractice.com" :undefined,
          },
          saveUninitialized: false,
          secret: process.env.SESSION_SECRET,
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

    app.listen(parseInt(process.env.PORT), () => {
        console.log('server started on localhost:4000')
    });

};

main().catch((err) => {
    console.error(err);
  });


import "reflect-metadata";
import { createConnection } from 'typeorm';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from "./entities/User";
import express from 'express';

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
    })

};

main().catch((err) => {
    console.error(err);
  });
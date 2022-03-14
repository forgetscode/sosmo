import { createConnection } from 'typeorm';

const main = async () => {

    const conn = await createConnection({
        type: 'postgres',
        database: 'sosmo',
        username: 'postgres',
        password: 'postgres',
        logging: true, 
        synchronize: true
    });
};
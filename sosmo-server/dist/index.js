"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const main = async () => {
    const conn = await (0, typeorm_1.createConnection)({
        type: 'postgres',
        database: 'sosmo',
        username: 'postgres',
        password: 'postgres',
        logging: true,
        synchronize: true
    });
};
//# sourceMappingURL=index.js.map
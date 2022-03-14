"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const User_1 = require("./entities/User");
const express_1 = __importDefault(require("express"));
const main = async () => {
    const conn = await (0, typeorm_1.createConnection)({
        type: 'postgres',
        database: 'sosmo',
        username: 'forgetscode',
        password: ' ',
        logging: true,
        synchronize: !constants_1.__prod__,
        entities: [User_1.User, Post_1.Post],
    });
    const app = (0, express_1.default)();
    app.listen(4000, () => {
        console.log('server started on localhost:4000');
    });
};
main().catch((err) => {
    console.error(err);
});
//# sourceMappingURL=index.js.map
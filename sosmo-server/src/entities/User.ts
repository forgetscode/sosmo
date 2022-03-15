import { Field } from "type-graphql";
import {
    Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    BaseEntity
} from "typeorm";

@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({default:null})
    name: string;

    @Field()
    @Column()
    publicKey: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;
}

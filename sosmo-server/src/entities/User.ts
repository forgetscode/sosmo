import { Field, ObjectType } from "type-graphql";
import {
    Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    BaseEntity
} from "typeorm";

@ObjectType()
@Entity()
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column({
        default:"null",
        nullable:true
    })
    name: string;

    @Field()
    @Column({unique: true})
    publicKey: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;
}

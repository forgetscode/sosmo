import { Field, ObjectType } from "type-graphql";
import {
    Entity, 
    PrimaryGeneratedColumn,
    Column, 
    CreateDateColumn, 
    BaseEntity,
    OneToMany
} from "typeorm";
import { Post } from "./Post";

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

    @OneToMany(() => Post, (post) => post.creator,  {
        onDelete: "CASCADE",
      })
    posts: Post[];

    @Field()
    @Column({
        default:0,
        nullable:true
    })
    reputation: number;
}

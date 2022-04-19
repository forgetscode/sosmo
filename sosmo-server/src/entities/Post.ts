    import { Field, ObjectType } from "type-graphql";
    import {
        Entity, 
        PrimaryGeneratedColumn,
        Column, 
        CreateDateColumn, 
        UpdateDateColumn,
        BaseEntity,
        ManyToOne
    } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column("varchar", { length: 200 })
    title: string;

    @Field()
    @Column({type: 'text', nullable: false})
    text: string;

    @Field()
    @Column()
    discriminator: string;

    @Field()
    @Column({
        default:"uninitialized"
    })
    state: string;

    @Field()
    @Column({
        default:null
    })
    disputeReason: string;

    @Field()
    @Column()
    creatorId: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt:Date;
    
    @Field()
    @ManyToOne(() => User, (user) => user.posts,{lazy:true})
    creator: User;

}
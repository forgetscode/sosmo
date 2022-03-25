    import { Field, ObjectType } from "type-graphql";
    import {
        Entity, 
        PrimaryGeneratedColumn,
        Column, 
        CreateDateColumn, 
        UpdateDateColumn,
        BaseEntity
    } from "typeorm";

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
        @Column()
        text: string;

        @Field()
        @Column()
        creatorId: number;

        @Field(() => String)
        @CreateDateColumn()
        createdAt: Date;
    
        @Field(() => String)
        @UpdateDateColumn()
        updatedAt:Date;

    }
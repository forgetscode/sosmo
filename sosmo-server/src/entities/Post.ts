    import {
        Entity, 
        PrimaryGeneratedColumn,
        Column, 
        CreateDateColumn, 
        UpdateDateColumn
    } from "typeorm";

    @Entity()
    export class Post {

        @PrimaryGeneratedColumn()
        id: number;

        @Column("varchar", { length: 200 })
        title: string;

        @Column()
        text: string;

        @Column({type: "int", default: 0})
        points: number;

        @Column()
        creatorId: number;

        @CreateDateColumn()
        createdAt: Date;

        @UpdateDateColumn()
        updatedAt: Date;

    }
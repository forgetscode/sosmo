import { MyContext } from "src/types";
import { Resolver, Query, Arg, Int, Mutation, Ctx } from "type-graphql";
import { Post } from "../entities/Post";

    @Resolver()
    export class PostResolver {
        @Query( () => [Post] )
        posts(){
            return Post.find();
        }

        @Query( () => Post, { nullable: true} )
        post(
            @Arg("id", () => Int) id: number,
        ){
            return Post.findOne(id);
        }

        @Mutation(() => Post)
        async createPost( 
            @Arg( 'title' ) title:string, 
            @Arg( 'text' ) text:string, 
            @Ctx() { req }: MyContext
            ): Promise<Post> {
            return Post.create({
                title:title,
                text:text,
                creatorId: req.session.userId
            }).save();
        }
    }
import { MyContext } from "../types";
import { Resolver, Query, Arg, Int, Mutation, Ctx, Field, InputType, ObjectType } from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";

@InputType()
class PostInput {
    @Field()
    title: string
    @Field()
    text: string
}

@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[];
    @Field()
    hasMore:boolean;
}

@Resolver()
export class PostResolver {

    @Query( () => Post, { nullable: true} )
    post(
        @Arg("id", () => Int) id: number,
    ){
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    async createPost( 
        @Arg( 'input' ) input:PostInput, 
        @Ctx() { req }: MyContext
        ): Promise<Post> {
        return Post.create({
            ...input,
            creatorId: req.session.userId
        }).save();
    }

    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit') limit: number,
        @Arg('cursor', () => String, {nullable: true}) cursor: string | null,
    ): Promise<PaginatedPosts> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;

        const replacements: any[] = [realLimitPlusOne];

        if (cursor){
            replacements.push(new Date(parseInt(cursor)));
        }
      
        const posts = await getConnection().query(
            `
            select p.*
            from post p
            ${cursor ? `where p."createdAt" < $2` : ""}
            order by p."createdAt" DESC
            limit $1
            `,
            replacements
            );
            
        return {
            posts:posts.slice(0,realLimit),
            hasMore: posts.length === realLimitPlusOne
        };
    }
}
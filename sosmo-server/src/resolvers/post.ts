import { MyContext } from "../types";
import { Resolver, Query, Arg, Int, Mutation, Ctx, Field, ObjectType } from "type-graphql";
import { getConnection } from "typeorm";
import { Post } from "../entities/Post";

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
        @Arg( 'title' ) title:string, 
        @Arg( 'text' ) text:string, 
        @Arg( 'discriminator' ) discriminator: string,
        @Ctx() { req }: MyContext
        ): Promise<Post> {
        return Post.create({
            title: title,
            text: text,
            creatorId: req.session.userId,
            discriminator: discriminator
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
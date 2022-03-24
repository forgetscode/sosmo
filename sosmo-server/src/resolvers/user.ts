import { MyContext } from "src/types";
import { Resolver, Query, Arg, Int, Mutation, Ctx } from "type-graphql";
import { User } from "../entities/User";

@Resolver()
export class UserResolver {
    @Query( () => [User] )
    users(){
        return User.find();
    }

    @Query( () => User, { nullable: true} )
    async user(
        @Arg("publicKey") publicKey: string
    ): Promise<User | undefined>
    {
        const user = await User.findOne(
            {where:
                {publicKey:publicKey}
            }
        );
        return user;
    }


    @Mutation(() => User)
    async createUser( 
        @Arg( 'publicKey' ) publicKey:string,  
        @Ctx() { req }: MyContext
        ): Promise<User> 
        {
            return User.create({
                publicKey:publicKey,
            }).save();
         }

    @Mutation(() => Boolean)
    async deleteUser(@Arg( 'id' ) id:number ): Promise<boolean>
        {
            return ((await (await User.delete({ id:id })).affected)?true:false);
        }
}
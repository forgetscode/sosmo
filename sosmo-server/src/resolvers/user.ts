import { MyContext } from "src/types";
import { Resolver, Query, Arg, Mutation, Ctx } from "type-graphql";
import { User } from "../entities/User";

@Resolver()
export class UserResolver {
    @Query( () => User, { nullable:true } )
    async me( @Ctx() { req, }: MyContext ) {
        if ( !req.session.userId ) {
            return null
        }

        const user = await User.findOne( req.session.userId );
        return user;
    }

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

    @Mutation(() => User)
    async login(
        @Arg("publicKey") publicKey: string,
        @Ctx() { req }: MyContext
    ): Promise<User | undefined> {
        const user = await User.findOne(
            {
                where:
                {publicKey:publicKey}
            }
        );
        req.session.userId = user?.id;

        return user;
    }

    @Mutation ( () => Boolean )
    logout(
        @Ctx () { req, res }: MyContext
    ) {
        return new Promise( resolve =>
            req.session.destroy(( err ) => {
            res.clearCookie( "COOKIE_SOSMO345FZRTXZRE" );
            if ( err ) {
                console.log( err );
                resolve( false )
                return;
            }
            resolve( true );
        })
        );
    }

}
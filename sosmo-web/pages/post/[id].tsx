import { useRouter } from 'next/router';
import { usePostQuery, useUserIdQuery } from '../../generated/graphql';
import { Nav } from '../../components/Nav';
import { Contract } from '../../components/Contract';


export const Post = ({}) => {
    const router = useRouter();
    const  slug  = parseInt(router.query.id?.toString()!);
    const { data, error,  loading } =  usePostQuery({
        variables: {
            id: slug,
        },
    });

    const { data:_data, error:_error,  loading:_loading } = useUserIdQuery({
        variables: {
            id: data?.post?.creatorId!,
        },
    });

    if ( loading || _loading ) {
        return(
                <div> ... loading... </div>
        );
    }

    if ( error ) {
        return ( <div>{ error.message }</div> );
    }

    if ( !data?.post ) {
        return (
                <div> Could not find post</div>
        );
    }

    return (
            <Nav>
                <div className="box-border w-f md:border-2 border-slate-900 md:rounded-lg p-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col p-4">
                        <div className="flex md:flex-row flex-col mb-6 ">
                            <h2 className="font-large text-black text-4xl mb-2 ml-1">{ data?.post.title } </h2>
                            <p className="text-black mt-auto md:ml-auto md:disabled:mr-auto mb-2 ml-1"> by: { _data?.userid?.publicKey }</p>
                        </div>
                        <textarea value={ data?.post?.text} className="h-[300px] box-border w-f border-2 border-slate-900 rounded-lg p-4 sm:px-6 lg:px-8" readOnly ></textarea>
                        <div className=" mt-8">
                            <Contract postid = {data?.post.id} discriminator = {data?.post.discriminator} contractor = {_data?.userid?.publicKey!} state = {data?.post.state}/>
                        </div>
                    </div>
                </div>
            </Nav>
    );
};

export default Post;
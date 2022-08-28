import { useRouter } from 'next/router';
import { usePostQuery, useUserIdQuery } from '../../generated/graphql';
import { Nav } from '../../components/Nav';
import { Contract } from '../../components/Contract';
import Head from 'next/head';


export const Post = ({}) => {
    const router = useRouter();
    const intId = typeof router.query.id === 'string' ? parseInt(router.query.id): -1;
    const { data, error,  loading } = usePostQuery({
        skip: intId === -1,
        variables: {
            id: intId,
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
                <div className="box-border w-f border-2 border-slate-600 shadow-lg rounded-lg p-4">
                    <div className="flex flex-col p-4">
                        <div className="flex flex-row mb-6">
                            <h2 className="font-medium leading-tight text-4xl">{ data?.post.title } </h2>
                            <p className="text-gray-600 text-xs mt-auto ml-auto mb-2"> by: { _data?.userid?.publicKey }</p>
                        </div>
                        <textarea className="h-[300px]  p-2 w-full .5border border-solid border-gray-700 rounded" readOnly >
                            { data?.post?.text}
                        </textarea>
                    </div>
                    <Contract postid = {data?.post.id} discriminator = {data?.post.discriminator} contractor = {_data?.userid?.publicKey!} state = {data?.post.state}/>
                </div>
            </Nav>
    );
};

export default Post;
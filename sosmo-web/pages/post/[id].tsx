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
            <div className='text-3xl flex h-screen justify-center items-center'> loading... </div>
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

    const stringToHTML = function (str:string) {
        var dom = document.createElement('div');
        dom.innerHTML = str;
        return dom;
    };

    // data?.post?.text}

    const test = stringToHTML('<img src="my-awesome-photo.jpg">');

    return (
            <Nav>
                <div className=" bg-white md:shadow-2xl rounded-xl border-slate-900 p-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col p-4">
                        <div className="flex md:flex-row flex-col mb-6 ">
                            <h2 className="font-large text-black text-4xl mb-2 ml-1">{ data?.post.title } </h2>
                            <p className="font-mono text-black mt-auto md:ml-auto md:disabled:mr-auto mb-2 ml-1"> by: { _data?.userid?.publicKey }</p>
                        </div>
                        <p  className=" w-f border-slate-600 p-2 py-2 sm:px-2 lg:px-2 disabled">
                            <div dangerouslySetInnerHTML={{ __html: data?.post?.text }} />
                        </p>
                        <div className=" mt-8">
                            <Contract postid = {data?.post.id} discriminator = {data?.post.discriminator} contractor = {_data?.userid?.publicKey!} state = {data?.post.state}/>
                        </div>
                    </div>
                </div>
            </Nav>
    );
};

export default Post;
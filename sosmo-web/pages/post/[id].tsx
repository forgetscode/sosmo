import { useRouter } from 'next/router';
import { usePostQuery } from '../../generated/graphql';
import { Nav } from '../../components/Nav';
import { Contract } from '../../components/Contract';
import { useEffect, useRef } from 'react';

const ShadowRoot = ({ innerHTML }: { innerHTML: string }) => {
    const shadowHost = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (shadowHost?.current) {
        const shadowRoot = shadowHost.current.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = innerHTML;
      }
    }, [ innerHTML ]);
    return (
      <div ref={shadowHost}/>
    )
  };

export const Post = ({}) => {
    const router = useRouter();
    const  slug  = parseInt(router.query.id?.toString()!);
    const { data, error,  loading } =  usePostQuery({
        variables: {
            id: slug,
        },
    });

    if ( loading) {
        return(
            <div></div>
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
                <div className=" bg-white md:shadow-2xl rounded-xl border-slate-900 p-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col p-4">
                        <div className="flex md:flex-row flex-col mb-6 ">
                            <h2 className="sm:font-large font-sm text-black text-4xl mb-2 ml-1">{ data?.post.title } </h2>
                            <p className="font-mono text-black md:text-lg text-sm mt-auto md:ml-auto md:disabled:mr-auto mb-2 ml-1"> by: {data?.post?.creator.publicKey}</p>
                        </div>
                        <div  className=" w-f border-slate-600 p-2 py-2 sm:px-2 lg:px-2 disabled">
                            <ShadowRoot innerHTML={data?.post?.text}></ShadowRoot>
                        </div>
                        <div className=" mt-8">
                            <Contract postid = {data?.post.id} discriminator = {data?.post.discriminator} contractor = {data?.post?.creator.publicKey} state = {data?.post.state}/>
                        </div>
                    </div>
                </div>
            </Nav>
    );
};

export default Post;

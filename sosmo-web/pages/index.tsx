import moment from "moment";
import NextLink from 'next/link';
import { Nav } from "../components/Nav";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {

  const {data, error,  loading, fetchMore, variables} = usePostsQuery({
    variables:{
        limit:8,
        cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });
  

  if (!loading && !data) {
    return (
        <>
            <div> query failed</div>
            <div> {error?.message}</div>
        </>
    );
  }
  
  return (
    <>
      <Nav>
        <div className="content-center -mt-12 md:-mt-8" />
              <br/>
              {loading && !data ? (
                  <div>loading...</div>
              )   :   (
              <div> 
                  {data!.posts.posts.map( (p) => !p ? null:(
                      <div key ={p.id}>
                          <div className="flex-1 md:mb-5">
                              <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                                    <div className=" cursor-pointer flex flex-col bg-white md:flex-row md:rounded-lg shadow-lg border-2 
                                    border-slate-200 transform transition duration-130 hover:scale-105 hover:border-slate-600">
                                        <div className="p-6 flex flex-col">
                                            <h5 className="text-gray-900 text-xl font-medium mb-2">{ p.title }</h5>
                                            <p className="text-gray-600 text-xs">Date: {moment.utc(Number(p.createdAt)).format("MM/DD/YYYY")} </p>
                                        </div>
                                    </div>
                              </NextLink>
                          </div>
                      </div>
                  ))}
              </div>
              )}
              { data && data.posts.hasMore ? (
                  <div className="flex justify-center mt-3">
                    <button 
                        onClick={() => {
                            fetchMore({
                                variables: {
                                    limit:variables?.limit,
                                    cursor: data.posts.posts[data.posts.posts.length -1].createdAt,
                                },
                            });
                        }}
                        className="blue-button"
                        > load more
                    </button>
                  </div>
              ): null}
      </Nav>
    </>
  )
}

export default Index;
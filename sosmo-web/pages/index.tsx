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
                                    <div>
                                        <div className="flex bg-white shadow-lg md:flex-row md:rounded-lg hover:bg-slate-200 hover:shadow-2xl hover:-mx-4">
                                            <div className="p-6 flex flex-col">
                                                <h5 className="ml-2 text-gray-900 text-xl font-serif font-medium md:mb-2">{ p.title }</h5>
                                                <p className="ml-2 text-gray-600 text-xs">Date: {moment.utc(Number(p.createdAt)).format("MM/DD/YYYY")} </p>
                                            </div>
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
                    > load more</button>
                  </div>
              ): null}
      </Nav>
    </>
  )
}

export default Index;
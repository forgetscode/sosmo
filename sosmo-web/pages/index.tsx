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
        <div className="content-center -mt-8" />
              <br/>
              {loading && !data ? (
                  <div>loading...</div>
              )   :   (
              <div> 
                  {data!.posts.posts.map( (p) => !p ? null:(
                      <div key ={p.id}>
                          <div className="flex-1">
                              <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                                    <div>
                                        <div className="flex flex-col md:flex-row rounded-lg bg-white shadow-lg border-2 border-slate-200 hover:bg-slate-100">
                                            <img className=" p-3" src="https://www.svgrepo.com/show/381974/completed-checkmark-done-complete.svg"/>
                                            <div className="p-6 flex flex-col">
                                                <h5 className="text-gray-900 text-xl font-medium mb-2">{ p.title }</h5>
                                                <p className="text-gray-600 text-xs">Date: {moment.utc(Number(p.createdAt)).format("MM/DD/YYYY")} </p>
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
                  <div className="flex">
                    <button 
                    onClick={() => {
                        fetchMore({
                            variables: {
                                limit:variables?.limit,
                                cursor: data.posts.posts[data.posts.posts.length -1].createdAt,
                            },
                        });
                    }}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-6 m-auto"
                    > load more</button>
                  </div>
              ): null}
      </Nav>
    </>
  )
}

export default Index;
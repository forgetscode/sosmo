import { Flex, Stack, Box, Heading, Button, Text, Link } from "@chakra-ui/react";
import moment from "moment";
import NextLink from 'next/link';
import { Nav } from "../components/Nav";
import { usePostsQuery } from "../generated/graphql";


const Index = () => {

  const {data, error,  loading, fetchMore, variables} = usePostsQuery({
    variables:{
        limit:10,
        cursor: null,
    },
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
        <Flex align="center" mt={-6}>
              </Flex>
              <br/>
              {loading && !data ? (
                  <div>loading...</div>
              )   :   (
              <Stack spacing={8} > 
                  {data!.posts.posts.map( (p) => !p ? null:(
                      <Flex key ={p.id} p={5} shadow='md' borderWidth='1px' bg="white">
                          <Box flex={1}>
                              <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                                  <Link>
                                      <Heading fontSize="xl"> { p.title } </Heading>
                                      <a> date: {moment.utc(Number(p.createdAt)).format("MM/DD/YYYY")} </a>
                                  </Link>
                              </NextLink>
                          </Box>
                      </Flex>
                  ))}
              </Stack>
              )}
              { data && data.posts.hasMore ? (
                  <Flex>
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
                  </Flex>
              ): null}
      </Nav>
    </>
  )
}

export default Index;
import { Flex, Stack, Box, Heading, Button, Text, Link } from "@chakra-ui/react";
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
      <Flex align="center">
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
                                </Link>
                            </NextLink>
                            <Text> by: { "lol" } </Text>
                        </Box>
                    </Flex>
                ))}
            </Stack>
            )}
            { data && data.posts.hasMore ? (
                <Flex>
                <Button onClick={() => {
                    fetchMore({
                        variables: {
                            limit:variables?.limit,
                            cursor: data.posts.posts[data.posts.posts.length -1].createdAt,
                        },
                    });
                }}isLoading = {loading} m='auto' my={6}> load more</Button>
                </Flex>
            ): null}
      </Nav>
    </>
  )
}

export default Index;
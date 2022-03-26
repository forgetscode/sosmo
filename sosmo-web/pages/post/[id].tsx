import { Box, Heading, IdProvider } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { usePostQuery, useUserIdQuery } from '../../generated/graphql';
import { Grid, GridItem, Text } from '@chakra-ui/react'
import { Nav } from '../../components/Nav';





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

    if ( loading ) {
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
                <Grid
                    templateRows='repeat(4)'
                    templateColumns='repeat(8, 1fr)'
                    shadow='md' borderWidth='1px'
                    bg="white"
                    >
                    <GridItem rowSpan={4} colSpan={1}>
                    </GridItem>
                    <GridItem colSpan={7}>
                        <Box mt={4} mb ={4}>
                            <Heading> { data?.post.title }</Heading> 
                        </Box>
                        <Text mb ={4}> by: { _data?.userid?.publicKey } </Text>
                    </GridItem>
                    <GridItem 
                        rowSpan={2} 
                        colSpan={7} 
                        mr={4}
                        wordBreak={"break-word"}
                        mb={4}
                        >
                            <Text>{ data?.post?.text }</Text>
                    </GridItem>
                    <GridItem rowSpan={1} colSpan={7} ml='auto' mt='auto' mb={4} mr={4}>
                    </GridItem>
                    <GridItem rowSpan={3} colSpan={7} ml='auto' mt='auto' mb={4} mr={4}>
                    </GridItem>
                </Grid>
            </Nav>
    );
};

export default Post;
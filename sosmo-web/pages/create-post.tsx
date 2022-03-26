import { Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { InputField } from "../components/InputField";
import { Nav } from "../components/Nav";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from '../utils/useIsAuth';

const createPost = () => {
    const router = useRouter();
    useIsAuth();
    const [ createPost ] = useCreatePostMutation();
    
    return (
        <>
        <Nav>
            <Formik
                initialValues={{title:"", text:""}}
                onSubmit={async (values) => {
                    const {errors} = await createPost({variables: {input:values}
                    });
                    if (!errors) {
                        router.push("/");
                    }
                }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                        <InputField
                            name='title'
                            height={50}
                            placeholder='title'
                            label='Title'
                            />
                        <Box mt={4}>
                        <InputField
                            textarea
                            height={200}
                            name='text'
                            placeholder='text...'
                            label='Body'
                        />
                        </Box>
                        <button
                            className="text-white bg-blue-700 
                            hover:bg-blue-800 focus:ring-4 focus:outline-none 
                            focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center 
                            dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-6"
                            type='submit'
                        >
                            Post
                        </button>
                    </Form>
                )}
            </Formik>
        </Nav>
        </>
    )
}

export default createPost;
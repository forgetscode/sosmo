import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import { Nav } from "../components/Nav";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from '../utils/useIsAuth';
import * as anchor from '@project-serum/anchor';
import { Textarea } from "@chakra-ui/react";


const createPost = () => {
    const router = useRouter();
    useIsAuth();
    const [ createPost ] = useCreatePostMutation();
    const discriminator = anchor.web3.Keypair.generate();
    return (
        <>
        <Nav>
            <div className="content-center"/>
                <Formik
                    initialValues={{title:"", text:""}}
                    onSubmit={async (values) => {
                        const {errors} = await createPost({
                            variables: {
                                title:values.title,
                                text: values.text, 
                                discriminator:discriminator.publicKey.toString(),
                            }
                        });
                        if (!errors) {
                            router.push("/");
                        }
                    }}
                >
                {({ values, isSubmitting }) => (
                        <div className="box-border w-f border-2 border-slate-600 shadow-lg rounded-lg p-4">
                            <Form>
                                    <div className="flex flex-col p-4">
                                        <Field
                                            className="bg-blue-200 p-3  border-2 border-slate-900 rounded-lg"
                                            placeholder='Title'
                                            name='title'
                                            label='Title'
                                        />
                                        <div className="m-4"/>
                                        <Field
                                            className="bg-blue-200 p-3 border-2 border-slate-900 rounded-lg h-[500px]"
                                            name='text'
                                            as = {Textarea}
                                            placeholder ='Text...'
                                            label='Body'
                                        />
                                    </div>
                                    <div>
                                        <button
                                            className="text-white bg-blue-700 ml-3
                                            hover:bg-blue-800 focus:ring-4 focus:outline-none 
                                            focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center 
                                            dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2"
                                            type='submit'
                                        >
                                            Post
                                        </button>
                                    </div>
                            </Form>
                        </div>
                )}
                </Formik>
        </Nav>
        </>
    )
}

export default createPost;
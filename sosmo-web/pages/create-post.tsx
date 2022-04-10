import { Formik, Form, Field } from "formik";
import { useRouter } from "next/router";
import { Nav } from "../components/Nav";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from '../utils/useIsAuth';
import * as anchor from '@project-serum/anchor';

import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";


 
const createPost = () => {
    const router = useRouter();
    useIsAuth();
    const [ createPost ] = useCreatePostMutation();
    const discriminator = anchor.web3.Keypair.generate();
    const [value, setValue] = useState('')

    return (
        <>
        <Nav>
            <div className="content-center"/>
                <Formik
                    initialValues={{title:"", text:""}}
                    onSubmit={async (values) => {
                        values.text = value;
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
                        <div className="box-border w-f md:border border-slate-600 rounded-lg p-4 bg-white">
                            <Form>
                                    <div className="flex flex-col p-4">
                                        <Field
                                            className=" p-3 border rounded-sm border-slate-500"
                                            placeholder='Title'
                                            name='title'
                                            label='Title'
                                        />
                                        <div className="m-4"/>
                                        <ReactQuill
                                            className="mb-8  rounded-lg h-[400px]" theme="snow" value={value} onChange={setValue}
                                        />
                                    </div>
                                    <div>
                                        <button
                                            className="blue-button ml-4"
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
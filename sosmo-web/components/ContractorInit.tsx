import { Formik, Form, Field } from "formik";
import { useState } from "react";
import { useUpdateStateMutation } from "../generated/graphql";

interface ContractProps {
    postid:number,
    discriminator: string,
    contractor: string,
    state: string,
}

interface ChangeStateProps extends ContractProps {
    setValue: (state: number) => void
}

const CreateTerms = ({ setValue, ...props }: ChangeStateProps) => {
    const [ updateState ] = useUpdateStateMutation();
    return(
        <>
            <Formik
                initialValues={{amount_guranteed:"", amount_total:""}}
                onSubmit={async (values) => {
                    if (parseInt(values.amount_guranteed) > parseInt(values.amount_total)){
                        window.alert("Amount gurnteed must be less than amount total!");
                    }
                    else{
                        const {errors} = await updateState({
                            variables: {
                                id: props.postid,
                                state: "initialized",
                            }
                        });
                    }
                }}
            >
                {({ values, isSubmitting }) => (
                        <div className="box-border w-f border-2 border-slate-600 shadow-lg rounded-lg p-4">
                            <Form>
                                    <div className="flex flex-col p-4">
                                        <p className='text-black mb-1 text-m font-medium'>Amount guranteed</p>
                                        <Field
                                            className=" p-3  border-2 border-slate-900 rounded-lg"
                                            placeholder='Amount guranteed in case of dispute, must be less than total'
                                            name='amount_guranteed'
                                            label='Amount_guranteed'
                                        />
                                        <div className="m-4"/>
                                        <p className='text-black mb-1 text-m font-medium'>Amount total</p>
                                        <Field
                                            className=" p-3 border-2 border-slate-900 rounded-lg"
                                            name='amount_total'
                                            placeholder ='Total amount given upon completion'
                                            label='Amount_total'
                                        />
                                    </div>
                                    <div>
                                        <button  onSubmit={() => setValue(0)} className="text-white bg-emerald-700 ml-3 hover:bg-emerald-800 
                                            focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-base px-6 py-3.5 text-center 
                                            dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 mt-2"
                                            type="submit"
                                        >
                                            Submit
                                        </button>
                                        <button  onClick={() => setValue(0)} className="text-white bg-rose-700 ml-3 
                                            hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium 
                                            rounded-lg text-base px-6 py-3.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 
                                            dark:focus:ring-rose-800 mt-2"
                                            type="button"
                                        >
                                            cancel
                                        </button>
                                    </div>
                            </Form>
                        </div>
                )}
            </Formik>
        </>
    )
}

const ChangeState = ({ setValue, ...props }: ChangeStateProps) => {
    return(
        <>
            <button onClick={() => setValue(1)} className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2">
                Create terms
            </button>
        </>
    )
}

export const ContractorInit = ( props:ContractProps ) => {
    const [state, setValue] = useState(0);
    return (
        <>
            {
                (state == 0) ? <ChangeState setValue={setValue} {...props}/> : <CreateTerms setValue={setValue} {...props}/>
            }
        </>
    )
}

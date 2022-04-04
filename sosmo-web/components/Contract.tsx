import { useWallet } from '@solana/wallet-adapter-react';
import { Field, Form, Formik } from 'formik';
import Router from 'next/router'
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useUpdateStateMutation } from '../generated/graphql';

interface ContractProps {
    discriminator: string,
    contractor: string,
    state: string,
}


const CreateTerms = ({setValue}:{setValue:any}, props:ContractProps) => {
    console.log("create terms: ", props);
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
                        console.log("submitting");
                        //update state, contract logic
                        /*
                        const {errors} = await updateState({
                            variables: {
                                id:,
                                state:,
                            }
                        });
                        
                        if (!errors) {
                            Router.reload();
                        }
                        */
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

const ChangeState =({setValue}:{setValue:any}, props:ContractProps) => {
    console.log("change state: ", props);
    return(
        <>
            <button onClick={() => setValue(1)} className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2">
                Create terms
            </button>
        </>
    )
}

const Contractor = ( props:ContractProps ) => {
    const [state, setValue] = useState(0);
    console.log("contractor: ", props);
    return (
        <>
            {
                (state == 0) ? <ChangeState setValue={setValue} {...props} /> : <CreateTerms setValue={setValue} {...props}/>
            }
        </>
    )
}

const Contractee = ( props:ContractProps ) => {
    const [state, setState] = useState('unintialized');


    return (
        <>
            <button className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2">
                Accept terms
            </button>
        </>
    )
}

const Ongoing = ( props:ContractProps ) => {
    const [state, setState] = useState('unintialized');
    return (
        <>
            <button className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2">
                Accept terms
            </button>
        </>
    )
}

const Completed = () => {
    return (
        
        <div className="flex w-full text-green-900 bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-base py-3.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">
            <div className="flex flex-row m-auto">
            <img
                className="h-12 w-12"
                src="https://www.svgrepo.com/show/362151/sign-check.svg"
                alt="Workflow"
            />
                <p className='m-auto text-emerald'>Completed!</p>
            </div>
        </div>
    );
}


const Disputed = () => {
    return (
        <div className="flex w-full text-white bg-red-800  hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-base py-3.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
            <div className="flex flex-row m-auto">
            <img
                className="h-12 w-12"
                src="https://www.svgrepo.com/show/366631/cancel.svg"
                alt="Workflow"
            />
                <p className='m-auto text-red'>Disputed</p>
            </div>
        </div>
    );
}


export const Contract= (props:ContractProps): JSX.Element => {
    const { publicKey, connected } = useWallet();
    
    if(props.state == "completed"){
        return(<Completed></Completed>);
    }
    if(props.state == "disputed"){
        return(<Disputed></Disputed>);
    }

    if (connected) {
        if (props.discriminator) {
            if(props.contractor == publicKey?.toString()){
                if (props.state == "unintialized"){
                    console.log("contract: ", props);
                    return( <Contractor {...props}></Contractor>);
                }
                else{
                    return (<></>)
                }
            }
            else{
                if (props.state == "open"){
                    return( <Contractee {...props}></Contractee>);
                }
                if (props.state == "accepted"){

                }
            }
        }
        else {
            return( <>
                oyy what happened
            </>);
        }
    }
    return (
        <> 
        </>
    );

}
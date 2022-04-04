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
 
  
const CancelContract = ({ setValue, ...props }: ChangeStateProps) => {
    
    const [ updateState ] = useUpdateStateMutation();
    return (
        <>
            <button onClick={async () => {
                    {
                        const {errors} = await updateState({
                            variables: {
                                id: props.postid,
                                state: "uninitialized",
                            }
                        });
                    }
                }}
                className="text-white bg-red-700 ml-3 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mt-2">
                Confirm cancellation
            </button>
            <button onClick={() => setValue(0)} className="text-white bg-slate-700 ml-3 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-blue-800 mt-2">
                Go Back
            </button>
        </>
    );
}


const OpenContract = ({ setValue, ...props }: ChangeStateProps) => {
    const [ updateState ] = useUpdateStateMutation();
    return(
        <>
            <Formik
                initialValues={{open_to:""}}
                onSubmit={async (values) => {
                    if (values.open_to.length == 0){
                        console.log("submitting");

                        const {errors} = await updateState({
                            variables: {
                                id: props.postid,
                                state: "open",
                            }
                        });
                    }
                    else if (values.open_to.length >= 32 && values.open_to.length <= 44 ){
                        console.log("submitting");

                        const {errors} = await updateState({
                            variables: {
                                id: props.postid,
                                state: "open",
                            }
                        });
                    }
                    else{
                        window.alert("Invalid address, must be 32 in length");
                    }
                }}
            >
                {({ values, isSubmitting }) => (
                        <div className="box-border w-f border-2 border-slate-600 shadow-lg rounded-lg p-4">
                            <Form>
                                    <div className="flex flex-col p-4">
                                        <p className='text-black mb-1 text-m font-medium'>Open to specific address(Leave empty to open to all)</p>
                                        <Field
                                            className=" p-3  border-2 border-slate-900 rounded-lg"
                                            placeholder='Address'
                                            name='open_to'
                                            label='open_to'
                                        />
                                        <div className="m-4"/>
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

const ChangeStateOpen = ({ setValue, ...props }: ChangeStateProps) => {
    const [state, setValueExtra] = useState(0);
    return(
        <>
            {
                (state == 0) ?
                <>
                    <button onClick={() => setValue(1)} className="text-white bg-emerald-700 ml-3 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 mt-2">
                        Open Contract
                    </button>
                    <button onClick={() => setValueExtra(1)} className="text-white bg-red-700 ml-3 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mt-2">
                        Cancel Contract
                    </button>
                </>
                :
                <CancelContract setValue={setValueExtra} {...props}/>
            }
        </>
    )
}


export const ContractorOpen = ( props:ContractProps ) => {
    const [state, setValue] = useState(0);
    return (
        <>
            {
                (state == 0) ? <ChangeStateOpen setValue={setValue} {...props}/> : <OpenContract setValue={setValue} {...props}/>
            }
        </>
    )
}
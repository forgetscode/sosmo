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

const CompleteContract = ({ setValue, ...props }: ChangeStateProps) => {
    
    const [ updateState ] = useUpdateStateMutation();
    return (
        <>
            <button onClick={async () => {
                    {
                        const {errors} = await updateState({
                            variables: {
                                id: props.postid,
                                state: "completed",
                            }
                        });
                    }
                }}
                className="text-white bg-emerald-700 ml-3 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 mt-2">
                Confirm Completion
            </button>
            <button onClick={() => setValue(0)} className="text-white bg-slate-700 ml-3 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-blue-800 mt-2">
                Go Back
            </button>
        </>
    );
}

const ChangeStateAcceptedDispute = ({ setValue, ...props }: ChangeStateProps) => {
    const [state, setValueExtra] = useState(0);
    return(
        <>
            {
                (state == 0) ?
                <>
                    <button onClick={() => setValue(1)} className="text-white bg-emerald-700 ml-3 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 mt-2">
                        Complete Contract
                    </button>
                    <button onClick={() => setValueExtra(1)} className="text-white bg-red-700 ml-3 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mt-2">
                        Dispute Contract
                    </button>
                </>
                :
                <DisputeContract setValue={setValueExtra} {...props}/>
            }
        </>
    )
}

const DisputeContract = ({ setValue, ...props }: ChangeStateProps) => {
    
    const [ updateState ] = useUpdateStateMutation();
    return (
        <>
            <button onClick={async () => {
                    {
                        const {errors} = await updateState({
                            variables: {
                                id: props.postid,
                                state: "disputed",
                            }
                        });
                    }
                }}
                className="text-white bg-red-700 ml-3 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 mt-2">
                Confirm Dispute
            </button>
            <button onClick={() => setValue(0)} className="text-white bg-slate-700 ml-3 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-blue-800 mt-2">
                Go Back
            </button>
        </>
    );
}

export const ContractorAccepted = ( props:ContractProps ) => {
    const [state, setValue] = useState(0);
    return (
        <>
            {
                (state == 0) ? <ChangeStateAcceptedDispute setValue={setValue} {...props}/> : <CompleteContract setValue={setValue} {...props}/>
            }
        </>
    )
}

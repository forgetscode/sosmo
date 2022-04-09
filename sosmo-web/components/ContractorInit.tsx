import { Formik, Form, Field } from "formik";
import { useState } from "react";
import { useUpdateStateMutation } from "../generated/graphql";
import * as anchor from '@project-serum/anchor';
import { PublicKey } from "@solana/web3.js";
import { CreateWorkspace, getPDA } from "./CreateWorkspace";
import { txNotification, errorNotification, loaderNotification } from "./utils";

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
    const workspace = CreateWorkspace();
    return(
        <>
            <Formik
                initialValues={{amount_guranteed:"", amount_total:""}}
                onSubmit={async (values) => {

                    if (values.amount_total == ""){
                        errorNotification("Please input a total amount.", "");
                    }

                    else if (parseInt(values.amount_guranteed) > parseInt(values.amount_total) ){
                        errorNotification("Invalid inputs", "Guranteed amount cannot exceed total amount");
                    }
                    else{
                        const amount_total = await new anchor.BN(parseFloat(values.amount_total)* (1000000000));
                        const amount_gurantee = await new anchor.BN(parseFloat(values.amount_guranteed)* (1000000000));
                        
                        if(workspace.wallet.publicKey !=null){
                            

                            const buffer = await new PublicKey(props.discriminator);
                            const contractPDA = await getPDA(buffer, workspace);

                            loaderNotification();

                            try{
                                const tx = await workspace.program.rpc.initialize(buffer, amount_gurantee, amount_total,  {
                                accounts:{
                                    contract: contractPDA!,
                                    contractor: workspace.wallet.publicKey,
                                    systemProgram: anchor.web3.SystemProgram.programId,
                                    }
                                }, );

                                const confirmation = await workspace.connection.confirmTransaction(tx, 'processed');

                                if(!confirmation.value.err){
                                    const {errors} = await updateState({
                                        variables: {
                                            id: props.postid,
                                            state: "initialized",
                                        }
                                    });
                                    if (errors){
                                        errorNotification("CAUTION", "The server could not be reached, do not proceed");
                                    }
                                }
                                else{
                                    errorNotification("blockchain transaction failed", confirmation.value.err.toString());
                                }

                                //success
                                txNotification(tx);

                                }

                            catch{
                                errorNotification("Transaction cancelled", "");
                            }

                        }
                        else{
                            errorNotification("workspace could not load", "confirm your connection and try again!");
                        }
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
                                        <button onSubmit={() => setValue(0)} className="blue-button"
                                            type="submit"
                                        >
                                            Submit
                                        </button>
                                        <button  onClick={() => setValue(0)} className="grey-button"
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
            <button onClick={() => setValue(1)} className="blue-button">
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
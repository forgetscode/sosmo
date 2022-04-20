import * as anchor from '@project-serum/anchor';
import { PublicKey} from "@solana/web3.js";
import { Formik, Form, Field } from "formik";
import { useState } from "react";
import { useUpdateStateMutation } from "../generated/graphql";
import { CreateWorkspace, getPDA } from "./CreateWorkspace";
import { errorNotification, loaderNotification, txNotification } from "./utils";

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
    const workspace = CreateWorkspace();
    return (
        <>
            <button onClick={async () => {
                if(workspace.wallet.publicKey !=null){
                    const buffer = await new PublicKey(props.discriminator);
                    const contractPDA = await getPDA(buffer, workspace);

                    loaderNotification();

                    try{
                        const tx = await workspace.program.rpc.cancel({
                            accounts:{
                                contract: contractPDA!,
                                destination:workspace.wallet.publicKey,
                            }
                        })
                        const confirmation = await workspace.connection.confirmTransaction(tx, 'processed');

                        if(!confirmation.value.err){
                            const {errors} = await updateState({
                                variables: {
                                    id: props.postid,
                                    state: "uninitialized",
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
                    catch(err:any){
                        if (err.toString().includes("0x1")){
                            errorNotification("Transaction cancelled", "Insufficient funds");
                        }
                        else if (err.toString().includes("User rejected the request.")){
                            errorNotification("Transaction cancelled", "");
                        }
                        else{   
                            errorNotification("Transaction cancelled", err.toString());
                        }
                    }
                }
                else{
                    errorNotification("workspace could not load", "confirm your connection and try again!");
                }              
            }}
                className="blue-button ml-1">
                Confirm cancellation
            </button>
            <button onClick={() => setValue(0)} className="grey-button">
                Go Back
            </button>
        </>
    );
}


const OpenContract = ({ setValue, ...props }: ChangeStateProps) => {
    const [ updateState ] = useUpdateStateMutation();
    const workspace = CreateWorkspace();
    return(
        <>
            <Formik
                initialValues={{open_to:""}}
                onSubmit={async (values) => {
                    if (values.open_to.length == 0){
                        if(workspace.wallet.publicKey !=null){

                            const buffer = await new PublicKey(props.discriminator);
                            const contractPDA = await getPDA(buffer, workspace);

                            loaderNotification();
                            
                            try{
                                const tx = await workspace.program.rpc.open({
                                    accounts:{
                                        contract: contractPDA!,
                                        contractor:workspace.wallet.publicKey,
                                    }
                                })
                                const confirmation = await workspace.connection.confirmTransaction(tx, 'processed');
            
                                if(!confirmation.value.err){
                                    const {errors} = await updateState({
                                        variables: {
                                            id: props.postid,
                                            state: "open",
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
                            catch(err:any){
                                if (err.toString().includes("0x1")){
                                    errorNotification("Transaction cancelled", "Insufficient funds");
                                }
                                else if (err.toString().includes("User rejected the request.")){
                                    errorNotification("Transaction cancelled", "");
                                }
                                else{   
                                    errorNotification("Transaction cancelled", err.toString());
                                }
                            }
                        }    
                        else{
                            errorNotification("workspace could not load", "confirm your connection and try again!");
                        }        
                    }
                    else if (values.open_to.length >= 32 && values.open_to.length <= 44 ){
                        if(workspace.wallet.publicKey !=null){
                            const buffer = await new PublicKey(props.discriminator);
                            
                            const contractee = await new PublicKey(values.open_to);
                            
                            const contractPDA = await getPDA(buffer, workspace);

                            loaderNotification();

                            try{
                                const tx = await workspace.program.rpc.openTo( contractee, {
                                    accounts:{
                                        contract: contractPDA!,
                                        contractor:workspace.wallet.publicKey,
                                    }
                                })
                                const confirmation = await workspace.connection.confirmTransaction(tx, 'processed');
            
                                if(!confirmation.value.err){
                                    const {errors} = await updateState({
                                        variables: {
                                            id: props.postid,
                                            state: "opento",
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
                            catch(err:any){
                                if (err.toString().includes("0x1")){
                                    errorNotification("Transaction cancelled", "Insufficient funds");
                                }
                                else if (err.toString().includes("User rejected the request.")){
                                    errorNotification("Transaction cancelled", "");
                                }
                                else{   
                                    errorNotification("Transaction cancelled", err.toString());
                                }
                            }
                        }  
                        else{
                            errorNotification("workspace could not load", "confirm your connection and try again!");
                        }          
                    }
                    else{
                        errorNotification("Invalid address", "must a valid Public Key address");
                    }
                    () => setValue(0);
                }}
            >
                {({ values, isSubmitting }) => (
                        <div className="box-border w-f border-2 border-slate-600 shadow-lg rounded-lg p-4">
                            <Form>
                                    <div className="flex flex-col p-4">
                                        <p className='text-black mb-1 text-m font-medium'>Open to specific address(Leave empty to open to all)</p>
                                        <Field
                                            className=" p-3  border-2 border-slate-900 rounded-lg font-mono"
                                            placeholder='Address'
                                            name='open_to'
                                            label='open_to'
                                        />
                                        <div className="m-4"/>
                                    </div>
                                    <div className="-mt-8 mb-4">
                                        <button  onSubmit={() => setValue(0)} className="blue-button ml-4"
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

const ChangeStateOpen = ({ setValue, ...props }: ChangeStateProps) => {
    const [state, setValueExtra] = useState(0);
    return(
        <>
            {
                (state == 0) ?
                <>
                    <button onClick={() => setValue(1)} className="blue-button">
                        Open Contract
                    </button>
                    <button onClick={() => setValueExtra(1)} className="grey-button">
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
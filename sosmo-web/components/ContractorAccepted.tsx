import { PublicKey } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useUpdateStateMutation } from "../generated/graphql";
import * as anchor from '@project-serum/anchor';
import { program } from "@project-serum/anchor/dist/cjs/spl/token";
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

type GetContractee = PublicKey;

const CompleteContract = ({ setValue, ...props }: ChangeStateProps) => {
    const [ updateState ] = useUpdateStateMutation();
    const workspace = CreateWorkspace();

    const [data, setData] = useState<GetContractee>();
    const [isLoading, setIsLoading] = useState(true);

    const fetchdata = async () =>{
        const buffer = await new PublicKey(props.discriminator);
        const contractPDA = await getPDA(buffer, workspace);

        const result = await workspace.program.account.contract.fetch(contractPDA!);
        const contractee_open = result.contractee;
        setData(contractee_open);
    }
    
    useEffect(() => {
        fetchdata().then(() => {
            setIsLoading(false)
        });
    }, []);

    if ( isLoading) {
        return(
                <div> ... loading... </div>
        );
    }

    const contractee = new PublicKey(data!);
    
    return (
        <>
            <button onClick={async () => {
                    if(workspace.wallet.publicKey !=null){
        
                        try{
                            const buffer = await new PublicKey(props.discriminator);
                            const contractPDA = await getPDA(buffer, workspace);

                            loaderNotification();

                            const tx = await workspace.program.rpc.complete({
                                accounts: {
                                contract: contractPDA!,
                                contractee: contractee,
                                destination: workspace.wallet.publicKey,
                                systemProgram: anchor.web3.SystemProgram.programId,
                                },
                            });
                            const confirmation = await workspace.connection.confirmTransaction(tx, 'processed');
        
                            if(!confirmation.value.err){
                                const {errors} = await updateState({
                                    variables: {
                                        id: props.postid,
                                        state: "completed",
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
                className="blue-button bg-blue-700">
                Confirm Completion
            </button>
            <button onClick={() => setValue(0)} className="text-white bg-slate-700 ml-3 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-blue-800 mt-2 border-2 border-slate-900">
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
                    <button onClick={() => setValue(1)} className="blue-button mr-3">
                        Complete Contract
                    </button>
                    <button onClick={() => setValueExtra(1)} className="blue-button bg-cyan-700 hover:bg-cyan-800">
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
    const workspace = CreateWorkspace();

    const [data, setData] = useState<GetContractee>();
    const [isLoading, setIsLoading] = useState(true);

    const fetchdata = async () =>{
        const buffer = await new PublicKey(props.discriminator);
        const contractPDA = await getPDA(buffer, workspace);
    
        const result = await workspace.program.account.contract.fetch(contractPDA!);
        const contractee_open = result.contractee;
        setData(contractee_open);
    }

    useEffect(() => {
        fetchdata().then(() => {
            setIsLoading(false)
        });
    }, []);

    if ( isLoading) {
        return(
                <div> ... loading... </div>
        );
    }

    const contractee = new PublicKey(data!);
    
    return (
        <>
            <button onClick={async () => {
                    if(workspace.wallet.publicKey !=null){

                        const buffer = await new PublicKey(props.discriminator);
                        const contractPDA = await getPDA(buffer, workspace);

                        loaderNotification();

                        try{
                            const tx = await workspace.program.rpc.dispute({
                                accounts: {
                                contract: contractPDA!,
                                contractee: contractee,
                                destination: workspace.wallet.publicKey,
                                systemProgram: anchor.web3.SystemProgram.programId,
                                },
                            });
                            const confirmation = await workspace.connection.confirmTransaction(tx, 'processed');
        
                            if(!confirmation.value.err){
                                const {errors} = await updateState({
                                    variables: {
                                        id: props.postid,
                                        state: "disputed",
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
                }}
                className="red-button">
                Confirm Dispute
            </button>
            <button onClick={() => setValue(0)} className="text-white bg-slate-700 ml-3 hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-blue-800 mt- border-2 border-slate-900">
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
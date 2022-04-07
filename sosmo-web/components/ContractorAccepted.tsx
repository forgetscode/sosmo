import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, clusterApiUrl, Connection } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useUpdateStateMutation } from "../generated/graphql";
import { Agreement } from "../target/types/agreement";
import * as anchor from '@project-serum/anchor';
import  idl from '../target/idl/agreement.json';

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
    const wallet = useWallet();
    const programID = new PublicKey(idl.metadata.address);              
    const network = clusterApiUrl('devnet');
    const connection = new Connection(network, "processed");
    const provider = new anchor.Provider(connection, wallet as any, "processed" as any);
    const program = new anchor.Program<Agreement>(idl as any, programID, provider);
    const buffer = new PublicKey(props.discriminator);

    const [data, setData] = useState<GetContractee>();
    const [isLoading, setIsLoading] = useState(true);


    const fetchdata = async () =>{
        const [contractPDA, _ ] = await PublicKey
        .findProgramAddress(
            [
            anchor.utils.bytes.utf8.encode("contract_acc"),
            wallet.publicKey!.toBuffer(),
            buffer.toBuffer(),
            ],
            programID
        );
    
        const result = await program.account.contract.fetch(contractPDA);
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
                    if(wallet.publicKey !=null){
        
                        const [contractPDA, _ ] = await PublicKey
                        .findProgramAddress(
                          [
                            anchor.utils.bytes.utf8.encode("contract_acc"),
                            wallet.publicKey.toBuffer(),
                            buffer.toBuffer(),
                          ],
                          programID
                        );
                        const tx = await program.rpc.complete({
                            accounts: {
                              contract: contractPDA,
                              contractee: contractee,
                              destination: wallet.publicKey,
                              systemProgram: anchor.web3.SystemProgram.programId,
                            },
                          });
                        const confirmation = await connection.confirmTransaction(tx, 'processed');
    
                        if(!confirmation.value.err){
                            const {errors} = await updateState({
                                variables: {
                                    id: props.postid,
                                    state: "completed",
                                }
                            });
                        }
                        else{
                            window.alert("Error transaction failed!");
                        }  
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
    const wallet = useWallet();
    const programID = new PublicKey(idl.metadata.address);              
    const network = clusterApiUrl('devnet');
    const connection = new Connection(network, "processed");
    const provider = new anchor.Provider(connection, wallet as any, "processed" as any);
    const program = new anchor.Program<Agreement>(idl as any, programID, provider);
    const buffer = new PublicKey(props.discriminator);

    const [data, setData] = useState<GetContractee>();
    const [isLoading, setIsLoading] = useState(true);

    const fetchdata = async () =>{
        const [contractPDA, _ ] = await PublicKey
        .findProgramAddress(
            [
            anchor.utils.bytes.utf8.encode("contract_acc"),
            wallet.publicKey!.toBuffer(),
            buffer.toBuffer(),
            ],
            programID
        );
    
        const result = await program.account.contract.fetch(contractPDA);
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
                    if(wallet.publicKey !=null){
        
                        const [contractPDA, _ ] = await PublicKey
                        .findProgramAddress(
                          [
                            anchor.utils.bytes.utf8.encode("contract_acc"),
                            wallet.publicKey.toBuffer(),
                            buffer.toBuffer(),
                          ],
                          programID
                        );
                        const tx = await program.rpc.dispute({
                            accounts: {
                              contract: contractPDA,
                              contractee: contractee,
                              destination: wallet.publicKey,
                              systemProgram: anchor.web3.SystemProgram.programId,
                            },
                          });
                        const confirmation = await connection.confirmTransaction(tx, 'processed');
    
                        if(!confirmation.value.err){
                            const {errors} = await updateState({
                                variables: {
                                    id: props.postid,
                                    state: "disputed",
                                }
                            });
                        }
                        else{
                            window.alert("Error transaction failed!");
                        }  
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

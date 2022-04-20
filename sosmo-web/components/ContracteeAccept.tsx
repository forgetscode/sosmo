import * as anchor from '@project-serum/anchor';
import { PublicKey } from "@solana/web3.js";
import { useUpdateStateMutation } from "../generated/graphql";
import { useEffect, useState } from "react";
import { CreateWorkspace } from "./CreateWorkspace";
import { loaderNotification, errorNotification, txNotification } from './utils';

interface ContractProps {
    postid:number,
    discriminator: string,
    contractor: string,
    state: string,
}

type UserData = [ number, number, PublicKey ];


const checkKey = (contractee:PublicKey, wallet_pub_key:PublicKey) => {
    if (contractee.toBase58() == wallet_pub_key.toBase58()){
        return true;
    }
    else if (contractee.toBase58() != wallet_pub_key.toBase58()){
        return false;
    }
    return true;
}


export const ContracteeAccept = ( props:ContractProps ) => {
    const [ updateState ] = useUpdateStateMutation();
    const workspace = CreateWorkspace();

    const [data, setData] = useState<UserData>();
    const [isLoading, setIsLoading] = useState(true);

    const fetchdata = async () =>{

        const buffer = await new PublicKey(props.discriminator);
        const contractor = await new PublicKey(props.contractor);

        const [contractPDA, _ ] = await PublicKey
        .findProgramAddress(
            [
            anchor.utils.bytes.utf8.encode("contract_acc"),
            contractor.toBuffer(),
            buffer.toBuffer(),
            ],
            workspace.programID
        );
    
        const result = await workspace.program.account.contract.fetch(contractPDA);
        const amount_total = result.amountTotal.toNumber()/(1000000000)
        const amount_gurantee = result.amountGuranteed.toNumber()/(1000000000);
        const contractee_open = result.contractee;

        setData( [amount_total, amount_gurantee, contractee_open] )
    }

    useEffect(() => {
        fetchdata().then(() => {
            setIsLoading(false)
        });
    }, []);

    if ( isLoading) {
            return(
                <div></div>
            );
    }
    if (props.state =="opento"){
        if (checkKey(data![2], workspace.wallet.publicKey as any)){
            return (
                <div className='flex flex-col'>
                    <div className='ml-3 bg-slate-700 p-4 rounded-md mb-2'>
                        <p className="text-blue-600 mb-2  text-lg">Contract Details</p> 
                        <p className="text-white mb-1"> Total Amount: {data![0]} Sol </p>
                        <p className="text-white mb-2"> Amount Guranteed: {data![1]} Sol </p>
                    </div>
                    <button className="mr-auto blue-button"
                        onClick={async () => {
                            if(workspace.wallet.publicKey !=null){
        
                                const contractor = await new PublicKey(props.contractor);
                                const buffer = await new PublicKey(props.discriminator);

                                
                                const [contractPDA, _ ] = await PublicKey
                                .findProgramAddress(
                                  [
                                    anchor.utils.bytes.utf8.encode("contract_acc"),
                                    contractor.toBuffer(),
                                    buffer.toBuffer(),
                                  ],
                                  workspace.programID
                                );

                                loaderNotification();

                                try{
                                    const tx = await workspace.program.rpc.accept({
                                        accounts:{
                                            contract: contractPDA,
                                            contractee:workspace.wallet.publicKey,
                                        }
                                    })
                                    const confirmation = await workspace.connection.confirmTransaction(tx, 'processed');
                
                                    if(!confirmation.value.err){
                                        const {errors} = await updateState({
                                            variables: {
                                                id: props.postid,
                                                state: "accepted",
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
                    >
                        Accept terms
                    </button>
                </div>
            )
        }
    }
    else if (props.state == "open"){
        return (
            <div className='flex flex-col'>
                <div className=' bg-slate-700 p-4 rounded-md mb-2'>
                    <p className="text-blue-300 mb-2  text-lg font-mono">Contract Details</p> 
                    <p className="text-white mb-1 font-mono"> Total Amount: {data![0]} Sol </p>
                    <p className="text-white mb-2 font-mono"> Amount Guranteed: {data![1]} Sol </p>
                </div>
                <button className="mr-auto blue-button"
                    onClick={async () => {
                        if(workspace.wallet.publicKey !=null){
    
                            const contractor = await new PublicKey(props.contractor);
                            const buffer = await new PublicKey(props.discriminator);

                            
                            const [contractPDA, _ ] = await PublicKey
                            .findProgramAddress(
                              [
                                anchor.utils.bytes.utf8.encode("contract_acc"),
                                contractor.toBuffer(),
                                buffer.toBuffer(),
                              ],
                              workspace.programID
                            );

                            loaderNotification();

                            try{
                                const tx = await workspace.program.rpc.accept({
                                    accounts:{
                                        contract: contractPDA,
                                        contractee:workspace.wallet.publicKey,
                                    }
                                })
                                const confirmation = await workspace.connection.confirmTransaction(tx, 'processed');
            
                                if(!confirmation.value.err){
                                    const {errors} = await updateState({
                                        variables: {
                                            id: props.postid,
                                            state: "accepted",
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
                >
                    Accept terms
                </button>
            </div>
        )
    }
    return (
        <>
        </>
    )
}
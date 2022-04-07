import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from '@project-serum/anchor';
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useUpdateStateMutation } from "../generated/graphql";
import  idl from '../target/idl/agreement.json';
import { Agreement } from '../target/types/agreement';
import { useEffect, useState } from "react";

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
    const wallet = useWallet();

    const programID = new PublicKey(idl.metadata.address);              
    const network = clusterApiUrl('devnet');
    const connection = new Connection(network, "processed");
    const provider = new anchor.Provider(connection, wallet as any, "processed" as any);
    const program = new anchor.Program<Agreement>(idl as any, programID, provider);
    const buffer = new PublicKey(props.discriminator);
    const contractor = new PublicKey(props.contractor);

    const [data, setData] = useState<UserData>();
    const [isLoading, setIsLoading] = useState(true);

    const fetchdata = async () =>{
        const [contractPDA, _ ] = await PublicKey
        .findProgramAddress(
            [
            anchor.utils.bytes.utf8.encode("contract_acc"),
            contractor.toBuffer(),
            buffer.toBuffer(),
            ],
            programID
        );
    
        const result = await program.account.contract.fetch(contractPDA);
        const amount_total = result.amountTotal.toNumber()/(1000000000)
        const amount_gurantee = result.amountGuranteed.toNumber()/(1000000000);
        const contractee_open = result.contractee;
        const _data = [amount_total, amount_gurantee, contractee_open];
        console.log(result);
        setData( [amount_total, amount_gurantee, contractee_open] )
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
    if (props.state =="opento"){
        if (checkKey(data![2], wallet.publicKey as any)){
            return (
                <div className='flex flex-col'>
                    <div className='ml-3 bg-slate-700 p-4 rounded-md mb-2'>
                        <p className="text-green-600 mb-2  text-lg">Contract Details</p> 
                        <p className="text-white mb-1"> Total Amount: {data![0]} Sol </p>
                        <p className="text-white mb-2"> Amount Guranteed: {data![1]} Sol </p>
                    </div>
                    <button className="mr-auto text-white bg-emerald-700 ml-3 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 mt-2"
                        onClick={async () => {
                            if(wallet.publicKey !=null){
        
                                const [contractPDA, _ ] = await PublicKey
                                .findProgramAddress(
                                  [
                                    anchor.utils.bytes.utf8.encode("contract_acc"),
                                    contractor.toBuffer(),
                                    buffer.toBuffer(),
                                  ],
                                  programID
                                );
                                const tx = await program.rpc.accept({
                                    accounts:{
                                        contract: contractPDA,
                                        contractee:wallet.publicKey,
                                    }
                                })
                                const confirmation = await connection.confirmTransaction(tx, 'processed');
            
                                if(!confirmation.value.err){
                                    const {errors} = await updateState({
                                        variables: {
                                            id: props.postid,
                                            state: "accepted",
                                        }
                                    });
                                }
                                else{
                                    window.alert("Error transaction failed!");
                                }  
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
                <div className='ml-3 bg-slate-700 p-4 rounded-md mb-2'>
                    <p className="text-green-600 mb-2  text-lg">Contract Details</p> 
                    <p className="text-white mb-1"> Total Amount: {data![0]} Sol </p>
                    <p className="text-white mb-2"> Amount Guranteed: {data![1]} Sol </p>
                </div>
                <button className="mr-auto text-white bg-emerald-700 ml-3 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 mt-2"
                        onClick={async () => {
                            if(wallet.publicKey !=null){
        
                                const [contractPDA, _ ] = await PublicKey
                                .findProgramAddress(
                                  [
                                    anchor.utils.bytes.utf8.encode("contract_acc"),
                                    contractor.toBuffer(),
                                    buffer.toBuffer(),
                                  ],
                                  programID
                                );
                                const tx = await program.rpc.accept({
                                    accounts:{
                                        contract: contractPDA,
                                        contractee: wallet.publicKey,
                                    }
                                })
                                const confirmation = await connection.confirmTransaction(tx, 'processed');
            
                                if(!confirmation.value.err){
                                    const {errors} = await updateState({
                                        variables: {
                                            id: props.postid,
                                            state: "accepted",
                                        }
                                    });
                                }
                                else{
                                    window.alert("Error transaction failed!");
                                }  
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

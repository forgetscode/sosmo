import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from '@project-serum/anchor';
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { useUpdateStateMutation } from "../generated/graphql";
import  idl from '../target/idl/agreement.json';
import { Agreement } from '../target/types/agreement';

interface ContractProps {
    postid:number,
    discriminator: string,
    contractor: string,
    state: string,
}

export const ContracteeAccept = ( props:ContractProps ) => {
    const [ updateState ] = useUpdateStateMutation();
    const wallet = useWallet();
    const programID = new PublicKey(idl.metadata.address);              
    const network = clusterApiUrl('devnet');
    const connection = new Connection(network, "processed");
    const provider = new anchor.Provider(connection, wallet, "processed");
    const program = new anchor.Program<Agreement>(idl, programID, provider);

    let data = async () =>{
        const buffer = new PublicKey(props.discriminator);
        const contractor = new PublicKey(props.contractor);

        const [contractPDA, _ ] = await PublicKey
        .findProgramAddress(
          [
            anchor.utils.bytes.utf8.encode("contract_acc"),
            contractor.toBuffer(),
            buffer.toBuffer(),
          ],
          programID
        );
        return data;
    }
    
    return (
        <div className='flex flex-col'>
            <p className='ml-3 text-green-600 bg-slate-700 p-4 rounded-md'>{data}</p>
            <button className="mr-auto text-white bg-emerald-700 ml-3 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 mt-2"
                onClick={async () => {
                    {
                        const {errors} = await updateState({
                            variables: {
                                id: props.postid,
                                state: "accepted",
                            }
                        });
                    }
                }}
            >
                Accept terms
            </button>
        </div>
    )
}

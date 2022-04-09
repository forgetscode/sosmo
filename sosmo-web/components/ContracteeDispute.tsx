import { PublicKey} from "@solana/web3.js";
import { useEffect, useState } from "react";
import { useUpdateStateMutation } from "../generated/graphql";
import * as anchor from '@project-serum/anchor';
import { CreateWorkspace } from "./CreateWorkspace";
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
 
type GetContractee = PublicKey;
  
const DisputeContract = ({ setValue, ...props }: ChangeStateProps) => {
    const [ updateState ] = useUpdateStateMutation();
    const workspace = CreateWorkspace();

    const [data, setData] = useState<GetContractee>();
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
    return (
        <>
            <button onClick={async () => {
                    if(workspace.wallet.publicKey !=null){

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

                        loaderNotification();

                        try{
                            const tx = await workspace.program.rpc.userDispute({
                                accounts:{
                                    contract: contractPDA,
                                    contractee: workspace.wallet.publicKey,
                                    destination: contractor,
                                    systemProgram: anchor.web3.SystemProgram.programId,
                                }
                            })
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
                className="red-button -ml-1">
                Confirm dispute
            </button>
            <button onClick={() => setValue(0)} className="grey-button ml-6">
                Go Back
            </button>
        </>
    );
}

const ChangeState = ({ setValue, ...props }: ChangeStateProps) => {
    return(
        <>
            <button onClick={() => setValue(1)} className="blue-button">
                Dispute contract
            </button>
        </>
    )
}


export const ContracteeDispute = ( props:ContractProps ) => {
    const [state, setValue] = useState(0);
    return (
        <>
            {
                (state == 0) ? <ChangeState setValue={setValue} {...props}/> : <DisputeContract setValue={setValue} {...props}/>
            }
        </>
    )
}
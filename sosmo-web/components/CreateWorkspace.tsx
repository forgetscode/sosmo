import { PublicKey, clusterApiUrl, Connection } from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import  idl from '../target/idl/agreement.json';
import { Agreement } from '../target/types/agreement';
import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import swal from 'sweetalert';

type Workspace =  {
    wallet: WalletContextState;
    programID: PublicKey;
    network: string;
    connection: Connection;
    provider: anchor.Provider;
    program: anchor.Program<Agreement>;
}

export const getPDA = async (bufferKey:PublicKey, workspace:Workspace ) => {
    if (!workspace || !bufferKey){
        swal("PDA could not be created", "workspace or buffer was not provided.", "error");
        return null;
    }
    const buffer = new PublicKey(bufferKey);

    const [contractPDA, _ ] = await PublicKey
    .findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("contract_acc"),
        workspace.wallet.publicKey!.toBuffer(),
        buffer.toBuffer(),
      ],
      workspace.programID
    );

    return contractPDA;
}


export const CreateWorkspace = () => {
    const wallet = useWallet();
    const programID = new PublicKey(idl.metadata.address);              
    const network = clusterApiUrl('devnet');
    const connection = new Connection(network, "processed");
    const provider = new anchor.Provider(connection, wallet as any, "processed" as any);
    const program = new anchor.Program<Agreement>(idl as any, programID, provider);
    const WorkspaceObject = {wallet, programID, network, connection, provider, program}
    return WorkspaceObject;
}


import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import React, { FC, useCallback } from 'react';
import { useCreateUserMutation, useLoginMutation, useLogoutMutation, useMeQuery, useUserQuery } from '../generated/graphql';

export const SendOne: FC = ({ children }) => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [ register ] = useCreateUserMutation();
    const [ login ] = useLoginMutation();
    const [ logout ] = useLogoutMutation();
    const { data, error, loading} = useMeQuery();

    let savedPublicKey = "test";

    if (publicKey){
        savedPublicKey = publicKey.toString();
    }

    const onClick = useCallback(async () => {
        if (!publicKey) throw new WalletNotConnectedError();

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: Keypair.generate().publicKey,
                lamports: 0,
            })
        );

        const signature = await sendTransaction(transaction, connection);

        const status = await connection.confirmTransaction(signature, 'processed');
        if (status.value.err === null){
            console.log("transasction signature success!");
            console.log({children});

        }
        else{
            console.log("transasction signature error");
        }

        try{
            const accountStatus = await register({
                variables:{
                    publicKey:savedPublicKey
                }
            })
            console.log("user registered");
        }
        catch{
            console.log("user already registered");
        }

        if (savedPublicKey != "test"){
            try{
                const loginStatus = await login({
                    variables:{
                        publicKey:savedPublicKey
                    }
                });
                console.log("user logged in: ", loginStatus);
            }
            catch{
                console.log("user already logged in");
            }
        }

    }, [publicKey, sendTransaction, connection]);

    async function Logout() {

        try{
            const res = await data;
            console.log(res);
        }
        catch{
            console.log("???");
        }

        /*
        try{
            await logout();
            console.log("logged out");
        }
        catch{
            console.log("already logged out");
        }
        */
    }

    return (
        <>
        <button onClick={onClick} disabled={!publicKey} 
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow m-auto" 
        >
            Sign transaction!
        </button>
        <button onClick={Logout} disabled={!publicKey} 
        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow m-auto" 
        >
        logout!
        </button>
        </>
    );
};

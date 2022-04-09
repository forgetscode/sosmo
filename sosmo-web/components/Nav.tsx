import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import React, { FC, useEffect, useState } from 'react';
import { useCreateUserMutation, useLoginMutation, useLogoutMutation } from "../generated/graphql";
import Image from 'next/image';



const SessionManager = () => {
  const { publicKey, connected } = useWallet();
  const [ register ] = useCreateUserMutation();
  const [ login ] = useLoginMutation();
  const [ logout ] = useLogoutMutation();
  const [ hasConnectedBefore, setHasConnectedBefore ] = useState(false);
  useEffect(() => {
      async function processUser() {
        if (connected) {
            setHasConnectedBefore(connected);
          try{
            const loginStatus = await login({
                variables:{
                    publicKey:publicKey!.toString()
                }
            });
            console.log("user logged in");
          }
          catch{
              try{
                const accountStatus = await register({
                    variables:{
                        publicKey:publicKey!.toString()
                    }
                })
                console.log("user registered");
              }
              catch{
                console.log("user already registered");
              }
          }
        } 
        else if (hasConnectedBefore) {
          try{
            await logout();
            console.log("logged out");
          }
          catch{
            console.log("already logged out");
          }
        }
      }
  processUser();
  }, [ connected ]);
  return (
    <>
        <WalletMultiButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"/>
    </>
  );
};


export const Nav:FC= ({children}) => {

    return (
        <div >
            <div className="max-w-7xl mx-auto px-4 mb-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center ">
                    <Image
                      className="h-12 w-12"
                      src="https://www.svgrepo.com/show/393896/avatar-17.svg"
                      width={48}
                      height={48}     
                    />
                      <Link href="/">
                            <a
                                href="#"
                                className="hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-m font-medium ml-2 mt-auto"
                            >
                                Dashboard
                            </a>
                      </Link>
                </div>
                <div className="mt-2">
                  <SessionManager/>
                </div>
              </div>
            </div>
          <div className="w-full border-t border-gray-300"/>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex">
              <Link href="/create-post">
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  mr-auto" >
                  Create Listing
                </button>
              </Link>
            </div>
            <div className="w-full border-t border-gray-300"/>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
            </div>
        </div>
      );
}
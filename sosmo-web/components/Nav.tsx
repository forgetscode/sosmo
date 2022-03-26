import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import Link from "next/link";
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useCreateUserMutation, useLoginMutation, useLogoutMutation } from "../generated/graphql";



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
        <div>
          <nav className="bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12"
                      src="https://www.svgrepo.com/show/393896/avatar-17.svg"
                      alt="Workflow"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-5 flex items-baseline ">
                      <a
                        href="#"
                        className=" hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Dashboard
                      </a>
                      <Link href="/">
                            <a
                                href="#"
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Home
                            </a>
                      </Link>
                    </div>
                  </div>
                </div>
                <SessionManager/>
                <div className="-mr-2 flex md:hidden">
                </div>
              </div>
            </div>
          </nav>
          <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex">
              <h1 className="text-4xl font-bold text-gray-900">
                  Sosmo
              </h1>
              <p className=" ml-2 mt-auto text-xs text-gray-400">Blockchain posting</p>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex justify-center items-center">
                    {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      );
}
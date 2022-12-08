import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import React, { FC, useEffect, useState } from 'react';
import { useCreateUserMutation, useLoginMutation, useLogoutMutation, useMeQuery } from "../generated/graphql";
import Image from 'next/image';
import { EmailIcon } from '@chakra-ui/icons'



const SessionManager = (userData:any) => {
  const { publicKey, connected } = useWallet();
  const [ register ] = useCreateUserMutation();
  const [ login ] = useLoginMutation();
  const [ logout ] = useLogoutMutation();
  const [ hasConnectedBefore, setHasConnectedBefore ] = useState(false);
  
  useEffect(() => {
      async function processUser() {
        if (connected) {
            setHasConnectedBefore(connected);
            if(!userData.userData.me){
              try{
                await login({
                    variables:{
                        publicKey:publicKey!.toString()
                    }
                });
                console.log("user logged in");
              }
              catch{
                  try{
                    await register({
                        variables:{
                            publicKey:publicKey!.toString()
                        }
                    })
                    await login({
                        variables:{
                            publicKey:publicKey!.toString()
                        }
                    });
                    console.log("user registered");
                  }
                  catch{
                    console.log("user already registered");
                  }
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
        <WalletMultiButton className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full border-4 border-slate-800"/>
    </>
  );
};


export const Nav:FC= ({children}) => {
    const { data, loading, error } = useMeQuery();

    if ( loading ) {
      return(
          <div className='text-3xl flex h-screen justify-center items-center'></div>
      );
    }
    
    return (
        <>

          <div className="w-[100%] bg-white">
            <div className="max-w-7xl mx-auto px-4 mb-4">
              <div className="flex items-center justify-between h-16 ">

                <div className="flex items-center ml-2">
                    <Image
                      className="h-12 w-12"
                      src="https://www.svgrepo.com/show/53400/repair-guy-outline.svg"
                      width={48}
                      height={48}     
                    />
                      <Link href="/">
                            <a
                                href="#"
                                className="
                                p-1
                                delay-75
                                hover:bg-gray-900 hover:text-white px-3 py-2 rounded-md text-m font-medium ml-2 mt-auto
                                transition-colors duration-300 ease-in-out group-hover:text-white z-10
                                "
                            >
                                Dashboard
                            </a>
                      </Link>
                </div>

                <div className="mt-2 flex flex-row">
                  <div className="bg-white hover:bg-black rounded hover:text-white p-2 cursor-pointer transition-colors duration-300 ease-in-out mr-2">
                      <Link href="https://zelda-ten.vercel.app/" passHref>
                          <a target="_blank"  rel="noopener noreferrer">
                            <EmailIcon h={36} w={36}/>
                          </a>
                    </Link>
                  </div>
                  <SessionManager userData = {data}/>
                </div>

              </div>
            </div>
          <div className="w-full border-t border-slate-900"/>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex">
              <Link href="/create-post">
                <button className="blue-button md:ml-0 ml-3" >
                  Create Job
                </button>
              </Link>
            </div>
            <div className="w-full border-t border-slate-900"/>
        </div>

          <div className="sm:bg-zinc-100 min-h-screen">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
            </div>
          </div>
      </>
      );
}
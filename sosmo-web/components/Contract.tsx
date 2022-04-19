import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import { ContracteeAccept } from './ContracteeAccept';
import { ContracteeDispute } from './ContracteeDispute';
import { ContractorAccepted } from './ContractorAccepted';
import { ContractorInit } from './ContractorInit';
import { ContractorOpen } from './ContractorOpen';
import Image from 'next/image';
import Router from 'next/router'

interface ContractProps {
    postid:number,
    discriminator: string,
    contractor: string,
    state: string,
}

const Completed = () => {
    return (
        <div className="flex w-full rounded-lg border-2 border-slate-900 sm:bg-transparent sm:border-transparent">
            <div className="flex flex-row m-auto">
            <Image
                className="h-12 w-12"
                src="https://www.svgrepo.com/show/362151/sign-check.svg"
                alt="Workflow"
                width={48}
                height={48}  
            />
                <p className='m-auto text-lg font-mono'>Completed!</p>
            </div>
        </div>
    );
}

const Disputed = () => {
    return (
        <div className="flex w-full bg-white rounded-lg border-2 border-slate-900 sm:bg-transparent sm:border-transparent">
            <div className="flex flex-row m-auto p-2">
            <Image
                className="h-12 w-12"
                src="https://www.svgrepo.com/show/226123/file-cancel.svg"
                alt="Workflow"
                width={48}
                height={48}  
            />
                <p className='m-auto ml-1 text-lg font-mono'>Disputed</p>
            </div>
        </div>
    );
}

export const Contract= (props:ContractProps) => {
    const { publicKey, connected } = useWallet();

    if(props.state == "completed"){
        return(<Completed></Completed>);
    }
    if(props.state == "disputed"){
        return(<Disputed></Disputed>);
    }

    if (connected) {
        if (props.discriminator) {
            if(props.contractor == publicKey?.toString()){
                if (props.state == "uninitialized"){

                    return( <ContractorInit {...props}></ContractorInit>);
                }
                else if (props.state == "initialized"){
                    return( <ContractorOpen {...props}></ContractorOpen>);
                }
                else if (props.state == "open" ||props.state == "opento" ){
                    return( 
                        <>
                            <p className='md:text-slate-600 text-xs font-mono ml-2 mb-2'>Your contract is currently open but you may alter it before it is accepted.</p>
                            <ContractorOpen {...props}></ContractorOpen>
                        </>
                    );
                }
                else if (props.state == "accepted"){
                    return( <ContractorAccepted  {...props}></ContractorAccepted >);
                }
                else  {
                    return (<></>);
                }
            }
            else{
                if (props.state == "open" || props.state == "opento"  ){
                    
                    return( <ContracteeAccept {...props}></ContracteeAccept>);
                }
                if (props.state == "accepted"){
                    return( <ContracteeDispute {...props}></ContracteeDispute>);
                }
            }
        }
        else {
            return( 
                <>
                </>
            );
        }
    }
    return (
        <> 
        </>
    );

}
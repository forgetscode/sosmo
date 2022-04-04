import { useWallet } from '@solana/wallet-adapter-react';
import React from 'react';
import { ContractorAccepted } from './ContractorAccepted';
import { ContractorInit } from './ContractorInit';
import { ContractorOpen } from './ContractorOpen';

interface ContractProps {
    postid:number,
    discriminator: string,
    contractor: string,
    state: string,
}

const Completed = () => {
    return (
        <div className="flex w-full text-green-900 bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-base py-3.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800">
            <div className="flex flex-row m-auto">
            <img
                className="h-12 w-12"
                src="https://www.svgrepo.com/show/362151/sign-check.svg"
                alt="Workflow"
            />
                <p className='m-auto text-emerald'>Completed!</p>
            </div>
        </div>
    );
}


const Disputed = () => {
    return (
        <div className="flex w-full text-white bg-red-800  hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-base py-3.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
            <div className="flex flex-row m-auto">
            <img
                className="h-12 w-12"
                src="https://www.svgrepo.com/show/366631/cancel.svg"
                alt="Workflow"
            />
                <p className='m-auto text-red'>Disputed</p>
            </div>
        </div>
    );
}


export const Contract= (props:ContractProps): JSX.Element => {
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
                else if (props.state == "open"){
                    return( 
                        <>
                            <p className='md:text-green-600 ml-4 mb-2'>Your contract is currently open but you may alter it before it is accepted.</p>
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
                if (props.state == "open"){
                    return( <></>/*<Contractee {...props}></Contractee>*/);
                }
                if (props.state == "accepted"){

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
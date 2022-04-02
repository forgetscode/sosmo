import { useWallet } from '@solana/wallet-adapter-react';
import React, { FC, useCallback, useEffect, useState } from 'react';

interface ContractProps {
    discriminator: string,
    contractor: string,
    state: string,
}


const CreateTerms = ({setValue}:{setValue:any}) => {
    return(
        <>
            <div>
                <button  onClick={() => setValue(0)} className="text-white bg-emerald-700 ml-3 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 mt-2">
                    Submit
                </button>
                <button  onClick={() => setValue(0)} className="text-white bg-rose-700 ml-3 hover:bg-rose-800 focus:ring-4 focus:outline-none focus:ring-rose-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-rose-600 dark:hover:bg-rose-700 dark:focus:ring-rose-800 mt-2">
                    cancel
                </button>
            </div>
        </>
    )
}

const ChangeState =({setValue}:{setValue:any}) => {
    return(
        <>
            <button onClick={() => setValue(1)} className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2">
                Create terms
            </button>
        </>
    )
}

const Contractor:FC<ContractProps> = ( props ) => {
    const [state, setValue] = useState(0);

    return (
        <>
            {
                (state == 0) ? <ChangeState setValue={setValue}/> : <CreateTerms setValue={setValue}/>
            }
        </>
    )
}

const Contractee:FC<ContractProps> = ( props ) => {
    const [state, setState] = useState('unintialized');


    return (
        <>
            <button className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2">
                Accept terms
            </button>
        </>
    )
}

const Ongoing:FC<ContractProps> = ( props ) => {
    const [state, setState] = useState('unintialized');
    return (
        <>
            <button className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2">
                Accept terms
            </button>
        </>
    )
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


export const Contract:FC<ContractProps>= (props): JSX.Element => {
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
                if (props.state == "unintialized"){
                    return( <Contractor {...props}></Contractor>);
                }
                else{
                    return (<></>)
                }
            }
            else{
                if (props.state == "open"){
                    return( <Contractee {...props}></Contractee>);
                }
                if (props.state == "accepted"){

                }
            }
        }
        else {
            return( <>
                oyy what happened
            </>);
        }
    }
    return (
        <> 
        </>
    );

}
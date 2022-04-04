import { useUpdateStateMutation } from "../generated/graphql";

interface ContractProps {
    postid:number,
    discriminator: string,
    contractor: string,
    state: string,
}

export const ContracteeAccept = ( props:ContractProps ) => {
    const [ updateState ] = useUpdateStateMutation();
    return (
        <div className='flex flex-col'>
            <p className='ml-3 text-green-600 bg-slate-700 p-4 rounded-md'>DATA that is in the contract</p>
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

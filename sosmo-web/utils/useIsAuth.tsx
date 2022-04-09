import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";
import swal from 'sweetalert';


export const useIsAuth = () => {
    const { connected } = useWallet();
    const { data, loading, error } = useMeQuery();
    const router = useRouter();
    useEffect(() => {
        if ( !connected || (!loading && !data?.me)){
            swal("You are not connected!", "Wallet must be connected to create a listing.", "error");
            router.replace('/');
        }
    }, [loading, data, router, connected]);
}
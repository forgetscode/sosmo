import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";
import { errorNotification } from "../components/utils";


export const useIsAuth = () => {
    const { connected } = useWallet();
    const { data, loading, error } = useMeQuery();
    const router = useRouter();
    useEffect(() => {
        if ( !connected || (!loading && !data?.me)){
            errorNotification("You are not connected!", "Wallet must be connected to create a listing.");
            router.replace('/');
        }
    }, [loading, data, router, connected]);
}
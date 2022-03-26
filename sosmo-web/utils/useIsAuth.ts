import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
    const { connected } = useWallet();
    const { data, loading, error } = useMeQuery();
    const router = useRouter();
    useEffect(() => {
        if ( !connected || (!loading && !data?.me)){
            router.replace('/');
        }
    }, [loading, data, router, connected]);
}
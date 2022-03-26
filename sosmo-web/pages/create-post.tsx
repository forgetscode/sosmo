import { useRouter } from "next/router";
import { Nav } from "../components/Nav";
import { useCreatePostMutation } from "../generated/graphql";
import { useIsAuth } from '../utils/useIsAuth';

const createPost = () => {
    const router = useRouter();
    useIsAuth();
    const [ createPost ] = useCreatePostMutation();
    
    return (
        <>
        <Nav>

        </Nav>
        </>
    )
}

//className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow m-auto" 

export default createPost;
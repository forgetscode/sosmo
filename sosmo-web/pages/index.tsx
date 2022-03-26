import Link from "next/link";
import { Nav } from "../components/Nav";
import { SendOne } from "../components/SendOne";

const Index = () => {
  return (
    <>
      <Nav>
        {
          <div className="border-4 border-gray-200 rounded-lg h-96 flex justify-center items-center">
            <SendOne>{"mutation"}</SendOne>
          </div>
        }
      </Nav>
    </>
  )
}

export default Index;
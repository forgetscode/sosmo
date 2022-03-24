import { Nav } from "../components/Nav";
import { SendOne } from "../components/SendOne";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  return (
    <>
      <Nav>
        {<SendOne>{"mutation"}</SendOne>}
      </Nav>
    </>
  )
}

export default withApollo({ssr:false})(Index);
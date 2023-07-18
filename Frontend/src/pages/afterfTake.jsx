import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import Framednd from "@/components/Framednd"


function AfterTake() {
  return (
    <Layout>
        <div className="fixed top-4 left-4 h-10">After Take</div>
        <Link to="/finish">finish</Link>
        <div>
          <Framednd />
        </div>
    </Layout>
  );
}

export default AfterTake;
